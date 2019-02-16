var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('config.json');
var Q = require('q');
var userService = require('services/user.service');

var genericService = {};
genericService.isConnected = isConnected;
genericService.tokenToUsrObj = tokenToUsrObj;

module.exports = genericService;

function isConnected(connObjDB) {
	connObjDB.on('open', function() {
		console.log("opened");
	});
	connObjDB.on('connected', function() {
		console.log("connected");
	});
}

function tokenToUsrObj(token) {
	var deferred = Q.defer();
	jwt.verify(token, config.secret, function(err, userID) {
		if(userID) {
			userService.readLoginUser(userID.sub)
			.then(function(usrObj) {
				deferred.resolve(usrObj);
			})
			.catch(function(err) {
				deferred.reject(err);
			});
		} else if(err) {
			deferred.reject(err);
		}
	});
	return deferred.promise;
}