/**
 * Device Model Schema
 * @module _Hack
 * @submodule device_model
 * @author Cldevice A. Marrero
 * @class _Hack.device_model
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    /**
     * A Schema for device
     * @property schema
     * @type {Mongoose.Schema}
     * @private
     */
    var schema = new params.mongoose.Schema({
        "name":{type: String},
        "email":{type: String, required:true},
        "occupation":{type: String},
        "twitter":{type: String},
        "phone":{type: String},
        "skill":[{type: String}],
        "contacts":[{type: String}],
        "isContact":{ type: Boolean},
        "credential":{type: String, required:true},
        "registerId":{type: String},
        "push":{type: Boolean, default: true},
        "lastLoginDate": {type: Date, default: new Date()},
        "createDate": {type: Date, default: new Date()}
    });

    schema.index({email: 1});

    return params.mongoose.model('device', schema, 'device');
};