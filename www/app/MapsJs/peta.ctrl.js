angular.module('pg.peta', [])
.controller('PetaCtrl', function(
               $scope,
               $ionicNativeTransitions,
               uiGmapGoogleMapApi,
               uiGmapIsReady,
               Service,
               $stateParams,
               $http,
               $ionicPopup,
               $state,
               $ionicHistory,
               $cordovaNetwork,
               $cordovaToast
            ) {
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('MapJS Route');
    });
    
    $scope.modtitle = 'Route';
    $scope.backModal = function() {
        $ionicHistory.goBack();
    }
    
    // Check if offline
    document.addEventListener("deviceready", function() {        
        var isOffline = $cordovaNetwork.isOffline();        
        if(isOffline) {
            $cordovaToast.show('No data connection','long','bottom');
        }        
    });
    
    $scope.myLocation = {
        lng : '',
        lat: ''
    }

    $scope.options = {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 0
    };
  
    $scope.drawMap = function(position) {
        //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
        getMap(position.coords.latitude,position.coords.longitude);
    }
    
    function getMap(lat,lng) {
        $scope.map = {
            center: {
                latitude: $stateParams.lat,
                longitude: $stateParams.long
            },
            zoom: 14,
            pan: 1,
            control: {}
        };
      
        $scope.directions = {
            origin: lat+','+lng,
            destination: $stateParams.lat+','+$stateParams.long,
//            origin: '-6.172823, 106.787258',
//            destination: '-6.183503, 106.789475',
            showList: false
        }
        
        $scope.dir = {
            id: 'map',
            position: [{
                latitude: -6.200572,
                longitude: 106.856693
            }],
            icon: ['http://www.perutgendut.com/uploads/start.png']
        }
        
        // instantiate google map objects for directions
        var rendererOptions = {
            suppressMarkers : true
        }
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        var directionsService = new google.maps.DirectionsService();
        var geocoder = new google.maps.Geocoder();
  
        // get directions using google maps api
        uiGmapGoogleMapApi.then(function(map) {
            var request = {
                origin: $scope.directions.origin,
                destination: $scope.directions.destination,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap($scope.map.control.getGMap());
                    directionsDisplay.setPanel(document.getElementById('directionsList'));
                    $scope.directions.showList = true;
                } else {
                    var failed = $ionicPopup.alert({
                        template: 'Sorry, route unsuccesfull!',
                        cssClass: 'custom-alert',
                        buttons: [
                            {text: 'OK',
                            type: 'btn-alert'}
                        ]
                    });
                    failed.then(function() {
                        $ionicHistory.goBack(-2);
                    });
                }
            });
        });
    }

    $scope.handleError = function(error) {  
//        console.warn('ERROR(' + error.code + '): ' + error.message);
        getMap($stateParams.lat,$stateParams.long);
    }

    navigator.geolocation.getCurrentPosition($scope.drawMap, $scope.handleError, $scope.options);  
});