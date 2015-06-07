/**
 * Controller for Skills
 *
 * @module _Hack
 * @submodule skills
 * @author Claudio  A. Marrero
 * @class _Hack.Skills
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    return (function(){

        function init(){
            params.app.get('/skills',get);
            params.app.put('/skills',add);
        }

        /**
         * Get some skills from db
         * @method get
         * @param req
         * @param res
         */
        function get(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"get skills: Invalid session",{});
                return;
            }

            params.Hack.skills_model.find({}).exec(function(err,doc){
                params.Hack.response.http(req,res,err,doc);
            });
        }

        /**
         * Add some skills to db
         * @method add
         * @param req
         * @param res
         */
        function add(req,res){

            if(!params.Hack.auth.validateHttpSession(req)){
                params.Hack.response.http(req,res,"Put skills: Invalid session",{});
                return;
            }

            params.Hack.skills_model.create(req.body.skills,function(err,doc){
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