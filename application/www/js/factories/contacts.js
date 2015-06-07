factories.factory('ContactSvc',[
    '$http',
    'AuthSvc',
    'CacheSvc',
    'ENV',
    function($http,AuthSvc,CacheSvc,ENV){

        var contacts = {};

        /**
         * Get all contact
         * @method get
         * @param fn
         */
        contacts.get = function(fn){
            var contact = CacheSvc.get(ENV.http+'/contacts');
            if(contact.length > 0){
                fn({result:contact});
            }
            $http.post(ENV.http+'/contacts?credential='+AuthSvc.getCredential(),{device:AuthSvc.user}).success(function(response){
                fn(response);
                CacheSvc.set(ENV.http+'/contacts',response.result);
            });
        };

        return contacts;
    }
]);