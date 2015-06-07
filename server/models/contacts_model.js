/**
 * Contacts Model Schema
 * @module _Hack
 * @submodule skill_model
 * @author Claudio A. Marrero
 * @class _Hack.skill_model
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    /**
     * A Schema for contacts
     * @property schema
     * @type {Mongoose.Schema}
     * @private
     */
    var schema = new params.mongoose.Schema({
        "deviceTo": { type: params.mongoose.Schema.Types.ObjectId, ref:'device'},
        "deviceFrom": { type: params.mongoose.Schema.Types.ObjectId, ref:'device'},
        "status":{type: Boolean, default: false}
    });

    return params.mongoose.model('contacts', schema, 'contacts');
};