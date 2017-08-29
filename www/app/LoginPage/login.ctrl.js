angular.module('pg.login', [])
.controller('LoginCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $ionicHistory,
               $ionicModal,
               $cordovaNetwork,
               $http,
               Service,
               $ionicLoading,
               $ionicPopup,
               $state,
                $cordovaToast
            ) {
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('Login Register ForgotPass');
    });
    
    if(localStorage.getItem('pg_user')==null) {
        $scope.title = 'Login';
        $scope.logClose = function() {
            $ionicHistory.goBack();
        }

        $scope.doLogin = function(task) {
            /* Check if offline submit */
            document.addEventListener("deviceready", function() {
                var isOffline = $cordovaNetwork.isOffline();
                if(isOffline) {
                    $ionicPopup.alert({
                        template: 'No data connection !',
                        cssClass: 'custom-alert',
                    });
                } else {
                    $ionicLoading.show({template: Service.login});
                }
            });
            
            /* Request Phone Permission to Get IMEI */
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
                                window.plugins.imeiplugin.getImei(function(imei) {
                                    localStorage.setItem('pg_imei',imei);
                                    $cordovaToast.show('Please login again','long','bottom');
                                    $state.go('login');
                                });
                            }
                        }, errorCallback
                    );
                } else {
                    var login = {
                        method: 'POST',
                        headers: {'Content-Type':'application/x-www-form-urlencoded'},
                        url: Service.API+'/member/authenticate',
                        data: 'email='+task.email+'&pwd='+task.passwd+'&imei='+localStorage.getItem('pg_imei')
                    }
                    $http(login)
                    .then(function(res) {
                        $ionicLoading.hide();
                        console.log(res.data);
                        if(res.data.status=='success') {
                            localStorage.setItem('pg_user',JSON.stringify(res.data.result));
                            localStorage.setItem('pg_avatar',res.data.result.avatar);
                            $ionicHistory.goBack();
                        } else {
                            $ionicPopup.alert({
                                template: 'Invalid email or password!',
                                cssClass: 'custom-alert',
                                buttons: [
                                    {text: 'OK',
                                    type: 'btn-alert'}
                                ]
                            });
                        }            
                    }, function() {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            template: 'Invalid email or password!',
                            cssClass: 'custom-alert',
                            buttons: [
                                {text: 'OK',
                                type: 'btn-alert'}
                            ]
                        });
                    })
                }
            }
        }
        
        /* Modal Controller */
        $scope.openModal = function(index) {
            if (index == 1) {
                $scope.oModal1.show();
                $scope.modtitle = 'Register';
            } else {
                $scope.oModal2.show();
                $scope.modtitle = 'Forgot Password';
            }
        };

        $scope.backModal = function(index) {
            $scope.oModal1.hide();
            $scope.oModal2.hide();
        };
        
        /* Modal Forgot */
        $ionicModal.fromTemplateUrl('modal/forgot.html', {
            id: 2,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal2 = modal;
            $scope.doReset = function(task) {
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

                var reset = {
                    method: 'POST',
                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                    url: Service.API+'/member/reset_password',
                    data: 'email='+task.email
                }
                $http(reset)
                .then(function(res) {
                    console.log(res);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        template: res.data.result,
                        cssClass: 'custom-alert',
                    })
                    .then(function() {
                        $scope.oModal1.hide();
                    });
                });
            }
        });

        /* Modal Register */
        $ionicModal.fromTemplateUrl('modal/register.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.oModal1 = modal;
//            $scope.modRegister = function() {
//                $scope.modal.show();
                
                $scope.doRegister = function(task,dt) {
                    // Check if offline submit
                    document.addEventListener("deviceready", function() {
                        var isOffline = $cordovaNetwork.isOffline();
                        if(isOffline) {
                            $ionicPopup.alert({
                                template: 'No data connection !',
                                cssClass: 'custom-alert',
                                buttons: [
                                    {text: 'OK',
                                    type: 'btn-alert'}
                                ]
                            });
                        } else {
                            $ionicLoading.show({template: Service.loading});
                        }
                    });
                    
                    var reg = {
                        method: 'POST',
                        headers: {'Content-Type':'application/x-www-form-urlencoded'},
                        url: Service.API+'/member/register',
                        data: 'email='+task.email+'&pwd='+task.passwd+'&fname='+task.fname+'&phone='+task.phone
                    }
                    $http(reg)
                    .then(function(res) {
                        $ionicLoading.hide();
                        if(res.data.status=='success') {
                            localStorage.setItem('pg_user',JSON.stringify(res.data.result));
                            $scope.oModal1.hide();
                            $ionicHistory.goBack();
                        } else {
                            $ionicPopup.alert({
                                template: res.data.result,
                                cssClass: 'custom-alert',
                                buttons: [
                                    {text: 'OK',
                                    type: 'btn-alert'}
                                ]
                            });
                        }
                    }, function(res) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            template: res.data.result,
                            cssClass: 'custom-alert',
                            buttons: [
                                {text: 'OK',
                                type: 'btn-alert'}
                            ]
                        });
                    });
                }
//            }
        });
    } else {
        $state.go('main');
    }
});