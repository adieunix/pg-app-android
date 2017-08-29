angular.module('pg.merchant', [])
.controller('MerchantCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $cordovaNetwork,
               $cordovaToast,
               $state,
               $http,
               Service,
               $stateParams,
               $ionicHistory,
                $ionicModal,
                $cordovaSQLite
            ) {    
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('Merchant List');
    });
    
    // Check if offline
    document.addEventListener("deviceready", function() {        
        var isOffline = $cordovaNetwork.isOffline();        
        if(isOffline) {
            $cordovaToast.show('No data connection','long','bottom');
        }        
    });
    
    $scope.title = $stateParams.cat;
    $ionicHistory.clearCache();
    
    /* Show Modal All Categories */
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
            $state.go('main');
        }
        $scope.toListMerchant = function(nama,id) {
            if(localStorage.getItem('pg_lat')) {
                $scope.modal.hide();
                $state.go('merchant',{id:id,cat:nama},{reload: true});
            } else {
                document.addEventListener("deviceready", function() {
                    $cordovaToast.show('PerutGendut can\'t get your location','long','bottom');
                });
            }
        }
    });
    
    /* Nearby Button */
    $scope.nearby = function() {
        if(localStorage.getItem('pg_lat')) {
            $scope.modal.hide();
            $state.go('merchantnearby');
        } else {
            document.addEventListener("deviceready", function() {
                $cordovaToast.show('PerutGendut can\'t get your location','long','bottom');
            });
        }
    }
    
    /* Infinite Loop */
    $scope.noMoreItemsAvailable = false;    
    var c = 0;
    $scope.loadMore = function() {
        var counter = c=c+1;
        var getMerchant = {
            method: 'GET',
            url: Service.API+'/merchant/get_merchant_branches_within_radius_by_category_id?cid='+$stateParams.id+'&rad=20&lat='+localStorage.getItem("pg_lat")+'&long='+localStorage.getItem("pg_long")+'&offset='+(counter-1)
//            url: Service.API+'/merchant/get_merchant_branches_within_radius_by_category_id?cid=5&rad=10&lat=-6.172802&long=106.787386&offset='+(counter-1)
        }
        $http(getMerchant)  
        .then(function(res) {
            var dat = res.data.result;
            if(dat.length==0) {
                $scope.noMoreItemsAvailable = true;
                $scope.nohis = 'No merchant';
            } else {                
                $scope.items.push({
                    photo: dat[0].merchant_image,
                    name: dat[0].merchant_name,
                    detail: dat[0].merchant_details,
                    id: dat[0].merchant_id,
                    mid: dat[0].id,
                    jarak: Math.ceil(dat[0].distance).toFixed(1),
                    addr: dat[0].address,
                    cat: dat[0].merchant_category_name
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');                
                setTimeout(function(){ 
                    $scope.spin = true;
                }, 500);
            }            
        }, function(res) {
            if(res.data.status=='error') {
                $scope.noMoreItemsAvailable = true;
                $scope.nohis = 'No merchant';
            }
        });        
    };
    $scope.items = [];
});