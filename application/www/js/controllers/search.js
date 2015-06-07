controllers.controller('SearchCtrl',[
    '$rootScope',
    '$scope',
    '$ionicLoading',
    'DeviceSvc',
    '$stateParams',
    '$ionicPopup',
    '$location',
    function($rootScope,$scope,$ionicLoading,DeviceSvc,$stateParams,$ionicPopup,$location){

        $ionicLoading.show({template: 'Buscando...'});
        $scope.user = {};
        $scope.pressed = [];
        $scope.profile = {};
        $scope.matches = [];

        $scope.profile = DeviceSvc.user;

        $scope.$on('contact:update',function(ev,userId){
            $scope.profile = DeviceSvc.user;
        });

        $scope.goSearch = function(skill){
            skill = encodeURIComponent(skill);
            $location.path('/app/search/'+skill);
        };

        if(!$scope.profile.name){
            $ionicLoading.hide();
            var profilePopup = $ionicPopup.confirm({
                title: 'Completa tu perfil',
                template: 'Para realizar busquedas debes completar tu perfil, deseas hacerlo ahora?'
            });
            profilePopup.then(function(res) {
                if(res) {
                    $location.path('app/profile');
                }else{
                    $location.path('app/calendar');
                }
            });
            return;
        }

        if($scope.profile.skill.length <= 0){
            $ionicLoading.hide();
            var skillPopup = $ionicPopup.confirm({
                title: 'No tienes skills',
                template: 'Para realizar busquedas debes agregar skills a tu perfil, deseas hacerlo ahora?'
            });
            skillPopup.then(function(res) {
                if(res) {
                    $location.path('app/skills');
                }else{
                    $location.path('app/calendar');
                }
            });
            return;
        }

        if(!$stateParams.query){
            $ionicLoading.hide();
            $scope.matches = false;
            return;
        }

        DeviceSvc.get({skill:decodeURIComponent($stateParams.query)},function(response){
            $ionicLoading.hide();
            $scope.matches = response.result;
        });

        $scope.isPressed = function(userId){
            return ($scope.pressed[userId] || localStorage.getItem(userId));
        };

        $scope.contact = function(userId){
            localStorage.setItem(userId,'pressed');
            $scope.pressed[userId] = 'pressed';
            $rootScope.contacts.pending+=1;
            DeviceSvc.askContact(userId,function(response){
                console.log(response);
            });
        };

    }]);