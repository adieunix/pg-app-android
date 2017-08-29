angular.module('pg.maps', [])
.controller('MapsCtrl', function(
               $scope,
               $cordovaToast,
               $ionicHistory,
               $ionicPopup,
               $http,
               Service,
               $cordovaNetwork,
               $cordovaGeolocation,
               $ionicActionSheet,
               $ionicModal,
               $stateParams,
               $ionicNativeTransitions,
               $ionicLoading,
               $state
            ) {

    /* Mapx sample */
    if($state.current.name=="mapx") {
        console.log('SHOULD BE MAPX');
        var map;
        document.addEventListener("deviceready", function() {
            var mx = document.getElementById("mapx");
            const GOOGLE = new plugin.google.maps.LatLng(-6.198157,106.8578479);
            map = plugin.google.maps.Map.getMap(mx, {
                'camera': {
                    'latLng': GOOGLE,
                    'zoom': 15
                }
            });
            map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
                map.addMarker({
                    position: {lat: -6.198157, lng: 106.8578479},
                    animation: plugin.google.maps.Animation.BOUNCE
                }, function(marker) {
                    marker.showInfoWindow();
                    marker.on(plugin.google.maps.event.INFO_CLICK, function() {
                        alert("Hello world!");
                    });
                });
            });
        }, false);
    } else {
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('Merchant Maps Marker');
        });

        $ionicLoading.show({template: Service.maps});

        document.addEventListener("deviceready", function() {
            /* Check if offline */
            var isOffline = $cordovaNetwork.isOffline();
            if(isOffline) {
                $cordovaToast.show('No data connection','long','center');
            }

            /* Init map */
            var mapDiv = document.getElementById("map_canvas");

            if($stateParams.type != null) {  // locate merchant map details
                $scope.navigate = true;
                $scope.title = $stateParams.name;
                $ionicLoading.hide();

                var loc = new plugin.google.maps.LatLng($stateParams.lat,$stateParams.long);
                var myloc = new plugin.google.maps.LatLng(localStorage.getItem("pg_lat"),localStorage.getItem("pg_long"));
                var mapMerchant = plugin.google.maps.Map.getMap(mapDiv, {
                    'camera': {
                        'latLng': loc,
                        'zoom': 15
                    }
                });

                mapMerchant.clear();
                mapMerchant.off();

                $scope.goPeta = function() {
                    $state.go('peta',{lat:$stateParams.lat,long:$stateParams.long});
                };

                /* locate merchant branch */
                mapMerchant.addEventListener(plugin.google.maps.event.MAP_READY, function() {
                    mapMerchant.addMarker({
                        'position': loc,
                        'title':$stateParams.name,
                        'icon': 'www/img/marker-'+$stateParams.cat+'.png'
                    },function(marker) {
                        mapMerchant.animateCamera({
                            'target': loc,
                            'zoom': 15
                        }, function() {
//                        marker.showInfoWindow();
                        });
                    });
                    mapMerchant.addMarker({
                        'position': myloc,
                        'icon': 'www/img/our.png'
                    }, function(marker) {
                        //marker.showInfoWindow();
                    });
                });

            } else { // locate all merchants
                const GOOGLE = new plugin.google.maps.LatLng($stateParams.lat,$stateParams.long);
                var map = plugin.google.maps.Map.getMap(mapDiv, {
                    'camera': {
                        'latLng': GOOGLE,
                        'zoom': 15
                    }
                });

                map.setClickable(true);
                map.clear();
                map.off();
                $scope.navigate = false;
                $scope.title = 'Nearby Merchant';

                map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
                    /* Marker for my location */
                    map.addMarker({
                        'position': GOOGLE,
                        'icon': 'www/img/our.png'
                    }, function(marker) {
                        //marker.showInfoWindow();
                    });

                    /* Marker for Nearby Merchant */
                    var nearby = {
                        method: 'GET',
                        url: Service.API+'/merchant/get_merchant_branches_within_radius?rad=5&lat='+$stateParams.lat+'&long='+$stateParams.long
                    }
                    $http(nearby)
                        .then(function(res) {
                            $ionicLoading.hide();
                            var das = [];
                            var merchant = res.data.result;
                            //angular.forEach(merchant, function(val, key){
                            //    das.push({
                            //        position: {
                            //            lng: val.latitude,
                            //            lat: val.longitude
                            //        },
                            //        title: val.merchant_name,
                            //        icon: (val.total_promo>0) ? 'www/img/marker-'+val.merchant_category_name+'-promo.png' : 'www/img/marker-'+val.merchant_category_name+'.png',
                            //    });
                            //});

                            for(var i = 0;i<merchant.length;i++) {
                                var locObj = new plugin.google.maps.LatLng(merchant[i].latitude,merchant[i].longitude);
                                map.addMarker({
                                    'position': locObj,
                                    'title': merchant[i].merchant_name,
                                    'icon': (merchant[i].total_promo>0) ? 'www/img/marker-'+merchant[i].merchant_category_name+'-promo.png' : 'www/img/marker-'+merchant[i].merchant_category_name+'.png',
                                    'data': {
                                        id:merchant[i].id,
                                        id_merchant:merchant[i].merchant_id,
                                        img:merchant[i].merchant_image,
                                        name:merchant[i].merchant_name,
                                        desc:merchant[i].merchant_details,
                                        cat:merchant[i].merchant_category_name,
                                        promo:merchant[i].total_promo
                                    }
                                }, function(marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function(e) {
                                        map.setClickable(false);
                                        marker.hideInfoWindow();
                                        var get = marker.get('data');
                                        if(get.img==null) {
                                            var gbr = 'img/img-null.png';
                                        } else {
                                            var gbr = get.img;
                                        }

                                        var show = $ionicPopup.show({
                                            template: '<div class="modal-left"><img class="img-res" ng-src="http://cdn.perutgendut.com/uploads/merchants/'+get.id_merchant+'/'+gbr+'"></div><div class="modal-right"><div class="modal-title">'+get.name+'</div><div class="modal-desc">'+get.desc+'</div></div>',
                                            cssClass: 'custom-pop',
                                            buttons: [
                                                {
                                                    text: 'x',
                                                    type: 'btn-close',
                                                    onTap: function(e) {
                                                        map.setClickable(true);
                                                    }
                                                },
                                                {
                                                    text: 'Go to merchant',
                                                    type: 'button-assertive',
                                                    onTap: function(e) {
                                                        map.setClickable(true);
                                                        map.clear();
                                                        map.off();
                                                        $state.go('details',{id:get.id,name:get.name,cat:get.cat,desc:get.desc,promo:get.promo});
                                                    }
                                                }
                                            ]
                                        });
                                    });
                                });
                            }
                        }, function() {
                            $ionicLoading.hide();
                            var pop = $ionicPopup.alert({
                                template: 'Tidak ada merchant di sekitar anda',
                                cssClass: 'custom-alert'
                            });
                            pop.then(function() {
                                $state.go('main',{},{reload: true});
                            });
                        }); // end XHR (Nearby merchant)
                });
            }
        });
    }
   

});