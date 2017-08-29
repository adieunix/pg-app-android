angular.module('pg.listd', [])
.controller('ListdCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $cordovaNetwork,
               $cordovaToast,
               $ionicPopup,
               $state,
               $ionicHistory,
               $stateParams,
               $sce
            ) {
    // 1. Review
    // 2. Article
    // 3. Event
    // 4. Recipe
    // 5. Video
    
    $scope.konten = $stateParams.details;
    $scope.judul = $stateParams.title;
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }
    
    if($stateParams.type==1) {
        $scope.title = 'Review'; 
        $scope.videos = false;
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Review Details');
        });
    }
    
    if($stateParams.type==2) {
        $scope.title = 'Article';
        $scope.videos = false;
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Article Details');
        });
    }
    
    if($stateParams.type==3) {
        $scope.title = 'Event';
        $scope.videos = false;
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Event Details');
        });
    }
    
    if($stateParams.type==4) {
        $scope.title = 'Recipe';
        $scope.videos = false;
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Recipe Details');
        });
    }

    if($stateParams.type==5) {
        $scope.title = 'Video';
        $scope.src = 'https://www.youtube.com/embed/'+$stateParams.yid;
        $scope.videos = true;
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Video Details');
        });
    }
    
});