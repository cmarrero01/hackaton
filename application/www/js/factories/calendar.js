factories.factory('CalendarSvc',[
    '$http',
    'AuthSvc',
    'CacheSvc',
    'ENV',
    function($http,AuthSvc,CacheSvc,ENV){

        var calendar = {};

        /**
         * Get all calendar
         * @method get
         * @param fn
         */
        calendar.get = function(fn){
            var cal = CacheSvc.get(ENV.http+'/calendar');
            if(cal.length > 0){
                fn({result:cal});
            }
            var crd = AuthSvc.getCredential();
            $http.get(ENV.http+'/calendar?credential='+crd).success(function(response){
                fn(response);
                CacheSvc.set(ENV.http+'/calendar',response.result);
            });
        };

        return calendar;
    }
]);