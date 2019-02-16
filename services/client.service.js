var Q = require('q');
var fs = require('fs');
var moment = require('moment');
var genericObj = require('./generic.service'); 
var schemaObj = require('./custom.schema');
var userService = require('./user.service');
var masterService = require('./master.service');
var HRService = require('./hr.service');
var emailObj = require('./email.service');
var ObjectId = require('mongodb').ObjectID;

var clientService = {};

clientService.addClient = service_addClient;
clientService.getClient = service_getClient;
clientService.getClientCode = service_getClientCode;
clientService.modifyClient = service_modifyClient;
clientService.deleteClient = service_deleteClient;
clientService.addDealer = service_addDealer;
clientService.modifyDealer = service_modifyDealer;
clientService.deleteDealer = service_deleteDealer;
clientService.getDealer = service_getDealer;
clientService.exportDealer = service_exportDealer;
clientService.exportClient = service_exportClient;
clientService.importDealer = service_importDealer;

//To remove after mob API is complete
clientService.getClientTemp = service_getClientTemp;
clientService.addClientPosition = service_addClientPosition;

module.exports = clientService;

function service_addClient(clientProof,clientObj) {
	var deferred = Q.defer();
	var proofs = {}, clientResObj = {}, userResObj = {}, ledgerResObj = {}, empResObj = {};
	
	clientObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	
	var clientClone = JSON.parse(JSON.stringify(clientObj));
	var clientPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.clientModel.create(clientObj, function (err, client) {
				if(err){
					for(key in clientProof) {
						fs.unlink(clientProof[key].path, (err) => {
							if(err) 
								throw err;
							console.log(clientProof[key].path+' was deleted');
						});
					}
					console.log(err);
					reject(err);
				}
				clientResObj = client;
				resolve(client);
			});
		});
	}
	var userPromise = function(ret_client) {
		var user = {email: ret_client.signupMail, parentID: ret_client.authorID, userType: 'd', active: true, refName: 'client', refID: ret_client._id, createdBy: ret_client.createdBy, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')};
		return Q.Promise(function(resolve, reject) {
			userService.addUser(user)
			.then(function(ret_user) {
				console.log("INFO: Successfully added user record");
				userResObj = ret_user;
				schemaObj.userModel.findOneAndUpdate({refID: ret_client._id}, {$set: {'authorID': ret_user._id, modifiedBy: ret_client.createdBy, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function(err1, ret_user1) {
					if(err1) {
						console.log(err1);
						reject(err1);
					}
					if(ret_user1){
						resolve({client: ret_client,user: ret_user});
					}
				});
			})
			.catch(function(err) {
				console.log(err);
		        reject(err);
			});		        
		})
	}
	var employeePromise = function(ret_usr) {
		var hrFiles = {}, hrObj = {};
		//set default option for distributor admin
		/*var defaultOption = {'view': true, 'new': true, 'edit': true, 'delete': true};
		hrObj.permission = {
		'master': {'client': defaultOption,'accounts': defaultOption,'generalMaster': defaultOption,'hr': defaultOption,'product': defaultOption,'supplier': defaultOption,'master': defaultOption},
		'inventory': {'purchaseAck': defaultOption,'purchaseOrder': defaultOption,'purchaseOrderManagement': defaultOption,'sales': defaultOption,'salesOrder': defaultOption,'salesOrderManagement': defaultOption,'stockRegister': defaultOption,'stockStatus': defaultOption,'stockTransfer': defaultOption,'inventory': defaultOption},
		'hr': {'employee': defaultOption,'expense': defaultOption,'hr': defaultOption},
		'accounts': {'accountStatement': defaultOption,'contra': defaultOption,'creditNote': defaultOption,'debitNote': defaultOption,'journal': defaultOption,'ledger': defaultOption,'paymentVoucher': defaultOption,'receiptVoucher': defaultOption,'accounts': defaultOption}
		};*/
		hrObj = {signupMail: ret_usr.user.email, authorID: ret_usr.user._id, modifiedBy: clientObj.createdBy};
		return Q.Promise(function(resolve, reject) {
			HRService.addEmployee(hrFiles, hrObj)
			.then(function(ret_emp) {
				console.log("INFO: Successfully added employee record");
				schemaObj.clientModel.findOneAndUpdate({_id: ret_usr.client._id},{employeeID: ret_emp._id, modifiedBy: ret_usr.user.createdBy, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}, function(err, res){
					if(err){
						console.log(err);
						reject(err);
					}
					if(res){
						console.log('INFO: Successfully updated employee ID to client');
					}
				});
				empResObj = ret_emp;
				resolve(ret_usr);
			})
			.catch(function(err) {
				console.log(err);
		        reject(err);
			});
		})
	}
	var masterPromise = function(ret_cliUsr) {
		return Q.Promise(function(resolve, reject) {
			var countryPromise = masterService.modifyCountry({active: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			var statePromise = masterService.modifyState({active: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			var districtPromise = masterService.modifyDistrict({active: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			var regionPromise = masterService.modifyRegion({active: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			var cityPromise = masterService.modifyCity({active: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			var finYearPromise = masterService.modifyFinancialYear({active: true, status: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			var attributePromise = masterService.modifyProductAttribute({active: true},ret_cliUsr.user._id,ret_cliUsr.user.createdBy,'push');
			/* dealerCategory is required for dealer. This function should be removed from addClient
				*var dealerCategoryPromise = masterService.modifyDealerCategory({active: true},ret_user._id,'push');
			*/
			Promise.all([countryPromise, statePromise, districtPromise, regionPromise, cityPromise, finYearPromise, attributePromise])
			.then(function(result) {
				console.log('INFO: Successfully created master entry for Country/State/District/Region/City/Fin_Year/Attribute');
				resolve(ret_cliUsr);
			})
			.catch(function(err){
				console.log(err);
				reject(err);
			});
		})
	}
	var ledgerPromise = function(ret_cliUsr) {
		return Q.Promise(function(resolve,reject){
			// schemaObj.ledgerModel.create({authorID: loginUser.authorID,ledgerGroup: clientClone.ledger, debit: 0, credit: 0, refType: 'client', refId: ret_cliUsr.client._id, finYear: clientClone.finYear, createdBy: loginUser._id,creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),active: true}, function(err, ret_ledger){
				schemaObj.ledgerModel.create({authorID: ret_cliUsr.client.authorID, ledgerGroup: clientClone.ledger, debit: 0, credit: 0, refType: 'client', refId: ret_cliUsr.client._id, finYear: clientClone.finYear, createdBy: clientClone.createdBy, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),active: true}, function(err, ret_ledger){
				if(err) {
					console.log(err);
					reject(err);
				}
				if(ret_ledger){
					ledgerResObj = ret_ledger;
					schemaObj.ledgerEntryModel.create({authorID: ret_cliUsr.client.authorID, active:true, ledgerId:ret_ledger._id, type:'o', credit:0, debit:0, finYear: clientClone.finYear, refDate:moment(new Date()).format('YYYY-MM-DD')}, function(err1, ret_ledger1){
						if(err1) {
							console.log(err1);
							reject(err1);		
						}
						if(ret_ledger1) {
							resolve(ret_cliUsr);
						}
					});
				}
			});
		});
	}
	var filePromise = function(ret_cliUsr) {
		return Q.Promise(function(resolve,reject) {
			if(clientProof.length != 0) {
				for(key in clientProof) {
					var nameSplit = clientProof[key].originalname.split('.');
					fs.rename(clientProof[key].path,'assets/upload_files/client/' + client._id  + '-' + clientProof[key].fieldname + '.' + nameSplit[nameSplit.length - 1], function(err){
						if(err) {
							console.log(err);
							console.log('Client proof move error: '+err);
						}
					});
					proofs[clientProof[key].fieldname] = ret_cliUsr.client._id  + '-' + clientProof[key].fieldname + '.' + nameSplit[nameSplit.length - 1];
				}
				schemaObj.clientModel.findOneAndUpdate({_id: ret_cliUsr.client._id},{'proofs': proofs,modifiedBy: ret_cliUsr.client.createdBy, modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(ret_cliUsr);
					}
				});
			} else {
				resolve(ret_cliUsr);
			}
		});
	}
	function removeClientData() {
		if(clientResObj._id) {
			schemaObj.clientModel.deleteOne({_id: ObjectId(clientResObj._id)},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
		}
		if(ledgerResObj._id){
			schemaObj.ledgerModel.deleteOne({_id: ObjectId(ledgerResObj._id)},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.ledgerEntryModel.deleteOne({refID: ObjectId(ledgerResObj._id)},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
		}
		if(empResObj._id) {
			schemaObj.employeeModel.deleteOne({_id: ObjectId(empResObj._id)}, function(er,re) {
				if(re) {
					console.log(re);
				}
			});
		}
		if(userResObj._id) {
			schemaObj.userModel.deleteOne({_id: ObjectId(userResObj._id)},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.masterCountryModel.update({authorID: {$in: [userResObj._id]}},{$pull: {authorID: userResObj._id}},{multi: true},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.masterStateModel.update({authorID: {$in: [userResObj._id]}},{$pull: {authorID: userResObj._id}},{multi: true},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.masterDistrictModel.update({authorID: {$in: [userResObj._id]}},{$pull: {authorID: userResObj._id}},{multi: true},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.masterRegionModel.update({authorID: {$in: [userResObj._id]}},{$pull: {authorID: userResObj._id}},{multi: true},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.masterCityModel.update({authorID: {$in: [userResObj._id]}},{$pull: {authorID: userResObj._id}},{multi: true},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
			schemaObj.masterFinYearModel.update({authorID: {$in: [userResObj._id]}},{$pull: {authorID: userResObj._id}},{multi: true},function(er,re) {
				if(re) {
					console.log(re);
				}
			});
		}
	}
	
	clientPromise().then(function(retClientObj) {
		return userPromise(retClientObj);
	}).then(function(ret_userObj) {
		return employeePromise(ret_userObj); //returns user object, so this can be used to update authorID while creating master for the client user
	}).then(function(emp_usr) {
		return masterPromise(emp_usr);
	}).then(function(ret_client_user_obj) {
		return ledgerPromise(ret_client_user_obj);
	}).then(function(ret_client_user_obj) {
		return filePromise(ret_client_user_obj);
	})
	.then(function(data) {
		emailObj.activateUser(data.client.signupMail); //this can be mofidied to promise response
		deferred.resolve(data);
	})
	.catch(function(err) {
		console.log(err);
		removeClientData(); //this can be converted to promise
		deferred.reject(err);
	});
	
	return deferred.promise;
}

function service_getClient(loginUsr) {
	var deferred = Q.defer();
	var condition = {authorID:loginUsr.authorID, active:loginUsr.active};
	if(loginUsr.userType == 'b'){
		schemaObj.clientModel.find(condition,function (err, ret_ClientInd) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(ret_ClientInd) {
				deferred.resolve(ret_ClientInd);
			}
			else
				deferred.resolve();
		});
	} else if(loginUsr.userType == 'd'){
		schemaObj.dealerModel.find(condition,function (err, ret_ClientInd) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(ret_ClientInd) {
				deferred.resolve(ret_ClientInd);
			}
			else
				deferred.resolve();
		});
	}
	return deferred.promise;
}

function service_getClientTemp() {
	var deferred = Q.defer();
	schemaObj.dealerModel.find({active: true},function (err, ret_ClientInd) {
		if(err) {
			console.log("FAIL: Read client");
			deferred.reject(err.name + ': ' + err.message);
		}
		if(ret_ClientInd) {
			deferred.resolve(ret_ClientInd);
		}
		else
			deferred.resolve();
	});

	return deferred.promise;
}

function service_getClientCode(loginUsr){
	var deferred = Q.defer();
	if(loginUsr.userType == 'b'){
		schemaObj.clientModel.find({authorID: loginUsr.authorID, active: loginUsr.active}).sort({$natural:-1}).limit(1).exec(function(err, result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result){
				var code = 100001;
				if(result.length){
					code = parseInt(result[0].code) + 1;
				}
				deferred.resolve({'code': code});
			}
		});
	} else{
		schemaObj.dealerModel.find({authorID: loginUsr.authorID, active: loginUsr.active}).sort({$natural:-1}).limit(1).exec(function(err, result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				var code = 100001;
				if(result.length){
					code = parseInt(result[0].code) + 1;
				}
				deferred.resolve({'code': code});
			}
		});
	}
	return deferred.promise;
}

function service_modifyClient(clientProof,clientObj) {
	var deferred = Q.defer();
	
	clientObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	clientObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.clientModel.findByIdAndUpdate(clientObj._id, {$set: clientObj}, {new : true}, function (err, client) {
		if(err) {
			console.log(err);
			for(key in clientProof){
				fs.unlink(clientProof[key].path, (err) => {
					if (err) throw err;
					console.log(clientProof[key].path+' was deleted');
				});
			}
			deferred.reject(err);
		}
		if(client) {
			schemaObj.userModel.update({refID: client._id}, {$set: {'name': client.name, 'email': client.signupMail, modifiedBy: client.modifiedBy, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function(err, ret_user) {
				if(err) {
					console.log(err);
				}
				if(ret_user) {
					console.log("DEBUG: Successfully added user record on userTable");
				}
			});
			var proofs = {};
			if(clientProof.length != 0){
				if(client.proofs[0])
					proofs = client.proofs[0];
				for(key in clientProof){
					var nameSplit = clientProof[key].originalname.split('.');
					fs.rename(clientProof[key].path,'assets/upload_files/client/' + clientObj._id  + '-' + clientProof[key].fieldname + '.' + nameSplit[nameSplit.length - 1], function(err){
						if(err){
							console.log(err);
						}
					});
					proofs[clientProof[key].fieldname] = clientObj._id  + '-' + clientProof[key].fieldname + '.' + nameSplit[nameSplit.length - 1];
				}
				schemaObj.clientModel.findByIdAndUpdate({_id: clientObj._id},{$set: {'proofs': proofs,modifiedBy: clientObj.modifiedBy,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function (proofErr,pro) {
					if(proofErr) {
						console.log(proofErr);
						deferred.reject(proofErr.name + ': ' + proofErr.message);
					}
					if(pro) {
						deferred.resolve(pro);
					}else {
						deferred.resolve();
					}
				});
			}else {
				deferred.resolve(client);
			}
		}
		else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_deleteClient(clientObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.clientModel.findByIdAndUpdate(clientObj, {$set: {active: false,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function (err, ret_client) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_client) {
			schemaObj.userModel.update({refID: ret_client._id}, {$set: {active: false,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function(err1, ret_user) {
				if(err1) {
					console.log(err1);
				}
				if(ret_user) {
					schemaObj.userModel.update({authorID: ret_user._id}, {$set: {active: false,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, { multi: true }, function(err2, ret_user2) {
						if(err2) {
							console.log(err2);
						}
						if(ret_user2) {
							console.log("DEBUG: Successfully added user record on userTable");
						}
					});
				}
			});
			deferred.resolve(ret_client);
		}
		else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_addDealer(dealerObj,loginUsr) {
	var deferred = Q.defer();
	dealerObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	
	var dealerClone = JSON.parse(JSON.stringify(dealerObj));
	schemaObj.dealerModel.create(dealerObj, function(dealerErr, dealerRes) {
		if(dealerErr) {
			console.log(dealerErr);
			deferred.reject(dealerErr);
		}
		if(dealerRes) {
			deferred.resolve(dealerRes);
			var user = {name: dealerRes.name, email: dealerRes.signupMail, parentID: dealerClone.authorID, refName: 'dealer', refID: dealerRes._id, createdBy: dealerClone.createdBy, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')};
			if(loginUsr.userType == 'b'){
				user.userType = 'd';
				user.active = true;
			} else if(loginUsr.userType == 'd'){
				user.userType = 'dr';
				user.active = false;
			}
			schemaObj.userModel.create(user, function(usererr, ret_user) {
				if(usererr) {
					console.log(usererr);
				}
				if(ret_user) {
					schemaObj.userModel.findOneAndUpdate({refID: dealerRes._id}, {$set: {'authorID': ret_user._id},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, function(err1, ret_user1) {
						if(err1) {
							console.log(err1);
						}
						if(ret_user1) {
							console.log("DEBUG: Successfully added user record on userTable");
						}
					});
				}
			});
			schemaObj.ledgerModel.create({authorID: loginUsr.authorID,ledgerGroup: dealerClone.ledger,address: dealerRes._id,gstin: dealerRes._id,debit: 0,credit: 0,panID: dealerRes._id,refType: 'dealer',refId: dealerRes._id,finYear: dealerClone.finYear,createdBy: loginUsr._id,creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),active: true}, function (err1, ret_ledger1) {
				if(err1) {
					console.log(err1);		
				}
				if(ret_ledger1) {
					schemaObj.ledgerEntryModel.create({authorID: loginUsr.authorID, active:true, type:'o', ledgerId:ret_ledger1._id, credit:0, debit:0, finYear:dealerClone.finYear, refDate:moment(new Date()).format('YYYY-MM-DD')}, function(err2, ret_ledger2) {
						if(err2) {
							console.log(err);		
						}
						if(ret_ledger2) {
							console.log('client ledger created');
						}
					});
				}
			});
		}
		else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getDealer(obj) {
	var deferred = Q.defer();
	schemaObj.dealerModel.find(obj,function (err, ret_dealer) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_dealer) {
			deferred.resolve(ret_dealer);
		}
	});
	return deferred.promise;
}

function service_modifyDealer(dealerObj){
	var deferred=Q.defer();
	dealerObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	dealerObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.dealerModel.findByIdAndUpdate(dealerObj._id, {$set:dealerObj}, {new:true}, function(err, dealer) {
		if(err){
			console.log(err);
			deferred.reject(err);
		}
		if(dealer){
			schemaObj.userModel.findOneAndUpdate({refID:dealer._id}, {$set:{email:dealer.signupMail, modifiedBy:dealerObj.modifiedBy, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}}, function(err1, ret_user) {
				if(err1) {
					console.log(err1);
				}
				if(ret_user){
					deferred.resolve(dealer);
				}
			});
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_deleteDealer(dealerObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.dealerModel.findByIdAndUpdate(dealerObj, {$set: {active: false,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function (err, ret_dealer) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_dealer) {
			deferred.resolve(ret_dealer);
		}
	});
	return deferred.promise;
}

function service_addClientPosition(reqObj) {
	var deferred = Q.defer();
	if(reqObj._id) {
		schemaObj.dealerModel.findOneAndUpdate({_id:reqObj._id}, {latitude: reqObj.lat, longitude: reqObj.lng, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm:ss')}, function (err, ret_obj) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(ret_obj) {
				deferred.resolve({msg: 'success'});
			} else {
				deferred.resolve({msg: 'failed'});
			}
		});
	} else {
		deferred.resolve({msg: 'failed'});
	}
	return deferred.promise;
}

function service_exportDealer(){
	var deferred = Q.defer();
	schemaObj.dealerModel.find({active: true}, function (err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			var dealerObj = [];
			for(var i=0; i<ret_obj.length; i++){
				dealerObj.push({
					'S.No.': i + 1,
					'Name': ret_obj[i]['name'],
					'GSTIN': '',
					'Address': '',
					'Pincode': '',
					'District': '',
					'State': ret_obj[i]['state']['name'],
					'Owner Name': '',
					'Owner Phone Number': '',
					'Owner Email': '',
					'Finance Name 1': '',
					'Finance Name 2': '',
					'Banck Account Name': '',
					'Banck Account Number': '',
					'Banck IFSC Code': '',
				});
				if(ret_obj[i]['gstin']){
					dealerObj[i]['GSTIN'] = ret_obj[i]['gstin'];
				}
				if(ret_obj[i]['address']){
					dealerObj[i]['Address'] = ret_obj[i]['address'];
				}
				if(ret_obj[i]['pincode']){
					dealerObj[i]['Pincode'] = ret_obj[i]['pincode'];
				}
				if(ret_obj[i]['district']){
					dealerObj[i]['District'] = ret_obj[i]['district']['name'];
				}
				if(ret_obj[i]['owner']){
					if(ret_obj[i]['owner']['name']){
						dealerObj[i]['Owner Name'] = ret_obj[i]['owner']['name'];
					}
					if(ret_obj[i]['owner']['phone']){
						dealerObj[i]['Owner Phone Number'] = ret_obj[i]['owner']['phone'];
					}
					if(ret_obj[i]['owner']['email']){
						dealerObj[i]['Owner Email'] = ret_obj[i]['owner']['email'];
					}
				}
				if(ret_obj[i]['finance1']){
					dealerObj[i]['Finance Name 1'] = ret_obj[i]['finance1'];
				}
				if(ret_obj[i]['finance2']){
					dealerObj[i]['Finance Name 2'] = ret_obj[i]['finance2'];
				}
				if(ret_obj[i]['bank']){
					if(ret_obj[i]['bank']['accountName']){
						dealerObj[i]['Bank Account Name'] = ret_obj[i]['bank']['accountName'];
					}
					if(ret_obj[i]['bank']['accountNumber']){
						dealerObj[i]['Bank Account Number'] = ret_obj[i]['bank']['accountNumber'];
					}
					if(ret_obj[i]['bank']['ifsc']){
						dealerObj[i]['Bank IFSC Code'] = ret_obj[i]['bank']['ifsc'];
					}
				}
			}
			deferred.resolve(dealerObj);
		}
	});
	return deferred.promise;
}

function service_exportClient(){
	var deferred = Q.defer();
	schemaObj.clientModel.find({active: true}, function (err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			var clientObj = [];
			for(var i=0; i<ret_obj.length; i++){
				clientObj.push({
					'S.No.': i + 1,
					'Name': ret_obj[i]['name'],
					'GSTIN': ret_obj[i]['gstin'],
					'Registered Address': ret_obj[i]['registerAddress']['address'],
					'Registered Pincode': ret_obj[i]['registerAddress']['pincode'],
					'Registered State': ret_obj[i]['registerAddress']['state']['name'],
					'Owner Name': ret_obj[i]['firm'][0]['name'],
					'Owner Phone Number': ret_obj[i]['firm'][0]['phone'],
					'Owner Email': ret_obj[i]['firm'][0]['mail'],
					'Registered Phone Number': ret_obj[i]['registerAddress']['phoneno'],
					'Registered Email': ret_obj[i]['registerAddress']['mail'],
					'Distribution State': '',
					'Distribution District': '',
					'Banck Account Name': '',
					'Banck Account Number': '',
					'Banck IFSC Code': '',
				});
				if(ret_obj[i]['areaDistribution']){
					if(ret_obj[i]['areaDistribution']['state']){
						clientObj[i]['Distribution State'] = ret_obj[i]['areaDistribution']['state']['name'];
					}
					if(ret_obj[i]['areaDistribution']['district']){
						clientObj[i]['Distribution District'] = ret_obj[i]['areaDistribution']['district']['name'];
					}
				}
				if(ret_obj[i]['bankDetails']){
					if(ret_obj[i]['bankDetails']['accountName']){
						clientObj[i]['Bank Account Name'] = ret_obj[i]['bankDetails']['accountName'];
					}
					if(ret_obj[i]['bankDetails']['accountNumber']){
						clientObj[i]['Bank Account Number'] = ret_obj[i]['bankDetails']['accountNumber'];
					}
					if(ret_obj[i]['bankDetails']['ifsc']){
						clientObj[i]['Bank IFSC Code'] = ret_obj[i]['bankDetails']['ifsc'];
					}
				}
			}
			deferred.resolve(clientObj);
		}
	});
	return deferred.promise;
}

function service_importDealer(obj, loginUsr) {
	var deferred = Q.defer();
	var dealersClone = JSON.parse(JSON.stringify(obj.dealer));
	var dealerPromise = function(dealerObj) {
		dealerObj['authorID'] = loginUsr.authorID;
		dealerObj['active'] = true;
		dealerObj['creationTime'] = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
		return Q.Promise(function(resolve,reject) {
			schemaObj.dealerModel.create(dealerObj, function(dealerErr, dealerRes) {
				if(dealerErr) {
					console.log(dealerErr);
					reject(dealerErr);
				}
				if(dealerRes) {
					var user = {
						name: dealerRes.name,
						parentID: loginUsr.authorID,
						refName: 'dealer',
						refID: dealerRes._id,
						userType: 'dr',
						active: true,
						createdBy: loginUsr._id,
						creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')
					};
					schemaObj.userModel.create(user, function(usererr, ret_user) {
						if(usererr) {
							console.log(usererr);
						}
						if(ret_user) {
							schemaObj.userModel.findOneAndUpdate({refID: dealerRes._id}, {$set: {'authorID': ret_user._id},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, function(err1, ret_user1) {
								if(err1) {
									console.log(err1);
								}
								if(ret_user1) {
									console.log("DEBUG: Successfully added user record on userTable");
								}
							});
						}
					});
					schemaObj.ledgerModel.create({authorID: loginUsr.authorID,ledgerGroup: obj.account.ledger,address: dealerRes._id,debit: 0,credit: 0,refType: 'dealer',refId: dealerRes._id,finYear: obj.account.finYear,createdBy: loginUsr._id,creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),active: true}, function (err1, ret_ledger1) {
						if(err1) {
							console.log(err1);
							reject(err1);	
						}
						if(ret_ledger1) {
							schemaObj.ledgerEntryModel.create({authorID: loginUsr.authorID, active:true, type:'o', ledgerId:ret_ledger1._id, credit:0, debit:0, finYear:obj.account.finYear, refDate:moment(new Date()).format('YYYY-MM-DD')}, function(err2, ret_ledger2) {
								if(err2) {
									console.log(err2);
									reject(err2);	
								}
								if(ret_ledger2) {
									console.log('client ledger created');
									resolve(dealerObj);
								}
							});
						}
					});
				}
			});
		});
	}
	Promise.all(dealersClone.map(dealerPromise)).then(function() {
		deferred.resolve({msg: 'Success'});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}