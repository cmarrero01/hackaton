controllers.controller('ProfileCtrl',[
    '$rootScope',
    '$scope',
    '$ionicLoading',
    'DeviceSvc',
    'AuthSvc',
    '$location',
    function($rootScope,$scope,$ionicLoading,DeviceSvc,AuthSvc,$location){

        $ionicLoading.show({template: 'Descubriendo tu perfil...'});
        $scope.profile = {};

        getProfile();

        $scope.save = function(){
            $ionicLoading.show({template: 'Guardando cambios...'});
            DeviceSvc.update($scope.profile,function(response){
                $ionicLoading.hide();
                if(response.code !== 200)return;
                AuthSvc.user.push = $scope.profile.push;
                DeviceSvc.user.push = $scope.profile.push;
                DeviceSvc.user.name = $scope.profile.name;
                DeviceSvc.user.twitter = $scope.profile.twitter;
                $location.path('/calendar');
            });
        };

        /**
         * @method getPhone
         */
        function getPhone(){
            if(!window.plugins || !window.plugins.phonenumber)return;
            window.plugins.phonenumber.get(function(phone){
                if(phone)$scope.profile.phone = phone;
            },function(err){
                console.log("Fucking error" + err);
            });
        }

        /**
         * Get settings for Auth
         * @method getSettings
         */
        function getProfile(){
            getPhone();
            DeviceSvc.getProfile(function(response){
                $ionicLoading.hide();
                $scope.profile = response.result;
            });
        }

    }]);