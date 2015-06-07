factories.factory('AuthSvc',[
    '$rootScope',
    '$http',
    'PushSvc',
    'DeviceSvc',
    '$location',
    'ENV',
    function($rootScope,$http,PushSvc,DeviceSvc,$location,ENV){

        var auth = {};
        auth.user = DeviceSvc.user || null;
        auth.isConnected = false;
        auth.isLoged = false;

        /**
         * Encode Base 64
         * @param data
         * @returns {*}
         */
        auth.base64_encode = function (data) {
            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            var r = data.length % 3;

            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
        };

        /**
         * SHA-256 hash function reference implementation.
         *
         * @namespace
         */
        auth.cl = {};


        /**
         * Generates SHA-256 hash of string.
         *
         * @param   {string} msg - String to be hashed
         * @returns {string} Hash of msg as hex character string
         */
        auth.cl.hash = function(msg) {
            // convert string to UTF-8, as SHA only deals with byte-streams
            msg = msg.utf8Encode();

            // constants [§4.2.2]
            var K = [
                0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
                0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
                0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
                0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
                0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
                0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
                0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];
            // initial hash value [§5.3.1]
            var H = [
                0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

            // PREPROCESSING

            msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

            // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
            var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
            var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
            var M = new Array(N);

            for (var i=0; i<N; i++) {
                M[i] = new Array(16);
                for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
                    M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
                    (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
                } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
            }
            // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
            // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
            // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
            M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
            M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


            // HASH COMPUTATION [§6.1.2]

            var W = new Array(64); var a, b, c, d, e, f, g, h;
            for (var i=0; i<N; i++) {

                // 1 - prepare message schedule 'W'
                for (var t=0;  t<16; t++) W[t] = M[i][t];
                for (var t=16; t<64; t++) W[t] = (auth.cl.σ1(W[t-2]) + W[t-7] + auth.cl.σ0(W[t-15]) + W[t-16]) & 0xffffffff;

                // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
                a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

                // 3 - main loop (note 'addition modulo 2^32')
                for (var t=0; t<64; t++) {
                    var T1 = h + auth.cl.Σ1(e) + auth.cl.Ch(e, f, g) + K[t] + W[t];
                    var T2 =     auth.cl.Σ0(a) + auth.cl.Maj(a, b, c);
                    h = g;
                    g = f;
                    f = e;
                    e = (d + T1) & 0xffffffff;
                    d = c;
                    c = b;
                    b = a;
                    a = (T1 + T2) & 0xffffffff;
                }
                // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
                H[0] = (H[0]+a) & 0xffffffff;
                H[1] = (H[1]+b) & 0xffffffff;
                H[2] = (H[2]+c) & 0xffffffff;
                H[3] = (H[3]+d) & 0xffffffff;
                H[4] = (H[4]+e) & 0xffffffff;
                H[5] = (H[5]+f) & 0xffffffff;
                H[6] = (H[6]+g) & 0xffffffff;
                H[7] = (H[7]+h) & 0xffffffff;
            }

            return auth.cl.toHexStr(H[0]) + auth.cl.toHexStr(H[1]) + auth.cl.toHexStr(H[2]) + auth.cl.toHexStr(H[3]) +
                auth.cl.toHexStr(H[4]) + auth.cl.toHexStr(H[5]) + auth.cl.toHexStr(H[6]) + auth.cl.toHexStr(H[7]);
        };


        /**
         * Rotates right (circular right shift) value x by n positions [§3.2.4].
         * @param {String} n
         * @param {String} x
         * @private
         */
        auth.cl.ROTR = function(n, x) {
            return (x >>> n) | (x << (32-n));
        };

        /**
         * Logical functions [§4.1.2].
         * @param {String} x
         * @private
         */
        auth.cl.Σ0 = function(x) { return auth.cl.ROTR(2,  x) ^ auth.cl.ROTR(13, x) ^ auth.cl.ROTR(22, x); };
        auth.cl.Σ1 = function(x) { return auth.cl.ROTR(6,  x) ^ auth.cl.ROTR(11, x) ^ auth.cl.ROTR(25, x); };
        auth.cl.σ0 = function(x) { return auth.cl.ROTR(7,  x) ^ auth.cl.ROTR(18, x) ^ (x>>>3);  };
        auth.cl.σ1 = function(x) { return auth.cl.ROTR(17, x) ^ auth.cl.ROTR(19, x) ^ (x>>>10); };
        auth.cl.Ch  = function(x, y, z) { return (x & y) ^ (~x & z); };
        auth.cl.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };


        /**
         * Hexadecimal representation of a number.
         * @param {Number} n
         * @private
         */
        auth.cl.toHexStr = function(n) {
            // note can't use toString(16) as it is implementation-dependant,
            // and in IE returns signed numbers when used on full words
            var s="", v;
            for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
            return s;
        };


        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


        /** Extend String object with method to encode multi-byte string to utf8
         *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
        if (typeof String.prototype.utf8Encode === 'undefined') {
            String.prototype.utf8Encode = function() {
                return unescape( encodeURIComponent( this ) );
            };
        }

        /** Extend String object with method to decode utf8 string to multi-byte */
        if (typeof String.prototype.utf8Decode === 'undefined') {
            String.prototype.utf8Decode = function() {
                try {
                    return decodeURIComponent( escape( this ) );
                } catch (e) {
                    return this; // invalid UTF-8? return as-is
                }
            };
        }

        /**
         * Credentials setCredential
         * @param user
         * @returns {*}
         */
        auth.setCredential = function(user){
            var crd = localStorage.getItem('credential');
            DeviceSvc.credential = crd;
            if(!crd && user.email){
                crd = auth.base64_encode(auth.cl.hash('mobile:'+user.email));
                localStorage.setItem('credential',crd);
                DeviceSvc.credential = crd;
                return crd;
            }
            return crd;
        };

        /**
         * @method getCredential
         * @returns {*}
         */
        auth.getCredential = function(){
            return localStorage.getItem('credential');
        };

        /**
         * Access
         * @param user
         * @param fn
         */
        auth.login = function(user,fn){
            user.credential =  auth.setCredential(user);
            $http.get(ENV.http+'/login?credential='+user.credential).success(function(response){
                if(response.code !== 200){
                    fn(response);
                    return;
                }
                auth.user = response.result;
                DeviceSvc.user = response.result;
                fn(response);
                auth.isLoged = true;
                PushSvc.register();
            });
        };

        /**
         * Access
         * @param user
         * @param fn
         */
        auth.register = function(user,fn){
            $http.put(ENV.http+'/register?credential='+user.credential,user).success(function(response){
                if(response.code !== 200){
                    fn(response);
                    return;
                }
                auth.user = response.result;
                DeviceSvc.user = response.result;
                fn(response);
                PushSvc.register();
            });
        };

        /**
         * The Auto access
         * @method autoAccess
         */
        auth.autoAccess = function(cb){
            var crd = auth.getCredential();
            DeviceSvc.getEmail(function(email){
                crd = auth.setCredential({email:email});
                var user = {credential:crd,email:email};
                auth.login(user,function(response){
                    if(response.code === 200){
                        auth.user = response.result;
                        DeviceSvc.user = response.result;
                        auth.isLoged = true;
                        cb(response);
                    }else{
                        auth.register(user,function(response){
                            if(response.code === 200){
                                auth.user = response.result;
                                DeviceSvc.user = response.result;
                                auth.isLoged = true;
                            }
                            cb(response);
                        });
                    }
                });
            });
        };

        /**
         * Update member
         */
        auth.update = function(fn){
            $http.post(ENV.http+'/device/update?credential='+DeviceSvc.credential,DeviceSvc.user).success(function(response){
                fn(response);
            });
        };

        document.addEventListener("push-register", function(ev) {
            auth.user.registerId = ev.detail;
            DeviceSvc.user.registerId = ev.detail;
            auth.update(function(response){
                console.log("UPDATE OK");
            });
        });
        return auth;
    }]);