/**
 * Controller for Devices
 *
 * @module _Hack
 * @submodule device
 * @author Cldevice A. Marrero
 * @class _Hack.Device
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    var gcm = require('node-gcm');

    return (function(){

        var tokens = [];

        function init(){
            params.app.get('/login',login);
            params.app.put('/register',register);
            params.app.post('/device/update',update);
            params.app.post('/devices',get);
            params.app.post('/devices/getById',getById);
            params.app.get('/devices/getProfile',getProfile);
            params.app.post('/device/askContact',askContact);
            params.app.post('/device/acceptContact',acceptContact);
            params.app.post('/device/cancelContact',cancelContact);
        }

        /**
         * Login devices
         *
         * @method login
         * @param req {Object} request instance
         * @param res {Object} params data
         */
        function login(req,res){

            var credential = req.query.credential;

            var query = {
                credential:credential
            };

            var loginCb = function(err,deviceDoc){
                if(!deviceDoc){
                    params.Hack.response.http(req,res,"Device null",{});
                    return;
                }
                tokens[credential] = deviceDoc;
                params.Hack.response.http(req,res,err,deviceDoc);
            };

            params.Hack.device_model.findOne(query).exec(loginCb);
        }

        /**
         * Register devices
         *
         * @method register
         * @param req {Object} express instance
         * @param res {Object} params data
         */
        function register(req,res){

            var email = req.body.email;
            var credential = req.query.credential;

            var deviceObject = {
                email:email,
                credential:credential
            };

            var registerCb = function(err,deviceDoc){
                if(!deviceDoc){
                    params.Hack.response.http(req,res,"Problem registering",{});
                    return;
                }
                tokens[credential] = deviceDoc;
                params.Hack.auth.getCredentials(function(credentials){
                    params.Hack.response.http(req,res,err,deviceDoc);
                });
            };

            params.Hack.device_model.create(deviceObject,registerCb);
        }

        /**
         * UpDate profile of device
         * @method update
         * @param req
         * @param res
         */
        function update(req,res){
            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Update: Invalid session",{});
                return;
            }
            params.Hack.device_model.findByIdAndUpdate(req.body._id,{$set:req.body},function(err,doc){
                params.Hack.response.http(req,res,err,doc);
                tokens[req.query.credential] = doc;
            });
        }

        /**
         * Get some device from db
         * @method get
         * @param req
         * @param res
         */
        function get(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Get devices: Invalid session",{});
                return;
            }

            var query = {
                _id:{
                    $ne:req.body.device._id
                }
            };

            if(req.body.skill){
                query.skill = {
                    $regex: req.body.skill,
                    $options : 'i'
                };
            }
            params.Hack.device_model.find(query).select({credential:0}).exec(function(err,doc){
                if(!doc){
                    params.Hack.response.http(req,res,"No devices",{});
                    return;
                }
                doc.forEach(function(item){
                    item.isContact = !(!item.contacts || item.contacts.length <= 0 || item.contacts.indexOf(req.body.device._id) === -1);
                });
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Get some device from db
         * @method get
         * @param req
         * @param res
         */
        function getById(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Get device by id: Invalid session",{});
                return;
            }

            params.Hack.device_model.findById(req.body.deviceId).select({credential:0}).exec(function(err,doc){
                if(!doc){
                    params.Hack.response.http(req,res,"No device",{});
                    return;
                }
                doc.isContact = !(!doc.contacts || doc.contacts.length <= 0 || doc.contacts.indexOf(req.body.device._id) === -1);
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Get some device from db
         * @method getProfile
         * @param req
         * @param res
         */
        function getProfile(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Get profile: Invalid session",{});
                return;
            }

            params.Hack.device_model.findById(req.query.deviceId).select({credential:0}).exec(function(err,doc){
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Ask user for contact
         * @param req
         * @param res
         */
        function askContact(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Ask contact: Invalid session",{});
                return;
            }

            if(!req.body.userId){
                params.Hack.response.http(req,res,"Userid is invalid",{});
                return;
            }

            params.Hack.device_model.findById(req.body.userId).exec(function(err,doc){
                if(err || !doc){
                    params.Hack.response.http(req,res,err,doc);
                    return;
                }
                params.Hack.contacts_model.create({deviceTo:doc._id,deviceFrom:req.body.device._id,status:false},function(e,d){
                    if(e || !d){
                        params.Hack.response.http(req,res,"No se creo la lista",d);
                        return;
                    }
                    params.Hack.response.http(req,res,err,doc);
                    sendNotification(doc,req.body.device);
                });
            });
        }


        /**
         * Enviar notificacion para conectar
         * @method sendNotification
         * @param userTo
         * @param userFrom
         */
        function sendNotification(userTo,userFrom){

            var message = new gcm.Message({
                collapseKey: 'demo',
                delayWhileIdle: true,
                timeToLive: 3000,
                data: {
                    title: "Nueva solicitud",
                    message: userFrom.name+" quiere conectar.",
                    userId: userFrom._id
                }
            });

            if(!userTo.registerId){
                return;
            }

            var sender = new gcm.Sender(params.Hack.gcm.APIKey);
            sender.send(message, [userTo.registerId], function (err, result) {
                if (err) {
                    console.log(err,result);
                    return;
                }
                console.log('Notification send successful');
            });
        }

        /**
         *
         * @method acceptContact
         * @param req
         * @param res
         */
        function acceptContact(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Accept contact: Invalid session",{});
                return;
            }

            if(!req.body.userId){
                params.Hack.response.http(req,res,"user id undefined",{});
                return;
            }

            if(req.body.userId == req.body.device._id){
                params.Hack.response.http(req,res,"Same ids",{});
                return;
            }

            params.Hack.device_model.findByIdAndUpdate(req.body.device._id,{$push:{contacts:req.body.userId}},{multi:true},function(errMy,docMy){
                if(errMy){
                    params.Hack.response.http(req,res,errMy,docMy);
                    return;
                }
                params.Hack.device_model.findByIdAndUpdate(req.body.userId,{$push:{contacts:req.body.device._id}},{multi:true},function(errThey,docThey){
                    notificationAccept(docMy,docThey);
                    params.Hack.contacts_model.findOneAndUpdate({deviceTo:req.body.device._id,deviceFrom:req.body.userId},{$set:{status:true}},function(err,doc){
                        params.Hack.response.http(req,res,err,doc);
                    });
                });
            });
        }

        /**
         * Notificacion de contacto aceptado
         * @method notificationAccept
         * @param userSend
         * @param userReceive
         */
        function notificationAccept(userSend,userReceive){

            var message = new gcm.Message({
                collapseKey: 'demo',
                delayWhileIdle: true,
                timeToLive: 3000,
                data: {
                    title: "Solicitud Aceptada",
                    message: userSend.name+" acepto tu solicitud."
                }
            });

            if(!userReceive.registerId){
                return;
            }

            var sender = new gcm.Sender(params.Hack.gcm.APIKey);
            sender.send(message, [userReceive.registerId], function (err, result) {
                if (err) {
                    console.log(err,result);
                    return;
                }
                console.log('Notification send successful');
            });
        }

        /**
         * @method cancelContact
         * @param req
         * @param res
         */
        function cancelContact(req,res){
            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Accept contact: Invalid session",{});
                return;
            }

            if(!req.body.userId){
                params.Hack.response.http(req,res,"userid is undefined",{});
                return;
            }

            var query = {
                deviceTo:req.body.device._id,
                deviceFrom:req.body.userId
            };

            params.Hack.contacts_model.findOneAndRemove(query).exec(function(err,doc){
                if(err || !doc){
                    params.Hack.response.http(req,res,err,doc);
                    return;
                }
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Listener
         *
         * @method on
         * @param socket {Object} Instnace of socket
         */
        function on(socket){

        }

        return {
            on:on,
            init:init
        };
    })();

};