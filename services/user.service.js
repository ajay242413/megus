var config = require('config.json');
var Q = require('q');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var schemaObj = require('./custom.schema');
// var loginData = {};
var user_enc = {};

var userService = {};

userService.authenticate = service_authenticate;
userService.addUser = service_addUser;
userService.createPassword = service_createPassword;
userService.readCurrentUser = service_readCurrentUser;
userService.getParentUsers = service_getParentUsers;
//userService.loginUser = service_loginUser; //this line has to be removed after multiple session s completed
userService.logOut = service_logOut;
userService.readLoginUser = service_readLoginUser;
userService.readBrandID = service_readBrandID;
userService.loginAuthorRefID = service_loginAuthorRefID;
userService.readDealerAuthorID = service_readDealerAuthorID;
userService.getUsersByRefname = service_getUsersByRefname;
userService.getClient = service_getClient;
userService.getDealer = service_getDealer;
userService.getAuthorDealer = service_getAuthorDealer;

function service_addUser(usrObj) {
	var deferred = Q.defer();
	if(usrObj) {
		schemaObj.userModel.create(usrObj, function(err, ret_user) {
			if(err) {
				deferred.reject(err);
			}
			if(ret_user) {
				deferred.resolve(ret_user);
			}
		});
	}
	return deferred.promise;
}

