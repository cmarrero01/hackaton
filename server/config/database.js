/**
* Database Configurations, replicaset, user, password, name of database, servers etc.
* You will need change this fail in every environment that you want to install this server.
* 
* @module _Hack
* @submodule database
* @author Claudio A. Marrero
* @class _Hack.database
*/
'use strict';
module.exports = function(params){

	if(!params.Hack){
		return;
	}

	var Config = (function(){

		/**
		* Name of database
		* @property _database
		* @type {String}
		* @private
		*/
		var _database = 'hack';

		/**
		* Options to connect to mongodb
		* @property options
		* @type {Object}
		*/
		var options = {
			db: {  safe: true, strict: false, native_parser:true },
			server: { poolSize: 3 },
			replset: { rs_name: 'hack', strategy: 'ping'},
			user:'hack',
			pass: 'hack2015$'
		};

		options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };

		/**
		* List of servers of replicaset
		* @property servers
		* @type {Object}
		*/
		var servers = {
			a:{
				host:'localhost',
				user: options.user,
				pass: options.password,
				db:_database,
				port:27017
			},
			b:{
				host:'localhost',
				user: options.user,
				pass: options.password,
				db:_database,
				port:27017
			},
			c:{
				host:'localhost',
				user: options.user,
				pass: options.password,
				db:_database,
				port:27017
			}
		};

		servers.a.connect = 'mongodb://'+servers.a.user+':'+servers.a.pass+'@'+servers.a.host+':'+servers.a.port+'/'+servers.a.db;
		servers.b.connect = 'mongodb://'+servers.b.user+':'+servers.b.pass+'@'+servers.b.host+':'+servers.b.port;
		servers.c.connect = 'mongodb://'+servers.c.user+':'+servers.c.pass+'@'+servers.c.host+':'+servers.c.port;

		servers.connectString = servers.a.connect+','+servers.b.connect+','+servers.c.connect;


		return {
			db:options,
			servers:servers
		};
	})();
	
	return Config;
};