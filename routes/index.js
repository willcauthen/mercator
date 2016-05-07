var express = require('express');
var router = express.Router();
var util = require('util');
var r = require('rethinkdb');
var b = require('bluebird');
var Chance = require('chance');
var chance = new Chance();
// secret api key!!
// AIzaSyBK230fSFRfv7OuNhR9Tn3hSX9WywaaPUw


/*routes */
/* GET home page. */
router.get('/', serveGetUsers);

function serveGetUsers(request, response, next){
	getUsers(request._rdb).then(function(users){
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
