angular.module('pg.user', [])
.controller('UserCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $cordovaNetwork,
               $http,
               Service,
               $ionicLoading,
               $ionicPopup,
               $state,
               $cordovaCamera,
               $ionicModal
            ) {

    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('User Profile');
    });
    
    $scope.title = 'Profile';
    var ses_user = JSON.parse(localStorage.getItem('pg_user'));
    $scope.task = {
        fname: ses_user.first_name,
        lname: ses_user.last_name,
        phone: ses_user.phone
    }
    
    /* Get photo profile */
    if(localStorage.getItem('pg_avatar') !== null) {
        $scope.imgProf = 'data:image/png;base64,'+localStorage.getItem('pg_avatar');
    } else {
        $scope.imgProf = 'img/empty.png';
    }
    
    /* POST avatar to API */
    function postImg(id) {
        document.addEventListener("deviceready", function () {
            if(id==1){
                var tipe = Camera.PictureSourceType.CAMERA;
            } else {
                var tipe = Camera.PictureSourceType.PHOTOLIBRARY;
            }
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: tipe,
                allowEdit: true,
                targetWidth: 250,
                targetHeight: 250,
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) { 
                localStorage.setItem('pg_avatar',imageURI);
                document.getElementById('image').setAttribute('src','data:image/png;base64,'+imageURI);
                
                /* Check for Online */
                var isOffline = $cordovaNetwork.isOffline();        
                if(isOffline) {
                    $cordovaToast.show('No data connection','long','center');
                } else {
                    $ionicLoading.show({template: Service.uploading});
                }
                
                /* Uploading.. */ 
                var photo = {
                    method: 'POST',
                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                    url: Service.API+'/member/update_avatar',
                    data: 'id='+ses_user.id+'&avatar='+encodeURIComponent(imageURI)
                }
                $http(photo)
                .then(function(res) {
                    $ionicLoading.hide();
                    if(res.data.status=='success') {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            template: res.data.result,
                            cssClass: 'custom-alert',
                            buttons: [
                                {text: 'OK',
                                type: 'btn-alert'}
                            ]
                        })
                        .then(function() {
                            $state.go('user',{},{reload: true});
                            $scope.modal.hide();
                        });
                    } else {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            template: res.data.result,
                            cssClass: 'custom-alert',
                            buttons: [
                                {text: 'OK',
                                type: 'btn-alert'}
                            ]
                        });
                    }
                });
            });
        });
    }
    
    /* Modal Avatar */
    $ionicModal.fromTemplateUrl('modal/photo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modtitle = 'Change Avatar';
//        document.getElementById('image').setAttribute('src','data:image/png;base64,'+localStorage.getItem('pg_avatar'));
        
        /* Taken by camera */
        $scope.getCamera = function() {
            postImg(1);
        }
        
        /* Taken by gallery */
        $scope.getPhoto = function() {
            postImg(2);
        }
    });
    
    /* Change avatar */
    $scope.toPhoto = function() {
        $scope.modal.show();
    }
    $scope.backModal = function() {
        $scope.modal.hide();
    }
    
    /* Redirect if no login */
    if(localStorage.getItem('pg_user')==null) $state.go('main');
    
    /* Update POST */
    $scope.doUpdate = function(task) {
        /* Check if offline submit */
        document.addEventListener("deviceready", function() {
            var isOffline = $cordovaNetwork.isOffline();
            if(isOffline) {
                $ionicPopup.alert({
                    template: 'No data connection !',
                    cssClass: 'custom-alert',
                });
            } else {
                $ionicLoading.show({template: Service.loading});
            }
        });
            
        var update = {
            method: 'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            url: Service.API+'/member/update_profile',
            data: 'id='+ses_user.id+'&fname='+task.fname+'&lname='+task.lname+'&phone='+task.phone
        }
        $http(update)
        .then(function(res) {                
            if(res.data.status=='success') {
                var updateLocal = {
                    method: 'GET',
                    url: Service.API+'/member/profile?id='+ses_user.id
                }
                $http(updateLocal)
                .then(function(r) {
                    $ionicLoading.hide();
                    localStorage.setItem('pg_user',JSON.stringify(r.data.result));
                    $ionicPopup.alert({
                        template: 'Profile Updated!',
                        cssClass: 'custom-alert',
                        buttons: [
                            {text: 'OK',
                            type: 'btn-alert'}
                        ]
                    })
                    .then(function() {
                        $state.go('user');
                    });
                })
            } else {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    template: res.data.result,
                    cssClass: 'custom-alert',
                    buttons: [
                        {text: 'OK',
                        type: 'btn-alert'}
                    ]
                });
            }
        });        
    }
});