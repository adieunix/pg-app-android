angular.module('pg.details', [])
.controller('DetailsCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $stateParams,
               $ionicLoading,
               Service,
               $http,
               $window,
               $ionicModal,
               $state,
               $ionicPopup,
               $cordovaNetwork,
               $cordovaToast,
                $filter
            ) {
    
    /* Init */
    $scope.mores = true; 
    $scope.rating = {};  
    $scope.loadDetail = false;
    $scope.loadDetailOff = true;
    var ses_user = JSON.parse(localStorage.getItem('pg_user'));
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('Merchant Details');
    });
    
    /* Get photo profile */
    if(localStorage.getItem('pg_avatar') !== null) {
        $scope.imgProf = 'data:image/png;base64,'+localStorage.getItem('pg_avatar');
    } else {
        $scope.imgProf = 'img/empty.png';
    }
    
    /* Klik rate */
    $scope.klikRate = function() {
        $state.go('login');
    }
    
    /* Promo Condition */
    if($stateParams.promo>0) {
        $scope.totpt = true;
        $scope.totp = $stateParams.promo;
    } else {
        $scope.totpt = false;
    }
    
    /* Check if offline */
    document.addEventListener("deviceready", function() {        
        var isOffline = $cordovaNetwork.isOffline();        
        if(isOffline) {
            $cordovaToast.show('No data connection','long','bottom');
        }        
    });
    
    $scope.name = $stateParams.name;
    $scope.cat = $stateParams.cat;
    var desc = $stateParams.desc;    

//    $scope.name = 'Cafe Laris Manis';
//    $scope.cat = 'Indonesian';
//    var desc = 'Anomali Coffee adalah salah satu dari coffee shop khusus yang menyediakan berbagai macam kopi bubuk dari seluruh penjuru Indonesia.';
    var exc = desc.length>100 ? '...<div class="rmore">read more</div>' : '';
    $scope.desc = $filter('limitTo')(desc, 100)+exc;
//    $scope.place = 'Matraman, Jakarta';
    
