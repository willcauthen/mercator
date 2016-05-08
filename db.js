var r = require('rethinkdb');
var b = require('bluebird');
var Chance = require('chance');
var chance = new Chance();
var _ = require('lodash');


function initDB(connection) {
	return r.db('test')
			 .tableCreate('users')
			 .run(connection).then(function(arg){

				r.table('users').insert(genUsers(0)).run(connection);	
			}).catch(function(error){
				console.log(error);
			});
}

function dropDB(connection) {
	return r.db('test').tableDrop('users').run(connection);
}

function resetDB(connection) {
	return b.Promise.any([
			dropDB(connection),
			initDB(connection)
		]);
}  

function genUser() {
	return {
		name: chance.name(),
		ip: chance.ip(),
		lat: chance.latitude(),
		lng: chance.longitude()
	};
	// lat and lng coming soon
}
function genUsers(num) {
	var usah = _.times(num, genUser);
	console.log(usah);
	return usah;
}

module.exports = {
	dropDB: dropDB,
	initDB: initDB,
	resetDB: resetDB
};