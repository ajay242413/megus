var Q = require('q');
var fs = require('fs');
var moment = require('moment');
var genericObj = require('./generic.service');
var schemaObj = require('./custom.schema');
var userService = require('./user.service');
var emailObj = require('./email.service');
var ObjectId = require('mongodb').ObjectID;

var hrService = {};

hrService.addEmployee = service_addEmployee;
hrService.getEmployee = service_getEmployee;
hrService.modifyEmployee = service_modifyEmployee;
hrService.deleteEmployee = service_deleteEmployee;
hrService.getCurrentEmployee = service_getCurrentEmployee;
hrService.editProfile = service_editProfile;
hrService.getProfile = service_getProfile;

module.exports = hrService;

function service_addEmployee(hrFiles,hrObj,loginUsr) {
	var deferred = Q.defer();
	var proofs = {};
	hrObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	hrObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	
	schemaObj.employeeModel.create(hrObj, function (err, employee) {
		if(err) {
			console.log("FAIL: Document save - employee");
			for(key in hrFiles){
				fs.unlink(hrFiles[key].path, (err) => {
					if(err) {
						throw err;
					}
					console.log(hrFiles[key].path+' was deleted');
				});
			}
			deferred.reject(err);
		}
		if(employee.name){
			var user = {'name': employee.name, 'email': employee.signupMail, authorID: loginUsr.authorID, parentID: loginUsr.authorID, 'refName': 'employee', 'refID': employee._id,'active': true, modifiedBy: loginUsr._id, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')};
			if(loginUsr.userType == 'b'){
				user.userType = 'b';
			} else if(loginUsr.userType == 'd'){
				user.userType = 'd';
			}
			userService.addUser(user)
			.then(function(usr) {
				console.log("DEBUG: Successfully added user record on userTable");
			})
			.catch(function(err) {
				console.log(err);
				deferred.reject(err);
			});
			if(hrFiles.length != 0){
				for(key in hrFiles){
					var nameSplit = hrFiles[key].originalname.split('.');
					fs.rename(hrFiles[key].path,'assets/upload_files/hr/' + employee._id  + '-' + hrFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1], function(err) {
						if(err) {
							console.log('hr proof move error:'+err);
						}
					});
					proofs[hrFiles[key].fieldname] = employee._id  + '-' + hrFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1];
				}
				schemaObj.employeeModel.findByIdAndUpdate(employee._id,{$set: {'files': proofs, modifiedBy: loginUsr._id, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}}, {new:true}, function(proofErr, pro) {
					if(proofErr) {
						console.log(proofErr);
						deferred.reject(proofErr);
					}
					if(pro) {
						deferred.resolve(employee);
					} else {
						deferred.resolve();
					}
				});
			} else {
				deferred.resolve(employee);
			}
			emailObj.activateUser(employee.signupMail);
		}
		else if(employee.signupMail){
			deferred.resolve(employee);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_modifyEmployee(hrFiles,hrObj){
	var deferred=Q.defer(), proofs={};
	hrObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	hrObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	schemaObj.employeeModel.findOneAndUpdate({_id:hrObj._id}, hrObj, {new:true}, function(err, employee) {
		if(err) {
			console.log(err);
			for(key in hrFiles){
				fs.unlink(hrFiles[key].path, (err) => {
					if (err) throw err;
					console.log(hrFiles[key].path+' was deleted');
				});
			}
			deferred.reject(err);
		}
		if(employee){
			if(hrObj.signupMail) {
				schemaObj.userModel.findOneAndUpdate({refID:employee._id}, {$set:{email:hrObj.signupMail, modifiedBy:hrObj.modifiedBy, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}}, {new:true}, function(err, ret_user) {
					if(err) {
						console.log(err);
					}
					if(ret_user){
						console.log("DEBUG: Successfully added user record on userTable");
					}
				});
			}
			if(hrFiles.length != 0){
				if(employee.files){
					if(employee.files[0]){
						proofs = employee.files[0];
					}
				}
				for(key in hrFiles){
					var nameSplit = hrFiles[key].originalname.split('.');
					fs.rename(hrFiles[key].path,'assets/upload_files/hr/' + hrObj._id  + '-' + hrFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1], function(err) {
						if(err) {
							console.log('hr proof move error:'+err);
						}
					});
					proofs[hrFiles[key].fieldname] = hrObj._id  + '-' + hrFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1];
				}
				schemaObj.employeeModel.findOneAndUpdate({_id: hrObj._id},{$set: {'files': proofs, modifiedBy: hrObj.modifiedBy, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}}, {new:true}, function (proofErr, pro) {
					if(proofErr) {
						console.log("FAIL: Document save:"+proofErr);
						deferred.reject(proofErr);
					}
					if(pro) {
						deferred.resolve(employee);
					} else {
						deferred.resolve();
					}
				});
			} else {
				deferred.resolve(employee);
			}
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getEmployee(empObj) {
	var deferred = Q.defer();
	empObj.name = {$exists: true};
	schemaObj.employeeModel.find(empObj, function(err, ret_empObj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_empObj) {
			deferred.resolve(ret_empObj);
		}
	});
	return deferred.promise;
}

function service_deleteEmployee(empObj,loginUsr){
	var deferred = Q.defer();
	schemaObj.employeeModel.findByIdAndUpdate(empObj, {$set: {'active': false, modifiedBy: loginUsr._id, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}}, {new:true}, function(err, ret_hr) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_hr) {
			schemaObj.userModel.findOneAndUpdate({refID: ret_hr._id}, {$set: {'active': false, modifiedBy: loginUsr._id, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}}, {new:true}, function(err1, ret_user) {
				if(err1) {
					console.log(err1);
				}
				if(ret_user) {
					console.log("DEBUG: Successfully added user record on userTable");
				}
			});
			deferred.resolve(ret_hr);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getCurrentEmployee(obj){
	var deferred = Q.defer();
	schemaObj.employeeModel.findById(obj._id,function(err, empObj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(empObj) {
			deferred.resolve(empObj);
		}
	});
	return deferred.promise;
}

function service_editProfile(profFiles, profObj, loginUsr){
	var deferred=Q.defer(), profData=JSON.parse(profObj.prof), proofs={};

	schemaObj.employeeModel.findOneAndUpdate({_id:profData._id}, profData, {new:true}, function(err, resObj) {
		if(err) {
			console.log('ERROR: Edit Profile:' + err);
			for(key in profFiles) {
				fs.unlink(profFiles[key].path, (err) => {
					if(err) throw err;
					console.log(profFiles[key].path+' was deleted');
				});
			}
			deferred.reject(err);
		}
		if(resObj) {
			if(profFiles.length != 0){
				for(key in profFiles){
					var nameSplit = profFiles[key].originalname.split('.');
					fs.rename(profFiles[key].path,'assets/upload_files/hr/' + resObj._id  + '-' + profFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1], function(err) {
						if(err) {
							console.log('hr proof move error:'+err);
						}
					});
					proofs[profFiles[key].fieldname] = resObj._id  + '-' + profFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1];
				}
				schemaObj.employeeModel.findByIdAndUpdate(resObj._id, {$set:{files:proofs, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}}, {new:true}, function(photoErr, photoRes) {
					if(photoErr) {
						console.log(photoErr);
						deferred.reject(photoErr);
					}
					if(photoRes) {
						deferred.resolve(photoRes);
					}
				});
			} else {
				deferred.resolve(resObj);
			}
		}
	});
	return deferred.promise;
}

function service_getProfile(loginUsr){
	var deferred=Q.defer();
	schemaObj.employeeModel.findOne({authorID:loginUsr.authorID, name:{$exists:false}}, {profile:1, files:1}, function(err, resObj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(resObj) {
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}