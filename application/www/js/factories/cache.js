factories.factory('CacheSvc',[
    function(){

        var cache = {};

        /**
         * Get elements from cache
         * @method get
         * @param key
         * @returns {*}
         */
        cache.get = function(key){
            var value = localStorage.getItem(key);
            if(value){
                return JSON.parse(value);
            }
            return [];
        };

        /**
         * Set elements to cache
         * @method set
         * @param key
         * @param value
         * @returns {*}
         */
        cache.set = function(key,value){
            localStorage.setItem(key,JSON.stringify(value));
            return value;
        };

        /**
         * Clear elements from cache
         * @method clear
         * @param key
         */
        cache.clear = function(key){
            localStorage.removeItem(key);
        };

        return cache;
    }
]);