/**
 * Controller for Calendars
 *
 * @module _Hack
 * @submodule calendar
 * @author Clcalendar A. Marrero
 * @class _Hack.Calendar
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    return (function(){

        function init(){
            params.app.get('/calendar',get);
        }

        /**
         * Get some calendar from db
         * @method get
         * @param req
         * @param res
         */
        function get(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Invalid session",{});
                return;
            }

            params.Hack.calendar_model.find({}).exec(function(err,doc){
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Listener
         *
         * @method on
         * @param socket {Object} Instance of socket
         */
        function on(socket){
        }

        return {
            on:on,
            init:init
        };
    })();

};