/**
 * Controller for Contactss
 *
 * @module _Hack
 * @submodule contacts
 * @author Clcontacts A. Marrero
 * @class _Hack.Contacts
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    return (function(){

        function init(){
            params.app.post('/contacts',get);
        }

        /**
         * Get some contacts from db
         * @method get
         * @param req
         * @param res
         */
        function get(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Ask contact: Invalid session",{});
                return;
            }

            if(!req.body.device._id || !req.body.device._id){
                params.Hack.response.http(req,res,"device is null",{});
                return;
            }

            var query = {
                $or:[{
                    deviceTo:req.body.device._id
                },{
                    deviceFrom:req.body.device._id
                }]
            };

            params.Hack.contacts_model.find(query).populate('deviceTo deviceFrom').exec(function(err,doc){
                if(err || !doc){
                    params.Hack.response.http(req,res,err,doc);
                    return;
                }
                doc.forEach(function(item){
                    if(!item.deviceTo)return;
                    item.deviceTo.isContact = !(!item.status || !item.deviceTo || !item.deviceTo.contacts || item.deviceTo.contacts.length <= 0 || item.deviceTo.contacts.indexOf(req.body.device._id) === -1);
                    if(!item.deviceFrom)return;
                    item.deviceFrom.isContact = !(!item.status || !item.deviceFrom || !item.deviceFrom.contacts || item.deviceFrom.contacts.length <= 0 || item.deviceFrom.contacts.indexOf(req.body.device._id) === -1);
                });
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Listener
         *
         * @method on
         * @param socket {Object} instance of socket
         */
        function on(socket){

        }

        return {
            on:on,
            init:init
        };
    })();

};