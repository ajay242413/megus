var config = require('config.json');
var mongoose = require('mongoose');

var connServiceDB = {};

connServiceDB.createConnectionDB = createConnectionDB;

module.exports = connServiceDB;

function createConnectionDB() {
	return mongoose.createConnection(config.connectionString + 'distiHub',{ useNewUrlParser: true });
}

mongoose.mtModel = function(name, schema, collectionName) {
};
