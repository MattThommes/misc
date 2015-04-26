#!/bin/env node
(function($) {

	var express = require("express");
	var cons = require("consolidate");
	//var request = require("request");
	var RSVP = require("rsvp");
	var ActiveCampaign = require("activecampaign");

	var Test = function() {

		var self = this;
		self.ipaddress = "localhost";
		self.port = process.env.port || 8082;

		self.create_routes = function() {
			self.routes = {};
			self.routes["/"] = {method: "get", callback: function(req, res) {
				res.render("index", {
					title: "My title",
					test1: "test"
				});
			}};
		}

		self.terminator = function(sig) {
			if (typeof sig === "string") {
				console.log('%s: Received %s - terminating sample app ...',
					Date(Date.now()), sig);
				process.exit(1);
			}
			console.log('%s: Node server stopped.', Date(Date.now()));
		};

		self.setup_terminate = function() {
			process.on('exit', function(err) {
				throw new Error("process is exiting");
				self.terminator();
			});
		}

		self.initialize = function() {
			self.create_routes();
			self.app = express();
			self.app.engine("html", cons.handlebars);
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
			//self.setup_terminate();
			//self.server();
		}

		self.server = function() {
			self.app.listen(self.port, self.ipaddress, function() {        
				console.log('%s: Node server started on %s:%d ...',
					Date(Date.now()), self.ipaddress, self.port);
			});
		};

		self.activecampaign = function(api_url, api_key) {
			self.ac = new ActiveCampaign(api_url, api_key);
			//self.ac.debug = true;
		}

	}

	var test = new Test();

	// If this produces "EADDRINUSE", run `ps aux | grep node`, then `kill -9 PID`
	test.initialize();
	//test.activecampaign("", "");

})();