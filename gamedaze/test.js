var http = require("http"),
    request = require("request");

var GD_Test = {

	parks: [
		
		{
			"foursquare_id": "40dcbc80f964a52081011fe3",
			"name": "Wrigley Field"
		},
		
		{
			"foursquare_id": "4c51fb889426c9288d6aa974",
			"name": "Marlins Park"		
		},

		{
			"foursquare_id": "40eb3d00f964a520250a1fe3",
			"name": "Fenway Park"		
		},
		
		{
			"foursquare_id": "40ede000f964a520360a1fe3",
			"name": "Turner Field"		
		},
		
		{
			"foursquare_id": "49ca9382f964a520bf581fe3",
			"name": "Nationals Park"		
		}
		
	],

	request: function(url, cb) {
	
		var request_options = {
			method: "GET",
			url: url,
			body: ""
		};
	
		request(request_options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				if (typeof result.result_code != "undefined") {
					result.success = result.result_code;
					if (!result.result_code) {
						result.error = result.result_message;
					}
				}
				else if (typeof result.succeeded != "undefined") {
					result.success = result.succeeded;
					if (!result.succeeded) {
						result.error = result.message;
					}
				}
				return cb(result);
			}
			else {
				console.log("Error: " + response.statusCode);
			}
		});	
	
	}
		
};

// these should be in app_keys.js
var client_id = "";
var client_secret = "";

console.log(GD_Test.parks);

/*
var test = GD_Test.request("https://api.foursquare.com/v2/venues/40dcbc80f964a52081011fe3?client_id=" + client_id + "&client_secret=" + client_secret + "&v=20120927", function(response) {

	console.log(response);

});
*/

module.exports = GD_Test;