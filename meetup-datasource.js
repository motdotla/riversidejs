/* Meetup Data
 * ==========================
 * @constutor 	Meetup
 * @param 		group 	String - the groupname 
 */

var Meetup 	= function(group){
	this.group 		= group;
	this.url_base 	= 'https://api.meetup.com';
	this.key 		= process.env.MEETUPKEY || '15865a185323203c58305f1a7b216c';
},
	http 	= require('http');

/* 
 * @method 	_request 			- sends request to meetup.com's api 
 * @param 	path 	String 		- the suffix of the url
 * @param 	cb 		Function 	- callback function
 */

Meetup.prototype._request = function(path, cb){
	var options = {
		host 	: this.url_base,
		port 	: 80,
		path 	: path,
		method 	: 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	}

	http.request(options, function(res){
		res.setEncoding('utf-8');
		res.on('data', cb);
	})	
}

/* 
 * @method 	getEvents 				- get events for meetup
 * @param 	number 		Interger 	- number of events to get
 * @param	cb 			Function 	- callback function
 */

Meetup.prototype.getEvents = function(number, cb){
	var path = '/2/events/';

	path += '?sign=true';
	path += '&group_urlname=' + this.group;
	path += '&page=' + number;
	path += '&key=' + this.key;

	this._request(path, cb);
	
}

exports.Meetup = Meetup;