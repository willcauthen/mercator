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
function handleError(e) {
	console.log(e);
}

function serveGetUsers(request, response, next) {
	addUser(request._rdb, getIP(request)).then(function(){
		return getUsers(request._rdb);
	}).then(function(users) {
			response.render('index', 
				{ title: getIP(request), 
				   users: users
			});		
	}).catch(handleError)
	 .finally(next);
}

function getIP(request) {
	return ( request.headers["X-Forwarded-For"] || request.headers["x-forwarded-for"] || request.client.remoteAddress );
}

function getUsers(conn) {
	return r.db('test').table('users').run(conn).then(function(cursor) {
		return cursor.toArray();
	});
}

function addUser(conn, IP) {
	return geocoder.geocode(IP).then(function(geo) {
		console.log(geo);
		return { 
			name: chance.name(),
			ip: IP,
			lat: geo[0].latitude,
			lng: geo[0].longitude
		};
	}).then(function(newUser) {
		console.log(newUser);
		return r.db('test').table('users').insert(newUser).run(conn);
	});
}


module.exports = router;
