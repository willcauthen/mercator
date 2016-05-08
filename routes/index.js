var express = require('express'),
	router = express.Router(),
	util = require('util'),
	r = require('rethinkdb'),
	b = require('bluebird'),
	Chance = require('chance'),
	chance = new Chance(),
	geocoder = require('node-geocoder')("freegeoip", "http");

// secret api key!!
// AIzaSyBK230fSFRfv7OuNhR9Tn3hSX9WywaaPUw


/*routes */
/* GET home page. */
router.get('/', serveGetUsers);

function serveGetUsers(request, response, next){
	getUsers(request._rdb).then(function(users){
		geocoder.geocode(getIP(request)).then(function (geo) {
			console.log(geo);
		}).catch(function(err) {
			console.log(err);
		});
		response.render('index', { title: getIP(request), users: users });

	}).finally(next);
}

function getIP(request) {
	return ( request.headers["X-Forwarded-For"] || request.headers["x-forwarded-for"] || request.client.remoteAddress );
}

function getUsers(conn) {
	return r.db('test').table('users').run(conn).then(function(cursor) {
		return cursor.toArray();
	});
}


module.exports = router;
