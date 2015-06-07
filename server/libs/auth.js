module.exports = function(params){

    if(!params.Hack){
        return;
    }

    return (function(){

        var auth = {};
        auth.credentials = [];

        /**
         * Get all credential from DB
         */
        auth.getCredentials = function(fn){
            params.Hack.device_model.find({}).exec(function (err, doc) {
                if(err){
                    console.log("BIG ERROR ON INIT");
                    return;
                }
                doc.forEach(function(item){
                    auth.credentials[item.credential] = item;
                });

                if(typeof fn === 'function'){
                    fn(auth.credentials);
                }
            });
        };

        /**
         * Validate credential from token
         * @param req
         * @returns {boolean}
         */
        auth.validateHttpSession = function(req){
            return !(!req.query || !req.query.credential || !auth.credentials[req.query.credential])
        };

        /**
         * Create a token with socket.id and credentials of the user
         *
         * @method createToken
         * @param socket {Object} Conexion of socket.io
         * @param credentials {String} Base64 string of user and password of the user
         * @return {string} A valid token
         * @private
         */
        auth.createToken = function(socket,credentials){
            var token = new Buffer(socket.id+credentials).toString('base64');
            socket.token = token;
            return token;
        };

        /**
         * Validate the token, check with the server token.
         *
         * @method isTokenOk
         * @param socket {Object} Conexion of socket.io
         * @param clientToken {String} This is setting by the client
         * @return {boolean}
         * @private
         */
        auth.isTokenOk = function(socket,clientToken){
            return (clientToken === socket.token);
        };

        /**
         * If user Loged.
         *
         * @method isUserLoged
         * @param socket {Object} Conexion of socket.io
         * @return {boolean}
         * @private
         */
        auth.isUserLogin = function(socket){
            return (typeof socket.device !== "undefined" || typeof socket.admin !== "undefined");
        };

        /**
         * Validate connection of user.
         *
         * @method validateSession
         * @param socket {Object} Conexion of socket.io
         * @param token {String} This is the client token, is setting by the client
         * @return {boolean}
         */
        auth.validateSession = function(socket,token){
            return (auth.isTokenOk(socket,token) && auth.isUserLogin(socket));
        };

        auth.getCredentials();

        return auth;
    })();
};