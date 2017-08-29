angular.module('pg.promo', [])
.controller('PromoCtrl', function(
               $scope,
               $stateParams,
                $ionicModal
            ) {
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('Promo Merchant');
    });
    
    $scope.title = 'Promo';
    console.log($stateParams.obj);
//    $scope.promos = $stateParams.obj;
    $scope.promos = [];
    angular.forEach($stateParams.obj, function(v,k) {
        $scope.promos.push({
            name: $stateParams.obj[k].name,
            details: $stateParams.obj[k].details,
            end_date: $stateParams.obj[k].end_date,
            image: $stateParams.obj[k].image,
            brief: $stateParams.obj[k].brief.replace('<br>', '. '),
            id: $stateParams.obj[k].id
        });
    });
    $ionicModal.fromTemplateUrl('modal/promo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.toModal = function(title,details,expired,image,id) {
            $scope.modal.show();
            $scope.modtitle = title;
            $scope.expired = expired;
            $scope.id = id;
            $scope.image = image;
            $scope.desc = details;
        }
        $scope.backModal = function() {
            $scope.modal.hide();
        }
    });
});