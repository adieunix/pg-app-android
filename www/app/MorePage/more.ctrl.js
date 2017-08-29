angular.module('pg.more', [])
.controller('MoreCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $cordovaNetwork,
               $cordovaToast,
               $ionicPopup,
               $state,
               $ionicHistory
            ) {
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('More');
    });
    
    $scope.title = '';
    if(localStorage.getItem('pg_user')==null) {
        $scope.login = true;
        $scope.user = false;
    } else {
        $scope.login = false;
        $scope.user = true;
    }
    
    /* Check if offline */
    document.addEventListener("deviceready", function() {        
        var isOffline = $cordovaNetwork.isOffline();        
        if(isOffline) {
            $cordovaToast.show('No data connection','long','bottom');
        }        
    });
    
    $scope.logout = function() {
//        localStorage.removeItem('pg_lat');
//        localStorage.removeItem('pg_long');
        localStorage.removeItem('pg_user');
        localStorage.removeItem('pg_avatar');
        $ionicPopup.alert({
            template: 'Successfully logged out',
            cssClass: 'custom-alert',
            buttons: [
                {text: 'OK',
                type: 'btn-alert'}
            ]
        }).then(function() {
            $state.go('main');
        });
    }
});