controllers.controller('UserCtrl',[
    '$scope',
    '$ionicLoading',
    'DeviceSvc',
    '$stateParams',
    'AuthSvc',
    function($scope,$ionicLoading,DeviceSvc,$stateParams,AuthSvc){

        $ionicLoading.show({template: 'Buscando...'});
        $scope.user = {};
        $scope.pressed = [];
        $scope.profile = {};

        $scope.openExternal = function(url){
            try{
                window.open(encodeURI(url), '_system', 'location=yes');
            }catch(e){
                console.log(e);
            }
        };

        $scope.$on('contact:update',function(ev,userId){
            $scope.profile = DeviceSvc.user;
        });

        getDevice();

        /**
         * Get Devices
         * @method getDevice
         */
        function getDevice(){
            $scope.profile = AuthSvc.user;
            DeviceSvc.getById($stateParams.deviceId,function(response){
                $ionicLoading.hide();
                $scope.user = response.result;
                if($stateParams.deviceId && $stateParams.ask == 'ask'){
                    DeviceSvc.confirmContact($scope.user,function(response){
                        if(response){
                            $scope.profile.contacts.push($scope.user._id);
                        }
                    });
                }

                if($stateParams.ask == 'aprove'){
                    $scope.profile.contacts.push($scope.user._id);
                }
            });
        }

    }]);