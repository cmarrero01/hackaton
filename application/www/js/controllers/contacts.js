controllers.controller('ContactsCtrl',[
    '$rootScope',
    '$scope',
    '$ionicLoading',
    'ContactSvc',
    'AuthSvc',
    'DeviceSvc',
    function($rootScope,$scope,$ionicLoading,ContactSvc,AuthSvc,DeviceSvc){

        $ionicLoading.show({template: 'Buscando...'});
        $scope.contacts = [];

        getContacts();

        $scope.acceptInvitation = function(userId,$index){
            DeviceSvc.acceptContact(userId,function(response){
                $scope.contacts[$index].isContact = true;
                $scope.contacts[$index].aproveBtn = false;
                if(AuthSvc.user.contacts.indexOf($scope.contacts[$index]._id) !== -1){
                    return;
                }
                AuthSvc.user.contacts.push($scope.contacts[$index]._id);
                DeviceSvc.user.contacts.push($scope.contacts[$index]._id);
                $rootScope.$broadcast('contact:update',$scope.contacts[$index]._id);
                $rootScope.contacts.pending -= 1;
            });
        };

        /**
         * @method getContacts
         */
        function getContacts(){
            ContactSvc.get(function(response){
                $ionicLoading.hide();
                if(!AuthSvc.user._id){
                    return;
                }
                $scope.contacts = [];
                $rootScope.contacts.pending = 0;
                angular.forEach(response.result,function(item){
                    if(!item || !item.deviceTo || !item.deviceFrom || !AuthSvc.user || !AuthSvc.user._id)return;
                    if((item.deviceTo._id !== AuthSvc.user._id) && (item.deviceFrom._id === AuthSvc.user._id)){
                        if(!item.deviceTo.isContact){
                            item.deviceTo.aproveBtn = false;
                        }
                        $scope.contacts.push(item.deviceTo);
                    }else if((item.deviceTo._id === AuthSvc.user._id) && (item.deviceFrom._id !== AuthSvc.user._id)){
                        if(!item.deviceFrom.isContact){
                            item.deviceFrom.aproveBtn = true;
                            $rootScope.contacts.pending+=1;
                        }
                        $scope.contacts.push(item.deviceFrom);
                    }
                });

            });
        }

    }]);