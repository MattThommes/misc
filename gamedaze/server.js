#!/bin/env node
var express = require("express");
var cons = require("consolidate");
var request = require("request");
var mongodb = require("mongodb");
//var fs = require('fs');

var GD_Test = {

	parks: [ {
			"foursquare_id": "40dcbc80f964a52081011fe3",
			"name": "Wrigley Field"
		}, {
			"foursquare_id": "4c51fb889426c9288d6aa974",
			"name": "Marlins Park"		
		}, {
			"foursquare_id": "40eb3d00f964a520250a1fe3",
			"name": "Fenway Park"		
		}, {
			"foursquare_id": "40ede000f964a520360a1fe3",
			"name": "Turner Field"		
		}, {
			"foursquare_id": "49ca9382f964a520bf581fe3",
			"name": "Nationals Park"		
		}, {
			"foursquare_id": "4b155044f964a5203db023e3",
			"name": "Angel Stadium of Anaheim"
		}, {
			"foursquare_id": "4b155088f964a520beb023e3",
			"name": "Safeco Field"
		}, {
			"foursquare_id": "430e5b80f964a52043271fe3",
			"name": "O.co Coliseum"
		}
	],

	request: function(url, method, body, cb) {
	
		var request_options = {
			method: method,
			url: url,
			body: body
		};
	
		request(request_options, function(error, response, body) {
			console.log(error);
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				return cb(result);
			}
			else {
				//console.log("Error: " + response.statusCode);
				console.log("error with request");
			}
		});	
	
	}
		
};

var GameDaze = function() {

	var self = this;

	var mongodb_host = (typeof process.env.OPENSHIFT_MONGODB_DB_HOST != "undefined") ? process.env.OPENSHIFT_MONGODB_DB_HOST : "localhost";
	var mongodb_port = (typeof process.env.OPENSHIFT_MONGODB_DB_PORT != "undefined") ? parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) : 27017;
	var mongodb_db = (typeof process.env.OPENSHIFT_APP_NAME != "undefined") ? process.env.OPENSHIFT_APP_NAME : "test";
	
	self.dbServer = new mongodb.Server(mongodb_host, mongodb_port);
  self.db = new mongodb.Db(mongodb_db, self.dbServer, {auto_reconnect: true});
  self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
  self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
	
	/**
	 *  Set up server IP address and port # using env variables/defaults.
	 */
	self.setupVariables = function() {
		//  Set the environment variables we need.
		self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
		self.port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
		
		console.log("Using port " + self.port);

		if (typeof self.ipaddress === "undefined") {
			//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
			//  allows us to run/test the app locally.
			console.warn('No OPENSHIFT_NODEJS_IP var, using localhost');
			self.ipaddress = "localhost";
		};
	};

	/**
	 *  Populate the cache.
	 */
	self.populateCache = function() {
		if (typeof self.zcache === "undefined") {
			self.zcache = { 'index.html': '' };
		}
		//  Local cache for static content.
		//self.zcache['index.html'] = fs.readFileSync('./index.html');
	};

	/**
	 *  Retrieve entry (content) from cache.
	 *  @param {string} key  Key identifying content to retrieve from cache.
	 */
	self.cache_get = function(key) { return self.zcache[key]; };

	/**
	 *  terminator === the termination handler
	 *  Terminate server on receipt of the specified signal.
	 *  @param {string} sig  Signal to terminate on.
	 */
	self.terminator = function(sig){
		if (typeof sig === "string") {
			console.log('%s: Received %s - terminating sample app ...',
				Date(Date.now()), sig);
			process.exit(1);
		}
		console.log('%s: Node server stopped.', Date(Date.now()) );
	};

	/**
	 *  Setup termination handlers (for exit and a list of signals).
	 */
	self.setupTerminationHandlers = function(){
		//  Process on exit and signals.
		process.on('exit', function(err) {
			throw new Error("process is exiting");
			self.terminator();
		});
		process.on('uncaughtException', function(err) {
			if (err.errno === 'EADDRINUSE') {
				console.log("Port in use - might have to restart Terminal");
				//self.terminator();
			}
		});

		// Removed 'SIGPIPE' from the list - bugz 852598.
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
		 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach(function(element, index, array) {
				process.on(element, function() {
					self.terminator(element);
				});
		});
	};

	/**
	 *  Create the routing table entries + handlers for the application.
	 */
	self.createRoutes = function() {

		self.routes = {};

		self.routes["/health"] = {method: "get", callback: function(req, res) {
			res.send("1");
		}};

		self.routes["/"] = {method: "get", callback: function(req, res) {

			// these should be in app_keys.js
			var client_id = "";
			var client_secret = "";

			var url = "https://api.foursquare.com/v2/venues/40dcbc80f964a52081011fe3?client_id=" + client_id + "&client_secret=" + client_secret + "&v=20120927";

			var test_obj = {"Name": "yo", "pos": 1};
			/*var test = GD_Test.request("http://" + req.headers.host + "/post", "post", test_obj, function(result) {

				if (result.meta.code == 200) {
					res.render("index", {
						title: "",
						test1: ""
					});
				}

			});*/

			res.render("index", {
				title: "test",
				test1: "test"
			});
			
			/*var test = GD_Test.request(url, "get", "", function(result) {

				if (result.meta.code == 200) {
					res.render("index", {
						title: "GameDaze",
						test1: result.response.venue.name
					});
				}

			});*/

		}};

		self.routes["/post"] = {method: "post", callback: function(req, res) {

		  self.db.collection("test1").insert(test_obj), function(result) {
		    res.end("success");
		  };

		}};
		
		self.routes["/fetch"] = {method: "get", callback: function(req, res) {

			self.db.collection("test1").find().toArray(function(err, names) {
				res.header("Content-Type:","text/json");
				res.end(JSON.stringify(names));
			});

		}};
		
	};

	self.initializeServer = function() {
		self.createRoutes();
		self.app = express();

		self.app.engine("html", cons.mustache);
		self.app.set("view engine", "html");
		self.app.set("views", __dirname + "/views");

		for (var r in self.routes) {
			if (self.routes[r].method == "get") {
				self.app.get(r, self.routes[r].callback);
			}
			else if (self.routes[r].method == "post") {
				self.app.post(r, self.routes[r].callback);
			}
		}

	};

	self.initialize = function() {
		self.setupVariables();
		self.populateCache();
		self.setupTerminationHandlers();
		self.initializeServer();
	};

	self.connectDb = function(callback) {
    self.db.open(function(err, db) {
      if (err) { throw err };
      self.db.authenticate(self.dbUser, self.dbPass, {authdb: "admin"}, function(err, res) {
        if (err) { throw err };
        callback();
      });
    });
  };

	self.start = function() {
		self.app.listen(self.port, self.ipaddress, function() {        
			console.log('%s: Node server started on %s:%d ...',
				Date(Date.now() ), self.ipaddress, self.port);
		});
	};

};

var gd = new GameDaze();
gd.initialize();
gd.connectDb(gd.start());