angular.module('pg.main', [])
.controller('MainCtrl', function(
               $scope,
               $cordovaToast,
               $ionicHistory,
               $http,
               Service,
               $state,
               $ionicLoading,
               $cordovaNetwork,
               $ionicModal,
               $ImageCacheFactory,
               $cordovaSQLite,
               $ionicSlideBoxDelegate,
               $ionicNativeTransitions,
                //uiGmapGoogleMapApi,
               //uiGmapIsReady,
                $ionicPopup,
                $sce,
                $cordovaDevice
            ) {
    
    /* Init */
    //getLoc();
    $scope.loadReview = true;
    $scope.loadRecipe = true;
    $scope.loadArticle = true;
    $scope.loadVideo = true;
    $scope.loadEvents = true;

   /* Check if offline */
    document.addEventListener("deviceready", function() {
        navigator.splashscreen.hide();
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        function onSuccess(position) {
            localStorage.setItem('get_location',1);
            console.log('FOUND:  ' + position.coords.latitude + ',' + position.coords.longitude);
            localStorage.setItem("pg_lat",position.coords.latitude);
            localStorage.setItem("pg_long",position.coords.longitude);

            /* Link to map page */
            $scope.map = function() {
                $state.go('maps',{lat:position.coords.latitude,long:position.coords.longitude},{reload: true});
            };
        };

        function onError(error) {
            localStorage.removeItem('get_location');
            $cordovaToast.show(error.message,'long','bottom');
        }

        //FCMPlugin.getToken(
        //    function(token) {
        //        console.log('TOKEN: ',token);
        //    }
        //);
        //
        //FCMPlugin.onNotification(
        //    function(data){
        //        console.log('PUSH NOTIF', data);
        //        switch(data.id) {
        //            case '1': // C2C
        //                if(data.wasTapped){
        //                    var pop = $ionicPopup.alert({
        //                        title: "Push Notification",
        //                        template: "Testing FCM ID 1"
        //                    });
        //                    pop.then(function() {
        //                        $state.go('main',{},{reload: true});
        //                    });
        //                }
        //                break;
        //        }
        //    },
        //    function(res){
        //        console.log('onNotification callback successfully registered: ' + res);
        //    },
        //    function(err){
        //        console.log('Error registering onNotification callback: ' + err);
        //    }
        //);

        analytics.trackView('Main Home');
        var isOffline = $cordovaNetwork.isOffline();

        if(isOffline) {
            $cordovaToast.show('No data connection','long','bottom');
            $scope.slides = [];
            $scope.revShow = false;
        }
    });
    
    /* Request Phone Permission */
    function req() {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_PHONE_STATE, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            if(!status.hasPermission) {
                var errorCallback = function() {
                    $cordovaToast.show('Failed to access phone permission','long','bottom');
                }

                permissions.requestPermission(
                    permissions.READ_PHONE_STATE,
                    function(status) {
                        if(!status.hasPermission) {
                            errorCallback();
                        } else {
                            /* POST Device Information */
                            window.plugins.imeiplugin.getImei(function(imei) {
                                localStorage.setItem('pg_imei',imei);
                                var deviceModel = $cordovaDevice.getDevice().manufacturer+' '+$cordovaDevice.getDevice().model;
                                var dev = {
                                    method: 'POST',
                                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                                    data: 'imei='+imei+'&uuid='+$cordovaDevice.getDevice().uuid+'&platform='+$cordovaDevice.getDevice().platform+'&model='+deviceModel+'&version='+$cordovaDevice.getDevice().version+'&serial='+$cordovaDevice.getDevice().serial,
                                    url: Service.API+'/gadget/record_gadget'
                                }
                                $http(dev)
                                .then(function(res) {        
                                    console.log(res);
                                });
                            });
                        }
                    }, errorCallback
                );
            }
        }
    }
    
    ///* Link to map page */
    //$scope.map = function() {
    //    if(localStorage.getItem('get_location')==1) {
    //        $state.go('maps');
    //    } else {
    //        document.addEventListener("deviceready", function() {
    //            $cordovaToast.show('PerutGendut can\'t get your location','long','bottom');
    //        });
    //    }
    //};


    /* Get slide banner */
    $scope.slides = [];
    var slideBanner = {
        method: 'GET',
        url: Service.API+'/banner/get_all_android_slide_banners?offset=0&count=10'
    };
    $http(slideBanner)
    .then(function(res) {        
        $scope.slides = res.data.result;
        $ionicSlideBoxDelegate.update();
        
        // Image Caching
        var cacheImg = [];
        for(var i=0;i<res.data.result.length;i++) {
            cacheImg[i] =  Service.CDNbanner+'/'+res.data.result[i].id+'/'+res.data.result[i].file
        }
        $ImageCacheFactory.Cache(cacheImg);
    });
    
    /* Slide banner inAppBrowser */
    $scope.link = function(link,title) {
        var ref = window.open(link, '_blank', 'location=no');
        ref.addEventListener('loadstart', function() {
            //$ionicLoading.show({template: Service.loading});
        });
        ref.addEventListener('loadstop', function() {
            //$ionicLoading.hide();
        });
    }
    
    /* Nearby Button */
    $scope.nearby = function() {
        if(localStorage.getItem('get_location')==1) {
            $scope.modal.hide();
            $state.go('merchantnearby');
        } else {
            document.addEventListener("deviceready", function() {
                $cordovaToast.show('PerutGendut can\'t get your location','long','bottom');
            });
        }
    };
    
    /* Modal All Categories */
    document.addEventListener('deviceready', function() { // Get from SQlite
        //var sqcat = $cordovaSQLite.openDB({ name: "pg.db" });
        var sqcat = window.sqlitePlugin.openDatabase({ name: "pg.db",location: 'default'});
        $cordovaSQLite.execute(sqcat, "SELECT * FROM pg_categories")
        .then(function(res) {
            var qty     = res.rows.length;
            var list = [];
            for(i=0;i<qty;i++) {
                list[i] = res.rows.item(i);
            }
            $scope.cats = list;
        });
    });
    var getAllCat = { // Get from API
        method: 'GET',
        url: Service.API+'/merchant/get_all_merchant_categories'
    }
    $http(getAllCat)
    .then(function(res) {
        $scope.cats = res.data.result;
        document.addEventListener('deviceready', function() {
            //var dbcat = $cordovaSQLite.openDB({ name: "pg.db" });
            var dbcat = window.sqlitePlugin.openDatabase({ name: "pg.db",location: 'default'});
            $cordovaSQLite.execute(dbcat, "DELETE FROM pg_categories")
            .then(function() {
                for(i=0;i<res.data.result.length;i++) {
                    $cordovaSQLite.execute(dbcat, "INSERT INTO pg_categories (id, name) VALUES (?,?)", [
                        res.data.result[i]['id'],
                        res.data.result[i]['name']
                    ]);
                }
            }); 
        });
    });
    $scope.modtitle = 'All Categories';
    $ionicModal.fromTemplateUrl('modal/categories.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.allcat = function() {
            $scope.modal.show();
        }
        $scope.backModal = function() {
            $scope.modal.hide();
        }
        $scope.toListMerchant = function(nama,id) {
            console.log('PRESSED');
            if(localStorage.getItem('get_location')==1) {
                $scope.modal.hide();
                $state.go('merchant',{id:id,cat:nama},{reload: true});
            } else {
                document.addEventListener("deviceready", function() {
                    $cordovaToast.show('PerutGendut can\'t get your location','long','bottom');
                });
            }
        }
    });
    
    /* Get Review */
    var getReview = {
        method: 'GET',
        url: Service.API+'/review/get_all_reviews?offset=0&count=1'
    }
    $http(getReview)
    .then(function(res) {
        $scope.revShow = true;
        $scope.loadReview = false;
        var rev = res.data.result;
        $scope.review = {
            name: rev[0].name,
            date: rev[0].posted,
            id: rev[0].id,
            img: rev[0].image,
            kutipan: rev[0].brief,
            detail: rev[0].details
        }
    });
    
    /* Get Video */
    var getVideo = {
        method: 'GET',
        url: Service.API+'/video/get_all_videos?offset=0&count=1'
    }
    $http(getVideo)
    .then(function(res) {
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }        
        $scope.revShow = true;
        $scope.loadVideo = false;
        var vid = res.data.result;
        $scope.src = 'https://www.youtube.com/embed/'+vid[0].youtube_id;
        $scope.video = {
            name: vid[0].name,
            date: vid[0].published,
            id: vid[0].id,
            yid: vid[0].youtube_id,
            img: vid[0].image,
            detail: vid[0].details
        }
    });
    
    /* Get Recipes */
    var getRecipe = {
        method: 'GET',
        url: Service.API+'/post/get_all_recipes?offset=0&count=2'
    }
    $http(getRecipe)
    .then(function(res) {
        $scope.loadRecipe = false;
        var rec = res.data.result;
        $scope.recipes = rec;
    });
    
    /* Get Events */
    var getEvents = {
        method: 'GET',
        url: Service.API+'/post/get_all_events?offset=0&count=3'
    }
    $http(getEvents)
    .then(function(res) {
        $scope.loadEvents = false;
        var rec = res.data.result;
        $scope.events = rec;
    });
    
    /* Get Articles */
    var getArticle = {
        method: 'GET',
        url: Service.API+'/post/get_all_articles?offset=0&count=3'
    }
    $http(getArticle)
    .then(function(res) {
        $scope.loadArticle = false;
        var art = res.data.result;
        $scope.articles = art;
    });
    
    document.getElementById("main").addEventListener("scroll", function() {
        var sel = document.getElementById("select"),
            body = document.getElementById("main");
        if(body.scrollTop > sel.offsetHeight+200) {
            document.getElementById("sel").classList.remove("hide");
            document.getElementById("sel").classList.add("animated");
            document.getElementById("sel").classList.add("slideInDown");
        } else {
            document.getElementById("sel").classList.add("hide");
        }
    })
});