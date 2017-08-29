angular.module('starter', 
['ionic','ngCordova','ngMessages','ionic.ion.imageCacheFactory','ionic-native-transitions','ion-gallery','uiGmapgoogle-maps','ionic.rating',

    // Modules
    'pg.main',
    'pg.maps',
    'pg.more',
    'pg.details',
    'pg.login',
    'pg.peta',
    'pg.merchant',
    'pg.list',
    'pg.listd',
    'pg.promo',
    'pg.user',
    'pg.static',
    'pg.merchantnearby'
])

.directive('footer', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl:'templates/footer.html?1'
    }
})

.directive('header', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl:'templates/header.html?1'
    }
})

.directive('modheader', function() {
    return {
        restrict: 'A',
        replace: true,
        templateUrl:'templates/modheader.html'
    }
})

.directive('confirmPwd', function($interpolate, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModelCtrl) {

          var pwdToMatch = $parse(attr.confirmPwd);
          var pwdFn = $interpolate(attr.confirmPwd)(scope);

          scope.$watch(pwdFn, function(newVal) {
              ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
          })

          ngModelCtrl.$validators.password = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return value == pwdToMatch(scope);
          };

        }
    }
})

.run(function($ionicPlatform,$ionicHistory,$state,$cordovaSQLite,$cordovaGoogleAnalytics,$cordovaToast) {
    ionic.Platform.ready(function() {
        analytics.startTrackerWithId('UA-72370034-2');          
        $ionicPlatform.registerBackButtonAction(function (evt) {
            if($state.current.name=="main") {
                ionic.Platform.exitApp();
            } else {
                $ionicHistory.goBack(-1);
            }
        }, 100);
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        
        // Init SQLite
        //var db = $cordovaSQLite.openDB({ name: "pg.db" });
        var db = window.sqlitePlugin.openDatabase({ name: "pg.db",location: 'default'});
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS pg_categories (cat_id integer primary key, id integer, name varchar(50))');
        });
    });
})

.factory('Service', function() {
    return {
        API: 'http://api.perutgendut.com/index.php', // Live Production
        //API: 'http://stage-api.perutgendut.com/index.php', // Staging
        APIcdn: 'http://cdn.perutgendut.com/uploads',
        CDNbanner: 'http://cdn.perutgendut.com/uploads/banners',
        CDNlogo: 'http://cdn.perutgendut.com/uploads/merchants',
        loading: '<div class="row load-spin"><ion-spinner icon="spiral"></ion-spinner><div class="load-text">Please wait..</div></div>',
        maps: '<div class="row load-spin"><ion-spinner icon="spiral"></ion-spinner><div class="load-text">Getting merchants..</div></div>',
        login: '<div class="row load-spin"><ion-spinner icon="spiral"></ion-spinner><div class="load-text">Login..</div></div>',
        uploading: '<div class="row load-spin"><ion-spinner icon="spiral"></ion-spinner><div class="load-text">Uploading..</div></div>'
    }
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $provide, $ionicNativeTransitionsProvider, $ionicConfigProvider, $logProvider, uiGmapGoogleMapApiProvider, $compileProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.headers.common = {
        'Authorization': 'Basic YWRtaW5wZ2FwaTphcGkyMDE2cGc3MzM3',
        'Accept': 'application/json'
    }
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
//    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|ftp|mailto|file|tel|data)/);
    
    // Native Transition
    $ionicNativeTransitionsProvider.enable(true);
    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'up'
    });
    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });
    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 300
    });
    
    // Native Scrolling
    $ionicConfigProvider.scrolling.jsScrolling(false);
    
    // Disable Angular-Batarang Debug
    $logProvider.debugEnabled(false);
    
    // Max Cache
    $ionicConfigProvider.views.maxCache(5);
    
    $stateProvider    
    .state('peta', {
        url: "/peta",
        templateUrl: "app/MapsJs/peta.html",
        controller: 'PetaCtrl',
        params: {
            lat: null,
            long: null
        }
    })
        
    .state('login', {
        url: "/login",
        templateUrl: "app/LoginPage/login.html",
        controller: 'LoginCtrl'        
    })
    
    .state('static', {
        cache: false,
        url: "/static",
        templateUrl: "app/StaticPage/static.html",
        controller: 'StaticCtrl',
        params: {
            type: null
        }
    })
    
    .state('list', {
        url: "/list",
        templateUrl: "app/ListPage/list.html",
        controller: 'ListCtrl',
        params: {
            id: null
        }
    })
    
    .state('listd', {
        url: "/listd",
        templateUrl: "app/ListDetails/listd.html",
        controller: 'ListdCtrl',
        params: {
            details: null,
            title: null,
            yid: null,
            type: null
        }
    })
    
    .state('merchantnearby', {
        cache: false,
        url: "/merchantnearby",
        templateUrl: "app/MerchantNearby/merchantnearby.html",
        controller: 'MerchantnearbyCtrl',
        params: {
            id: null,
            cat: null
        }
    })
    
    .state('merchant', {
        cache: false,
        url: "/merchant",
        templateUrl: "app/MerchantList/merchant.html",
        controller: 'MerchantCtrl',
        params: {
            id: null,
            cat: null
        }
    })
    
    .state('promo', {
        url: "/promo",
        templateUrl: "app/PromoPage/promo.html",
        controller: 'PromoCtrl',
        params: {
            obj: null
        }
    })
    
    .state('user', {
        cache: false,
        url: "/user",
        templateUrl: "app/UserPage/user.html",
        controller: 'UserCtrl'
    })
        
    .state('maps', {
        cache: true,
        url: "/maps",
        templateUrl: "app/MapsPage/maps.html",
        controller: 'MapsCtrl',
//        nativeTransitions: null,
        params: {
            lat: null,
            long: null,
            type: null,
            name: null,
            cat: null
        }
    })

    .state('mapx', {
        cache: false,
        url: "/mapx",
        templateUrl: "app/MapsPage/mapx.html",
        controller: 'MapsCtrl',
        params: {
            lat: null,
            long: null
        }
    })
    
    .state('more', {
        cache: false,
        url: "/more",
        templateUrl: "app/MorePage/more.html",
        controller: 'MoreCtrl',
        nativeTransitionsAndroid: {
            "type": "slide",
            "direction": "right",
            "duration": 300
        }
    })
    
    .state('details', {
        cache: false,
        url: "/details",
        templateUrl: "app/DetailsPage/details.html",
        controller: 'DetailsCtrl',
        params: {
            id: null,
            name: null,
            cat: null,
            desc: null,
            promo: null
        }
    })
    
    .state('main', {
        url: "/main",
        templateUrl: "app/Home/main.html",
//        nativeTransitions: null,
        controller: 'MainCtrl'
    })
    
    $urlRouterProvider.otherwise('/main');
})