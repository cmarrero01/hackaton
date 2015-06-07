/**
 * Google Cloud Messaging configuration
 *
 * @module _Hack
 * @submodule gcm
 * @author Claudio Marrero
 * @class _Hack.gcm
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    return {
        APIKey: 'api gcm'
    };
};