//    $scope.address = 'Grand Indonesia Shopping Town West Mall Level 3A #ED1 - 02A, 02B Jalan MH. Thamrin No. 1. Jakarta Pusat';
    
    // Popup Details 
    $scope.rmore = function() {
        $ionicPopup.alert({
            template: desc,
            title: 'Details',
            cssClass: 'custom-alert custom-left',
            buttons: [
                {text: 'OK',
                type: 'btn-alert'}
            ]
        });
    }
    
    // Get merchant details API
    var merchant = {
        method: 'GET',
        url: Service.API+'/merchant/get_merchant_branch_by_id?id='+$stateParams.id
//        url: Service.API+'/merchant/get_merchant_branch_by_id?id=208'
    }
    $http(merchant)
    .then(function(res) {
        $scope.loadDetail = true;
        $scope.loadDetailOff = false;
        
        /* Get Rating */
        var total = res.data.result.merchant_ratings;
//        console.log(ses_user);
        if(ses_user == null) { // no login
            $scope.rateThis = true;
        } else { // login
            if(total != null) { // null rating
                $scope.rateThis = false;
                $scope.username = ses_user.first_name+' '+ses_user.last_name;
                var found = $filter('filter')(total,{member_id: ses_user.id});
//                console.log(found[0]);
                if(found.length>0) { // udah rating
                    $scope.noRating = false;
                    $scope.hasRating = true;
                    $scope.hasname = found[0].first_name+' '+found[0].last_name;
                    $scope.hasdate = new Date(found[0].updated_at);
                    $scope.hasdetail = found[0].comment;
                    $scope.hasvalue = found[0].value;
                    $scope.hasId = found[0].id;
                } else { // blm rating // null rating // logged
                    $scope.noRating = true;
                    $scope.hasRating = false;
                }
            }
        }
        
        /* User Rating */
        $scope.user = {rate: 0}
        $scope.$watch('user.rate', function() {
            if($scope.user.rate > 0)
            $ionicPopup.show({
                template: '<rating ng-model="'+$scope.user.rate+'" max="5" readonly="true"></rating><textarea placeholder="Write your comment" id="texta"></textarea>',
                cssClass: 'custom-alert',
                buttons: [
                    {
                        text: 'Submit',
                        type: 'btn-submit',
                        scope: $scope,
                        onTap: function(e) {
                            var ratee = {
                                method: 'POST',
                                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                                url: Service.API+'/merchant/add_rating',
                                data: 'merchant_branch_id='+$stateParams.id+'&member_id='+ses_user.id+'&rate='+$scope.user.rate+'&comment='+document.getElementById("texta").value
                            }
                            $http(ratee)
                            .then(function(res) {
                                $ionicPopup.alert({
                                    template: res.data.result,
                                    cssClass: 'custom-alert',
                                    buttons: [
                                        {
                                            text: 'OK',
                                            type: 'btn-alert',
                                            onTap: function(e) {
                                                $state.go('details',{},{reload: true});
                                            }
                                        }
                                    ]
                                });
                            });
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'btn-cancel',
                        onTap: function(e) {
                            $scope.user = {rate:0}
                        }
                    }
                ]
            });
        }); 
        
        /* Edit Rating */
        $scope.edit = function(id,val,komen) {
            $scope.uprate = {rate:val}
            $ionicPopup.alert({
                template: '<rating ng-model="uprate.rate" max="5" readonly="false"></rating><textarea id="texta" placeholder="Write your comment">'+komen+'</textarea>',
                cssClass: 'custom-alert',
                scope: $scope,
                buttons: [
                    {
                        text: 'Update',
                        type: 'btn-submit',
                        scope: $scope,
                        onTap: function(e) {
                            //console.log($scope.uprate.rate);
                            var update = {
                                method: 'POST',
                                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                                url: Service.API+'/merchant/update_rating',
                                data: 'id='+id+'&rate='+$scope.uprate.rate+'&comment='+document.getElementById("texta").value
                            }
                            $http(update)
                            .then(function(res) {
                                $ionicPopup.alert({
                                    template: res.data.result,
                                    cssClass: 'custom-alert',
                                    buttons: [
                                        {
                                            text: 'OK',
                                            type: 'btn-alert',
                                            onTap: function(e) {
                                                $state.go('details',{},{reload: true});
                                            }
                                        }
                                    ]
                                });
                            });
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'btn-cancel',
                        onTap: function(e) {
                            $state.go('details');
                        }
                    }
                ]
            });
        }
        
        if(total == null) {
            if(ses_user != null) $scope.noRating = true;
            $scope.rating = {};            
            $scope.rating.rate = 0;
            $scope.rates = 'N/A';
            $scope.star = false;
            $scope.rtotal = 'No ratings yet';
            $scope.ratings = [];
        } else {
            $scope.star = true;
            var tot = 0;
            for(var i = 0; i < total.length; i++) {
                tot += Number(total[i].value);
            }
            var avg = tot / total.length
            $scope.rating = {};
            $scope.rate = avg.toFixed(1);
            $scope.rates = avg.toFixed(1);
            $scope.rating.rate = avg.toFixed(1);
            $scope.rtotal = total.length+' <i class="ion-android-person"></i>';
//            $scope.ratings = total;
            $scope.ratings = [];
            angular.forEach(total, function(v,k) {
                $scope.ratings.push({
                    name: total[k].first_name+' '+total[k].last_name,
                    value: total[k].value,
                    date: new Date(total[k].updated_at),
                    detail: total[k].comment,
                    avatar: total[k].avatar
                });
            });
        }
        
        /* Get merchant images */
        var mimgs = res.data.result.merchant_images;        
        $scope.gals =[];
        $scope.items = [];
        angular.forEach(mimgs, function(v,k) {
            $scope.items.push({
                image: Service.APIcdn+'/merchant_images/'+mimgs[k].id+'/'+mimgs[k].image,
                name: mimgs[k].details,
//                thumb: Service.APIcdn+'/merchant_images/'+mimgs[k].id+'/thumb_'+mimgs[k].image
            });
        });
        angular.forEach(mimgs, function(v,k) {
            $scope.gals.push({
                image: Service.APIcdn+'/merchant_images/'+mimgs[k].id+'/'+mimgs[k].image,
                name: mimgs[k].details,
//                thumb: Service.APIcdn+'/merchant_images/'+mimgs[k].id+'/thumb_'+mimgs[k].image
            });
        });
        
        /* Condition show images */
        if($scope.items.length < 4) {
            $scope.items = $scope.items;
            $scope.mores = false;
        } else {
            $scope.items = [{image:$scope.items[0].image,name:mimgs[0].details},{image:$scope.items[1].image,name:mimgs[1].details},{image:$scope.items[2].image,name:mimgs[2].details}];
        }
        
        /* to Gallery Photos */
        $scope.modtitle = $stateParams.name+' Photos';
        $ionicModal.fromTemplateUrl('modal/gallery.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.toGallery = function() {
                $scope.modal.show();
//                console.log($scope.gals);
            }
            $scope.backModal = function() {
                $scope.modal.hide();
            }
        });
        
        var dat = res.data.result;
        var latlng = {lat:dat.latitude,lng:dat.longitude};
        $scope.address = dat.address;
        // to phone
        $scope.toPhone = function() {
            if(dat.phone == '') {
                $ionicPopup.alert({
                    template: 'No phone number',
                    cssClass: 'custom-alert',
                    buttons: [
                        {text: 'OK',
                        type: 'btn-alert'}
                    ]
                });
            } else {
                document.location.href = 'tel:'+dat.phone;
            }   
        }
        /* to Maps */
        $scope.toMaps = function() {
            $state.go('maps', {type:2,lat:dat.latitude,long:dat.longitude,name:$stateParams.name,cat:$stateParams.cat});
        }
        /* to Promo */
        $scope.toPromo = function() {
            if($stateParams.promo>0) {
                $state.go('promo',{obj:res.data.result.merchant_promos});
            } else {
                $ionicPopup.alert({
                    template: 'Currently there is no promo',
                    cssClass: 'custom-alert',
                    buttons: [
                        {text: 'OK',
                        type: 'btn-alert'}
                    ]
                });
            }            
        }
        
        document.addEventListener('deviceready', function() {
            plugin.google.maps.Geocoder.geocode({'position':latlng}, function(loc) {
                if(loc.length) {
                    var result = loc[0];
                    $scope.place = result.subAdminArea;
                } else {
                    $scope.place = dat.city;
                }
            });
        });
    });

    document.getElementById("details").addEventListener("scroll", function() {
        var header = document.getElementById("header"),
            body = document.getElementById("details");
        if(body.scrollTop > header.offsetHeight) {
            header.classList.add("no-trans");
            document.getElementById("titdetail").classList.add("opacity");
        } else {
            header.classList.remove("no-trans");
            document.getElementById("titdetail").classList.remove("opacity");
        }
    })
});