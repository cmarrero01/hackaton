controllers.controller('CalendarCtrl',[
    '$scope',
    '$ionicLoading',
    'CalendarSvc',
    function($scope,$ionicLoading,CalendarSvc){

        $scope.title = "Calendario";

        $ionicLoading.show({template: 'Descubriendo el calendario...'});
        $scope.calendar = [];

        $scope.$on('access',function(ev,message){
            if(!message)return;
            getCalendar();
        });

        /**
         * @method getCalendar
         */
        function getCalendar(){
            CalendarSvc.get(function(response){
                $ionicLoading.hide();
                $scope.calendar = response.result;
            });
        }

    }]);