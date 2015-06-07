factories.factory('DeviceSvc',[
    '$http',
    'CacheSvc',
    '$ionicPopup',
    '$location',
    'ENV',
    function($http,CacheSvc,$ionicPopup,$location,ENV){

        var device = {};
        device.isIOS = ionic.Platform.isIOS();
        device.isAndroid = ionic.Platform.isAndroid();
        device.user = {
            email: localStorage.getItem('email')
        };
        device.credential = null;

        /**
         * Get email from contact
         * @method getEmail
         * @param fn
         * @returns {*}
         */
        device.getEmail = function(fn){
            if(device.email){
                if(fn){
                    fn(device.email);
                    return;
                }
                return device.email;
            }

            if(!window.CC){
                device.email = new Date().getTime()+'@hack.com';
                localStorage.setItem('email',device.email);
                if(fn){
                    fn(device.email);
                    return;
                }
                return device.email;
            }

            var emailplugin = new CC.AndroidEmail();
            emailplugin.getEmail(function(emailContact) {
                device.email = emailContact;
                localStorage.setItem('email',device.email);
                if(fn){
                    fn(device.email);
                }
            }, function(err) {
                if(fn){
                    fn(new Date().getTime()+'@hack.com');
                }
            });
        };

        /**
         * Get devices by skills
         * @method get
         * @param query
         * @param fn
         */
        device.get = function(query,fn){
            query.device = device.user;
            $http.post(ENV.http+'/devices?credential='+device.credential,query).success(function(response){
                fn(response);
            });
        };

        /**
         *
         * @method getProfile
         * @param fn
         */
        device.getProfile = function(fn){
            var profile = CacheSvc.get(ENV.http+'/devices/getProfile?deviceId='+device.user._id);
            if(profile.length > 0){
                fn({result:profile});
            }
            $http.get(ENV.http+'/devices/getProfile?deviceId='+device.user._id+'&credential='+device.credential).success(function(response){
                fn(response);
                CacheSvc.set(ENV.http+'/devices/getProfile?deviceId='+device.user._id,response.result);
            });
        };

        /**
         *
         * @method getById
         * @param deviceId
         * @param fn
         */
        device.getById = function(deviceId,fn){
            var profile = CacheSvc.get(ENV.http+'/devices/getById');
            if(profile.length > 0){
                fn({result:profile});
            }
            $http.post(ENV.http+'/devices/getById?credential='+device.credential,{deviceId:deviceId,device:device.user}).success(function(response){
                fn(response);
                CacheSvc.set(ENV.http+'/devices/getById',response.result);
            });
        };

        /**
         * Add or update skills to the device
         * @method updateSkill
         * @param skills
         * @param fn
         */
        device.updateSkill = function(skills,fn){
            $http.post(ENV.http+'/device/update?credential='+device.credential,{_id:device.user._id,skill:skills}).success(function(response){
                fn(response);
            });
        };

        /**
         * Add or update skills to the device
         * @method update
         * @param profile
         * @param fn
         */
        device.update = function(profile,fn){
            $http.post(ENV.http+'/device/update?credential='+device.credential,profile).success(function(response){
                fn(response);
            });
        };

        /**
         *
         * @method getContacts
         * @param fn
         */
        device.getContacts = function(fn){
            var contacts = CacheSvc.get(ENV.http+'/contacts');
            if(contacts.length > 0){
                fn({result:contacts});
            }
            $http.post(ENV.http+'/contacts?credential='+device.credential,{device:device.user}).success(function(response){
                fn(response);
                CacheSvc.set(ENV.http+'/contacts',response.result);
            });
        };

        /**
         * @method askContact
         * @param userId
         * @param fn
         */
        device.askContact = function(userId,fn){
            var data = {
                userId:userId,
                device:device.user
            };
            $http.post(ENV.http+'/device/askContact?credential='+device.credential,data).success(function(response){
                fn(response);
            });
        };

        /**
         * Acepta el contacto
         * @method acceptContact
         * @param userId
         * @param fn
         */
        device.acceptContact = function(userId,fn){
            $http.post(ENV.http+'/device/acceptContact?credential='+device.credential,{userId:userId,device:device.user}).success(function(response){
                fn(response);
            });
        };

        /**
         * Cancel contact
         * @method cancelContact
         * @param userId
         * @param fn
         */
        device.cancelContact = function(userId,fn){
            $http.post(ENV.http+'/device/cancelContact?credential='+device.credential,{userId:userId,device:device.user}).success(function(response){
                fn(response);
            });
        };

        /**
         * Confirm contact
         * @method confirmContact
         * @param data
         * @param fn
         */
        device.confirmContact = function(data,fn){
            if(!data.name || !data._id){
                return;
            }
            var profilePopup = $ionicPopup.confirm({
                title: 'Solicitud de contacto',
                template: 'El usuario '+data.name+' desea ver tu información de contacto.'
            });
            profilePopup.then(function(res) {
                if(res) {
                    device.acceptContact(data._id,function(response){
                        if(typeof fn === 'function'){
                            fn(true);
                        }
                    });
                    return;
                }
                device.cancelContact(data._id,function(response){
                    if(typeof fn === 'function'){
                        fn(false);
                    }
                });
            });
        };

        return device;
    }
]);