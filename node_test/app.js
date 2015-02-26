#!/bin/env node
var express = require("express");
var request = require("request");
var RSVP = require("rsvp");
var ActiveCampaign = require("activecampaign");

var Test = function() {

	var self = this;
	self.ipaddress = "localhost";
	self.port = 8082;

	self.server = function() {
		self.app = express();
		self.app.listen(self.port, self.ipaddress, function() {        
			console.log('%s: Node server started on %s:%d ...',
				Date(Date.now()), self.ipaddress, self.port);
		});
	};

	self.activecampaign = function(api_url, api_key) {
		var ac = new ActiveCampaign(api_url, api_key);
		ac.debug = true;
	}

}

var test = new Test();
//test.server();
test.activecampaign("", "");