angular.module('pg.list', [])
.controller('ListCtrl', function(
               $scope,
               $ionicNativeTransitions,
               $cordovaNetwork,
               $cordovaToast,
               $ionicPopup,
               $state,
               $ionicHistory,
               $stateParams,
               $http,
               Service
            ) {
    // 1. Reviews
    // 2. Articles
    // 3. Events
    // 4. Recipes
    // 5. Videos
    
    /* TrackView */
    document.addEventListener("deviceready", function() {
        analytics.trackView('List Merchant');
    });
    
    if($stateParams.id==1) {
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Review');
        });
        $scope.title = 'Reviews';
        $scope.type = 'reviews';
        $scope.active = 'reviews';
        var getReview = {
            method: 'GET',
            url: Service.API+'/review/get_all_reviews?offset=0&count=1'
        }
        $http(getReview)
        .then(function(res) {
            var rev = res.data.result;
            $scope.list = {
                name: rev[0].name,
                date: rev[0].posted,
                id: rev[0].id,
                yid: 0,
                img: rev[0].image,
                kutipan: rev[0].brief,
                detail: rev[0].details,
                type:1
            }
        });
        
        // Infinite
        $scope.noMoreItemsAvailable = false;    
        var c = 0;
        $scope.loadMore = function() {
            var counter = c=c+1;
            var getReviewInf = {
                method: 'GET',
                url: Service.API+'/review/get_all_reviews?offset='+counter+'&count=1'
            }
            $http(getReviewInf)  
            .then(function(res) {
                var dat = res.data.result; 
                if(dat.length==0) {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Review';
                } else {
                    $scope.items.push({
                        img: dat[0].image,
                        name: dat[0].name,
                        date: dat[0].posted,
                        yid: 0,
                        kutipan: dat[0].brief,
                        id: dat[0].id,
                        detail: dat[0].details,
                        type:1
                    });                    
                    $scope.$broadcast('scroll.infiniteScrollComplete');                
                    setTimeout(function(){ 
                        $scope.spin = true;
                    }, 500);
                }    
            }, function(res) {
                if(res.data.status=='error') {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Review';
                }
            });
        }
        $scope.items = [];
    }
    
    if($stateParams.id==2) {
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Article');
        });
        $scope.title = 'Articles';
        $scope.type = 'posts';
        $scope.active = 'articles';
        var getReview = {
            method: 'GET',
            url: Service.API+'/post/get_all_articles?offset=0&count=1'
        }
        $http(getReview)
        .then(function(res) {
            var rev = res.data.result;
            $scope.list = {
                name: rev[0].title,
                date: rev[0].published_date,
                id: rev[0].id,
                yid: 0,
                img: rev[0].horizontal_image,
                kutipan: rev[0].brief_description,
                detail: rev[0].details,
                type:2
            }
        });
        
        // Infinite
        $scope.noMoreItemsAvailable = false;    
        var c = 0;
        $scope.loadMore = function() {
            var counter = c=c+1;
            var getReviewInf = {
                method: 'GET',
                url: Service.API+'/post/get_all_articles?offset='+counter+'&count=1'
            }
            $http(getReviewInf)  
            .then(function(res) {
                var dat = res.data.result; 
                if(dat.length==0) {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Article';
                } else {
                    $scope.items.push({
                        img: dat[0].horizontal_image,
                        name: dat[0].title,
                        date: dat[0].published_date,
                        yid: 0,
                        kutipan: dat[0].brief_description,
                        id: dat[0].id,
                        detail: dat[0].details,
                        type:2
                    });                    
                    $scope.$broadcast('scroll.infiniteScrollComplete');                
                    setTimeout(function(){ 
                        $scope.spin = true;
                    }, 500);
                }    
            }, function(res) {
                if(res.data.status=='error') {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Article';
                }
            });
        }
        $scope.items = [];
    }
    
    if($stateParams.id==3) {
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Event');
        });
        $scope.title = 'Events';
        $scope.type = 'posts';
        $scope.active = 'events';
        var getReview = {
            method: 'GET',
            url: Service.API+'/post/get_all_events?offset=0&count=1'
        }
        $http(getReview)
        .then(function(res) {
            var rev = res.data.result;
            $scope.list = {
                name: rev[0].title,
                date: rev[0].published_date,
                id: rev[0].id,
                yid: 0,
                img: rev[0].horizontal_image,
                kutipan: rev[0].brief_description,
                detail: rev[0].details,
                type:3
            }
        });
        
        // Infinite
        $scope.noMoreItemsAvailable = false;    
        var c = 0;
        $scope.loadMore = function() {
            var counter = c=c+1;
            var getReviewInf = {
                method: 'GET',
                url: Service.API+'/post/get_all_events?offset='+counter+'&count=1'
            }
            $http(getReviewInf)  
            .then(function(res) {
                var dat = res.data.result; 
                if(dat.length==0) {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Event';
                } else {
                    $scope.items.push({
                        img: dat[0].horizontal_image,
                        name: dat[0].title,
                        date: dat[0].published_date,
                        yid: 0,
                        kutipan: dat[0].brief_description,
                        id: dat[0].id,
                        detail: dat[0].details,
                        type:3
                    });                    
                    $scope.$broadcast('scroll.infiniteScrollComplete');                
                    setTimeout(function(){ 
                        $scope.spin = true;
                    }, 500);
                }    
            }, function(res) {
                if(res.data.status=='error') {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Event';
                }
            });
        }
        $scope.items = [];
    }
    
    if($stateParams.id==4) {
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Recipe');
        });
        $scope.title = 'Recipes';
        $scope.type = 'posts';
        $scope.active = 'recipes';
        var getReview = {
            method: 'GET',
            url: Service.API+'/post/get_all_recipes?offset=0&count=1'
        }
        $http(getReview)
        .then(function(res) {
            var rev = res.data.result;
            $scope.list = {
               name: rev[0].title,
                date: rev[0].published_date,
                id: rev[0].id,
                yid: 0,
                img: rev[0].horizontal_image,
                kutipan: rev[0].brief_description,
                detail: rev[0].details,
                type:4
            }
        });
        
        // Infinite
        $scope.noMoreItemsAvailable = false;    
        var c = 0;
        $scope.loadMore = function() {
            var counter = c=c+1;
            var getReviewInf = {
                method: 'GET',
                url: Service.API+'/post/get_all_recipes?offset='+counter+'&count=1'
            }
            $http(getReviewInf)  
            .then(function(res) {
                var dat = res.data.result; 
                if(dat.length==0) {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Recipe';
                } else {
                    $scope.items.push({
                        img: dat[0].horizontal_image,
                        name: dat[0].title,
                        date: dat[0].published_date,
                        yid: 0,
                        kutipan: dat[0].brief_description,
                        id: dat[0].id,
                        detail: dat[0].details,
                        type:4
                    });                    
                    $scope.$broadcast('scroll.infiniteScrollComplete');                
                    setTimeout(function(){ 
                        $scope.spin = true;
                    }, 500);
                }    
            }, function(res) {
                if(res.data.status=='error') {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Recipe';
                }
            });
        }
        $scope.items = [];
    }
    
    if($stateParams.id==5) {
        /* TrackView */
        document.addEventListener("deviceready", function() {
            analytics.trackView('List Video');
        });
        $scope.title = 'Videos';
        $scope.type = 'videos';
        $scope.active = 'videos';
        var getVideos = {
            method: 'GET',
            url: Service.API+'/video/get_all_videos?offset=0&count=1'
        }
        $http(getVideos)
        .then(function(res) {
            var vid = res.data.result;
            $scope.list = {
                name: vid[0].name,
                date: vid[0].published,
                id: vid[0].id,
                yid: vid[0].youtube_id,
                img: vid[0].image,
                kutipan: vid[0].details,
                detail: vid[0].details,
                type:5
            }
        });
        
        // Infinite
        $scope.noMoreItemsAvailable = false;    
        var c = 0;
        $scope.loadMore = function() {
            var counter = c=c+1;
            var getReviewInf = {
                method: 'GET',
                url: Service.API+'/video/get_all_videos?offset='+counter+'&count=1'
            }
            $http(getReviewInf)  
            .then(function(res) {
                var dat = res.data.result; 
                if(dat.length==0) {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Video';
                } else {
                    $scope.items.push({
                        name: dat[0].name,
                        date: dat[0].published,
                        id: dat[0].id,
                        yid: dat[0].youtube_id,
                        img: dat[0].image,
                        kutipan: dat[0].details,
                        detail: dat[0].details,
                        type:5
                    });                    
                    $scope.$broadcast('scroll.infiniteScrollComplete');                
                    setTimeout(function(){ 
                        $scope.spin = true;
                    }, 500);
                }    
            }, function(res) {
                if(res.data.status=='error') {
                    $scope.noMoreItemsAvailable = true;
                    $scope.nohis = 'No Video';
                }
            });
        }
        $scope.items = [];
    }
});