function service_getUsersByRefname(refNameObj) {
	var deferred = Q.defer();
	schemaObj.userModel.find(refNameObj, function(err, usr) {
		if(err) {
			deferred.reject(err);
		}
		if(usr) {
			deferred.resolve(usr);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getParentUsers(loginUsr) {
	var deferred = Q.defer();
	schemaObj.userModel.find({parentID: loginUsr.authorID},{_id: 1,refID: 1}, function(err, usr) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(usr) {
			deferred.resolve(usr);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_readCurrentUser(_id){
	var deferred = Q.defer();
	schemaObj.userModel.findById(_id, function(err, usr) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(usr){
			deferred.resolve(usr);
		} else{
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_authenticate(email,password) {
	var deferred = Q.defer();
	schemaObj.userModel.findOne({$and: [{active: true},{email: email}]}, function(err, usr) {
		if(err) {
			console.log('error: ' + err + ';user: ' + usr);
			deferred.reject(err);
		}
		if(usr) {
			console.log('Inside user service authenticate');
			bcrypt.compare(password,usr.password)
			.then(function(passwordStatus) {
				if(passwordStatus) {
					console.log("Auth successful");
					var loginData = JSON.parse(JSON.stringify(usr));
					user_enc = jwt.sign({sub: usr._id}, config.secret);
					if(loginData.refName === 'employee') {
						deferred.resolve({'token': user_enc, 'permission': loginData.refID.permission});
					} else {
						deferred.resolve({'token': user_enc});
					}
					//check why this function being used.  Remove if this is not intended DB check
					// schemaObj.userModel.findOne({'_id': loginData.authorID,'authorID': loginData.authorID}, function (logErr, logRes) {
					// 	if(logErr){
					// 		console.log('Error in get author ref ID:' + logErr);
					// 	}
					// 	if(logRes){
					// 		loginAuthorRefID = JSON.parse(JSON.stringify(logRes));
					// 	}
					// });
					schemaObj.userLogModel.create({userID: usr._id,logType: 'IN',time: moment(new Date()).format('HH:mm:ss'),date: moment(new Date()).format('YYYY-MM-DD'),authorID: usr.authorID}, function(logErr, logRes) {
						if(logErr){
							console.log('Error in user login entry:'+logErr);					
						}
					});
				} else {
					console.log('ERROR: Password did not match');
					deferred.resolve();
				}
			})
			.catch(function(err) {
				console.log(err);
				deferred.reject(err);
			});
		} else {
			console.log("Auth Failed");
			deferred.resolve();
		}
	});
	console.log("From user service /authenticate :" + deferred.promise);
	return deferred.promise;
}

function service_createPassword(email, password) {
	var deferred = Q.defer();
	schemaObj.userModel.findOne({$and: [{active: true},{email: email}]}, function(err, usr) {
		if(err) {
			console.log('error: ' + err + ';user: ' + usr);
			deferred.reject(err);
		}
		if(usr) {
			var BCRYPT_SALT_ROUNDS = 12;
			console.log('Active user account found for ' + email);
			bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
			.then(function(hashedPassword) {
				schemaObj.userModel.findByIdAndUpdate(usr._id, {password: hashedPassword}, {new: true}, function(err, usrUpdate) {
					console.log('inside user service create password - findByIdAndUpdate');
					if(err) {
						console.log('ERROR: Failed to set user password');
						deferred.reject(err);
					}
					if(usrUpdate) {
						console.log('INFO: Successfully set the user password');
						deferred.resolve(jwt.sign({ sub: usrUpdate._id }, config.secret));
						schemaObj.userLogModel.create({userID: usrUpdate._id,logType: 'IN',time: moment(new Date()).format('HH:mm:ss'),date: moment(new Date()).format('YYYY-MM-DD'),authorID: usrUpdate.authorID}, function(logErr, logRes) {
							if(logErr){
								console.log('Error in user login entry:'+logErr);					
							}
						});
					} else {
						console.log('ERROR: Failed to return user object');
						deferred.resolve();
					}
				});
			})
			.catch(function(err) {
				console.log(err);
				deferred.reject(err);
			});
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

// function service_loginUser(){
// 	return loginData;
// }

function service_readLoginUser(usrID) {
	var deferred = Q.defer();
	if(usrID) {
		schemaObj.userModel.findById(usrID, function(err, usr) {
			if(usr) {
				deferred.resolve(usr);
			} else if(err) {
				deferred.reject(err);
			}
		});
	}
	return deferred.promise;
}

function service_logOut(){
	if(loginData._id){
		schemaObj.userLogModel.create({userID: loginData._id,logType: 'OUT',time: moment(new Date()).format('HH:mm:ss'),date: moment(new Date()).format('YYYY-MM-DD'),authorID: loginData.authorID}, function(err, usr) {
			if(err){
				console.log('Error in user logout entry:'+err);					
			}
		});
	}
}

function service_readBrandID(){
	var deferred = Q.defer();
	schemaObj.userModel.findOne({refID: {$exists: false},userType: 'b'},{"authorID": 1,"_id": 0}, function(err, usr) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} 
		if(usr) {
			deferred.resolve(usr);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_readDealerAuthorID(obj) {
	var deferred = Q.defer();
	var cond = {};
	if(obj.refId){
		cond = {refID: obj.refId};
	} else{
		cond = {parentID: obj.authorID,refName: 'dealer'};
	}
	schemaObj.userModel.find(cond,{_id: 1}, function(err, usr) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(usr) {
			deferred.resolve(usr);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_loginAuthorRefID(loginUsr) {
	var deferred = Q.defer();
	schemaObj.userModel.findOne({'_id': loginUsr.authorID,'authorID': loginUsr.authorID}, function (logErr, logRes) {
		if(logErr) {
			console.log(logErr);
			deferred.reject(logErr);
		}
		if(logRes) {
			deferred.resolve(logRes);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getClient(){
	var deferred = Q.defer();
	schemaObj.userModel.find({refName: 'client'},{password: 0,email: 0,userType: 0,active: 0,createdBy: 0,creationTime: 0,modifiedTime: 0,modifiedDate: 0,modifiedBy: 0},function(err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err.name + ': ' + err.message);
		}
		if(res) {
			deferred.resolve(res);
		}
	});
	return deferred.promise;
}

function service_getDealer(){
	var deferred = Q.defer();
	schemaObj.userModel.find({refName: 'dealer'},{password: 0,email: 0,userType: 0,active: 0,createdBy: 0,creationTime: 0,modifiedTime: 0,modifiedDate: 0,modifiedBy: 0},function(err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} 
		if(res) {
			deferred.resolve(res);
		}
	});
	return deferred.promise;
}

function service_getAuthorDealer(loginUsr){
	var deferred = Q.defer();
	schemaObj.userModel.find({parentID: loginUsr.authorID, userType: 'dr'},{password: 0,email: 0,userType: 0,active: 0,createdBy: 0,creationTime: 0,modifiedTime: 0,modifiedDate: 0,modifiedBy: 0},function(err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} 
		if(res) {
			deferred.resolve(res);
		}
	});
	return deferred.promise;
}

module.exports = userService;