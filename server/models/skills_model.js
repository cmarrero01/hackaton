/**
 * Skills Model Schema
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
     * A Schema for skills
     * @property schema
     * @type {Mongoose.Schema}
     * @private
     */
    var schema = new params.mongoose.Schema({
        "name": {type: String}
    });

    return params.mongoose.model('skills', schema, 'skills');
};