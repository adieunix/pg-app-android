angular.module('pg.static', [])
.controller('StaticCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $cordovaNetwork,
               $cordovaToast,
               $ionicPopup,
               $ionicHistory,
               $stateParams,
                $state,
                $http,
                Service,
                $ionicLoading
            ) {
    // 1. Term Conditions
    // 2. Contact
    // 3. Change Password
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('Static Page / Change Password');
    });
    
    var ses_user = JSON.parse(localStorage.getItem('pg_user'));
    
    if($stateParams.type==1) {
        $scope.title = 'Terms & Conditions'; 
        $scope.content = 'Perutgendut.com adalah sarana informasi untuk umum. Segala informasi yang terkandung dalam situs web Perut Gendut ini adalah untuk informasi umum. Kami tidak membuat pernyataan atau jaminan apapun,yang tersurat maupun tersirat, tentang, akurasi kelengkapan, kesesuaian, atau ketersediaan  produk, jasa, atau gambar yang terdapat pada situs web Perut Gendut ini untuk tujuan apapun. Dan apabila terjadi pendapat dan perkiraan dari penguna web ini  maka setiap asumsi dan pendapat Anda terhadap informasi tersebut bukan merupakan tanggung jawab kami.<br /><br />Dengan mengunjungi perutgendut.com, dalam hal apapun kami tidak bertanggung jawab atas kerugian atau kerusakan, termasuk diantaranya,kerugian tidak langsung atau konsekuensial atau kerusakan, atau kerugian atau kerusakan apapun yang timbul dari hilangnya data atau keuntungan yang timbul dari, atau sehubungan dengan penggunaan situs ini. Dalam hal content, pengunjung perutgendut.com  menyetujui untuk tidak mengunakan content yang ada tanpa ijin dari perutgendut.com.<br /><br />Dalam hal persetujuan untuk mengunjungi perutgendut.com, maka menyetujui untuk:<br /><br /><ul style="font-weight:normal;font-size:13px;"><li>Tidak melakukan tindak penyalah gunaan content dari web ini</li><li>Tidak melakukan pengambilan data pada content yang ada untuk kepentingan pribadi/perusahaan</li><li>Tidak mengupload virus, Trojan, dan segala hal yang mengakibatkan gangguan pada web perutgendut.com</li></ul>Melalui situs web Perut Gendut ini anda mendapatkan link ke situs-situs lain yang tidak di bawah kendali Perut Gendut. Kami tidak memiliki kontrol atas isi, sifat dan ketersediaan situs tersebut.Dimasukkannya link situs apapun tidak selalu berarti sebuah rekomendasi atau mendukung pandangan yang diungkapkan oleh situs web tersebut.<br /><br />Setiap usaha dibuat untuk menjaga website Perut Gendut berjalan dengan lancar. Namun, Perut Gendut tidak bertanggung jawab, dan tidak akan bertanggung jawab, untuk masalah teknis yang berada di luar kendali kami.';
    }
    
    if($stateParams.type==2) {
        $scope.title = 'Contact Us'; 
        $scope.content = 'Jika Anda memiliki pertanyaan, kritik atau saran seputar Perut Gendut dan dunia kuliner, silakan hubungi kami melalui alamat email <b>info@perutgendut.com</b>';
    }
    
    if($stateParams.type==3) {
        $scope.title = 'Change Password'; 
        $scope.change = true;
        $scope.doChange = function(task) {
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

            var change = {
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                url: Service.API+'/member/update_password',
                data: 'id='+ses_user.id+'&pwd='+task.passwd
            }
            $http(change)
            .then(function(res) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    template: res.data.result,
                    cssClass: 'custom-alert',
                })
                .then(function() {
                    $state.go('user');
                });
            });
        }
    }
});