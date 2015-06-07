module.exports = function(params){
    return (function(){

        var cache = {};
        var inMemory = {};

        /**
         * Set result into cache
         * @method set
         * @param socket
         * @param action
         * @param data
         * @param fn
         * @param response
         */
        cache.set = function(socket,action,data,fn,response){
            return inMemory[action] = response;
        };

        /**
         * Get from cache
         * @method get
         * @param socket
         * @param action
         * @param data
         * @param fn
         * @param response
         */
        cache.get = function(socket,action,data,fn,response){
            if(!inMemory[action]){
                return false;
            }
            return inMemory[action];
        };

        /**
         * @method check
         * @param socket
         * @param action
         * @param data
         * @param fn
         * @param response
         */
        cache.check = function(socket,action,data,fn,response){
            if(response && !params._.isEqual(inMemory[action],response)){
                cache.set(socket,action,data,fn,response);
                params.Hack.response.socket(socket,data,fn,null,response);
            }
        };

        /**
         * Delete cache
         * @method clear
         * @param action
         * @returns {*}
         */
        cache.clear = function(action){
            if(!inMemory[action]){
                return false;
            }
            return inMemory.slice(action,1);
        };

        /**
         * Delete cache
         * @method clearAll
         * @returns {*}
         */
        cache.clearAll = function(){
            inMemory = {};
        };

        return cache;
    })();
};