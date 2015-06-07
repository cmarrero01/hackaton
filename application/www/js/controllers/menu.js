controllers
    .controller('MenuCtrl', [
        '$scope',
        '$location',
        'DeviceSvc',
        '$ionicPopup',
        '$ionicSideMenuDelegate',
        function($scope, $location,DeviceSvc,$ionicPopup,$ionicSideMenuDelegate) {

            $scope.profile = {};
            $scope.query = '';

            $scope.$on('access',function(ev,message){
                if(!message)return;
                getProfile();
            });

            $scope.search = function(obj){
                $ionicSideMenuDelegate.toggleLeft();
                $location.path('/app/search/'+obj.query);
            };

            /**
             * Get settings for Auth
             * @method getSettings
             */
            function getProfile(){
                DeviceSvc.getProfile(function(response){
                    $scope.profile = response.result;
                    if(!response.result.name){
                        var profilePopup = $ionicPopup.confirm({
                            title: 'Completa tu perfil',
                            template: 'Para realizar busquedas debes completar tu perfil, deseas hacerlo ahora?'
                        });
                        profilePopup.then(function(res) {
                            if(res) {
                                $location.path('app/profile');
                            }
                        });
                        return;
                    }

                    if(response.result.skill.length <= 0){
                        var skillPopup = $ionicPopup.confirm({
                            title: 'No tienes skills',
                            template: 'Para realizar busquedas debes agregar skills a tu perfil, deseas hacerlo ahora?'
                        });
                        skillPopup.then(function(res) {
                            if(res) {
                                $location.path('app/skills');
                            }
                        });
                    }
                });
            }
        }]);
