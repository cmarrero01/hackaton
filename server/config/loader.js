/**
* A list of modules that you want to load, the order is very important, the controllers always in the end of array
*
* @module _Hack
* @submodule loader
* @author Claudio A. Marrero
* @class _Hack.loader
*/
'use strict';
module.exports = function(params){
	
	return [
		'./config/',
		'./models/',
		'./controllers/',
		'./libs/'
	];

};