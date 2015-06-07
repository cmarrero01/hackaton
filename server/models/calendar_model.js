/**
 * Calendar Model Schema
 * @module _Hack
 * @submodule calendar_model
 * @author Claudio A. Marrero
 * @class _Hack.calendar_model
 */
'use strict';
module.exports = function(params){

    if(!params.Hack){
        return;
    }

    /**
     * A Schema for calendars
     * @property schema
     * @type {Mongoose.Schema}
     * @private
     */
    var schema = new params.mongoose.Schema({
        "date": {type: String},
        "exponent": {type: String},
        "subject":{type: String},
        "hour":{type: String}
    });

    return params.mongoose.model('calendar', schema, 'calendar');
};