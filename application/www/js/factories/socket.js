factories.factory('$socket', [
    '$rootScope',
    'ENV',
    function($rootScope, ENV) {

        var socket = {};
        socket.token = null;
        socket.socket = null;
        socket.scriptLoaded = false;

        /**
         * Load socket asynchronously
         * @method loadSocketScript
         */
        socket.loadSocketScript = function(){
            var s,
                r,
                t;
            r = false;
            s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = ENV.socket+'/socket.io/socket.io.js';
            s.onload = s.onreadystatechange = function() {
                if ( !r && (!this.readyState || this.readyState == 'complete') )
                {
                    r = true;
                    socket.socket = (io)?io.connect(ENV.socket):'';
                    $rootScope.$broadcast('connected',true);
                    socket.scriptLoaded = true;
                }else{
                    console.log("ERROR");
                }
            };
            t = document.getElementsByTagName('script')[0];
            t.parentNode.insertBefore(s, t);
        };

        /**
         * Listen verbs
         * @method on
         * @param eventName
         * @param callback
         */
        socket.on = function(eventName, callback){
            socket.socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        /**
         * Emit verbs to server
         * @method emit
         * @param eventName
         * @param data
         * @param callback
         */
        socket.emit = function(eventName, data, callback){
            if(socket.getToken())data.token = socket.getToken();
            if(!socket.socket)return;
            var language = localStorage.getItem('language');
            if(language)data.language = language;
            socket.socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        /**
         * Set a new token for emits on socket
         * @method setToken
         * @param newToken
         */
        socket.setToken = function(newToken){
            socket.token = newToken;
        };

        /**
         * Get Token for emits actions
         * @method getToken
         * @returns {*}
         */
        socket.getToken = function(){
            return socket.token;
        };

        return socket;

    }]);