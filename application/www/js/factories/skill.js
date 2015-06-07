factories.factory('SkillSvc',[
    '$http',
    'AuthSvc',
    'CacheSvc',
    'ENV',
    function($http,AuthSvc,CacheSvc,ENV){

        var skills = {};

        /**
         * Get all business
         * @method get
         * @param fn
         * @param skip
         * @param limit
         */
        skills.get = function(fn,skip,limit){
            var skill = CacheSvc.get(ENV.http+'/skills');
            if(skill.length > 0){
                fn({result:skill});
            }
            var data = {};
            if(skip)data.skip=skip;
            if(limit)data.limit=limit;
            var crd = AuthSvc.getCredential();
            $http.get(ENV.http+'/skills?credential='+crd).success(function(response){
                fn(response);
                CacheSvc.set(ENV.http+'/skills',response.result);
            });
        };

        /**
         * @method add
         * @param skill
         * @param fn
         */
        skills.add = function(skill,fn){
            var crd = AuthSvc.getCredential();
            $http.put(ENV.http+'/skills?credential='+crd,{skills:skill}).success(function(response){
                fn(response);
            });
        };


        return skills;
    }
]);