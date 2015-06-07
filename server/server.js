/**
* Main Class Hack
* @module _Hack
* @author Claudio A. Marrero
* @class _Hack
* @main Hack
*/

var Debug = require('./config/debug.js')(null);

'use strict';
var Hack = (function(){

  	/**
	* Driver for mongodb
	* @property _mongoose
	* @type {Object}
	* @private
	*/
	var _mongoose = require('mongoose');

	/**
	* Validate module for schems of mongoose
	* @property _validate
	* @type {Object}
	* @private
	*/
	var _validate = require('mongoose-validate');

	/**
	* File Helper module
	* @property _fs
	* @type {Object}
	* @private
	*/
	var _fs = require('fs');

    /**
     * Paht handler
     * @type {exports}
     * @private
     */
	var _path = require('path');

	/**
	* Mailer module, usefull for send emails only
	* @property _eMails
	* @type {Object}
	* @private
	*/
	var _eMails = require('mailer');

	/**
	* A list of modules that need to load before everything
	* @property _InitLoad
	* @type {Object}
	* @private
	*/
	var _InitLoad = ['./config/'];

	/**
	* A main object that have all modules, controlers, models, etc.
	* @property _Hack
	* @type {Object}
	* @private
	*/
	var _Hack = null;

	/**
	* Express module to public some endpoints from http
	*
	* @property _express
	* @type {Object}
	* @private
	*/
	var _express = require('express');

	/**
	* Express module to public some endpoints from http
	*
	* @property _bodyParser
	* @type {Object}
	* @private
	*/
	var _bodyParser = require('body-parser');

	/**
	* Instance of express
	*
	* @property _app
	* @type {Object}
	* @private
	*/
	var _app = _express();

    /**
     * Underscore
     * @property _
     * @type {_|exports}
     * @private
     */
    var _ = require('underscore');

    var server = require('http').Server(_app);
    var _io = require('socket.io')(server);

	_app.use(_bodyParser.json());
    _app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    _app.use('/uploads',_express.static('./uploads'));
    server.listen(7777);

	/**
	* This method make the initialization of all yapp server,
	* Makes a load of all modules and shot the connection to mongodb
	*
	* @method init
	* @example Hack.init();
	*/
	function init(){

		var _params = {
            _:_,
			mongoose:_mongoose,
			validate:_validate,
			fs:_fs,
			path:_path,
			emails:_eMails,
			load:_InitLoad,
			app:_app,
			express:_express,
            io:_io,
			debug:Debug.debug
		};

		var _loader = require('./load.js')(_params);
		_Hack = _loader.init();
		_Hack.deph = _params;

		connect();
	}

    function listener() {
        _Hack.deph.io.on('connection', function (socket) {
            _Hack.device.on(socket);
        });
        _Hack.device.init();
        _Hack.calendar.init();
        _Hack.skills.init();
        _Hack.contacts.init();
    }

	/**
	* Make a conexion to the database, 
	*
	* @method connect
	* @example connect();
	*/
	function connect(){
		if(!_Hack){
			console.log('_Hack is null');
			return;
		}
		_mongoose.connect(_Hack.database.servers.connectString,_Hack.database.db,function(err) {
			if(err) throw err;
            listener();
		});
	}

	return {
		init:init
	};
	
})();

Hack.init();