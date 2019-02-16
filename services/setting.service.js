var Q = require('q');
var fs = require('fs');
var moment = require('moment');
var schemaObj = require('./custom.schema');
var userService = require('./user.service');

var settingService = {};

settingService.getBrandCompanyProfile = service_getBrandCompanyProfile;
settingService.editSetting = service_editSetting;
settingService.getSetting = service_getSetting;

module.exports = settingService;

function service_getBrandCompanyProfile(loginUsr) {
	var deferred = Q.defer();
	userService.loginAuthorRefID(loginUsr)
	.then(function(ret_user) {
		var brandAuthor = ret_user;
		schemaObj.settingModel.find({authorID: brandAuthor.refID.authorID}, {company: 1}, function (err, ret_obj) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(ret_obj) {
				deferred.resolve(ret_obj);
			}
			else
				deferred.resolve();
		});
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_editSetting(setFiles, setObj) {
	var deferred=Q.defer(), proofs={};
    setObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	setObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	schemaObj.settingModel.findOneAndUpdate({authorID: setObj.authorID}, setObj, {upsert:true, new:true}, function(err, res_obj) {
		if(err) {
			for(key in setFiles) {
				fs.unlink(setFiles[key].path, (err) => {
					if(err) throw err;
					console.log(setFiles[key].path+' was deleted');
				});
			}
			console.log(err);
			deferred.reject(err);
		}
		if(res_obj) {
			if(setFiles.length != 0){
				for(key in setFiles){
					var nameSplit = setFiles[key].originalname.split('.');
					fs.rename(setFiles[key].path,'assets/upload_files/logo/' + res_obj._id  + '-' + setFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1], function(err) {
						if(err) {
							console.log('logo photo move error:'+err);
						}
					});
					proofs[setFiles[key].fieldname] = res_obj._id  + '-' + setFiles[key].fieldname + '.' + nameSplit[nameSplit.length - 1];
				}
				schemaObj.settingModel.findByIdAndUpdate(res_obj._id, {$set:{'company.logo':proofs.logo}}, {new:true}, function(logoErr, logoRes) {
					if(logoErr) {
						console.log("ERROR: Update Profile Photo " + logoErr);
						deferred.reject(logoErr);
					}
					if(logoRes) {
						deferred.resolve(logoRes);
					}
				});
			} else {
				deferred.resolve(res_obj);
			}
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getSetting(setObj) {
	var deferred = Q.defer();
	schemaObj.settingModel.find({authorID: setObj.authorID}, function(err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
		else
			deferred.resolve();
	});
	return deferred.promise;
}