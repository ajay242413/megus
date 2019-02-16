var Q = require('q');
var moment = require('moment');
var schemaObj = require('./custom.schema');
var userService = require('./user.service');
var clientService = require('./client.service');

var masterService = {};

masterService.addState = service_addState;
masterService.modifyState = service_modifyState;
masterService.getState = service_getState;
masterService.deleteState = service_deleteState;
masterService.addRegion = service_addRegion;
masterService.modifyRegion = service_modifyRegion;
masterService.getRegion = service_getRegion;
masterService.deleteRegion = service_deleteRegion;
masterService.addZone = service_addZone;
masterService.getZone = service_getZone;
masterService.modifyZone = service_modifyZone;
masterService.deleteZone = service_deleteZone;
masterService.addDistrict = service_addDistrict;
masterService.modifyDistrict = service_modifyDistrict;
masterService.getDistrict = service_getDistrict;
masterService.deleteDistrict = service_deleteDistrict;
masterService.addArea = service_addArea;
masterService.modifyArea = service_modifyArea;
masterService.getArea = service_getArea;
masterService.getAreas = service_getAreas;
masterService.deleteArea = service_deleteArea;
masterService.addCountry = service_addCountry;
masterService.getCountry = service_getCountry;
masterService.modifyCountry = service_modifyCountry;
masterService.deleteCountry = service_deleteCountry;
masterService.addCity = service_addCity;
masterService.modifyCity = service_modifyCity;
masterService.getCity = service_getCity;
masterService.deleteCity = service_deleteCity;
masterService.addUnit = service_addUnit;
masterService.modifyUnit = service_modifyUnit;
masterService.getUnit = service_getUnit;
masterService.deleteUnit = service_deleteUnit;
masterService.addSalePoint = service_addSalePoint;
masterService.modifySalePoint = service_modifySalePoint;
masterService.getSalePoint = service_getSalePoint;
masterService.deleteSalePoint = service_deleteSalePoint;
masterService.addClientDepartment = service_addClientDepartment;
masterService.modifyClientDepartment = service_modifyClientDepartment;
masterService.getClientDepartment = service_getClientDepartment;
masterService.deleteClientDepartment = service_deleteClientDepartment;
masterService.addClientDesignation = service_addClientDesignation;
masterService.modifyClientDesignation = service_modifyClientDesignation;
masterService.getClientDesignation = service_getClientDesignation;
masterService.deleteClientDesignation = service_deleteClientDesignation;
masterService.addDealerCategory = service_addDealerCategory;
masterService.modifyDealerCategory = service_modifyDealerCategory;
masterService.getDealerCategory = service_getDealerCategory;
masterService.deleteDealerCategory = service_deleteDealerCategory;
masterService.addProductType = service_addProductType;
masterService.getProductType = service_getProductType;
masterService.modifyProductType = service_modifyProductType;
masterService.deleteProductType = service_deleteProductType;
masterService.addProductName = service_addProductName;
masterService.getProductName = service_getProductName;
masterService.modifyProductName = service_modifyProductName;
masterService.deleteProductName = service_deleteProductName;
masterService.addProductBrand = service_addProductBrand;
masterService.getProductBrand = service_getProductBrand;
masterService.modifyProductBrand = service_modifyProductBrand;
masterService.deleteProductBrand = service_deleteProductBrand;
masterService.getProductItemCode = service_getProductItemCode;
masterService.addProductItem = service_addProductItem;
masterService.getProductItem = service_getProductItem;
masterService.modifyProductItem = service_modifyProductItem;
masterService.deleteProductItem = service_deleteProductItem;
masterService.identifyProductItem = service_identifyProductItem;
masterService.addSupplierCategory = service_addSupplierCategory;
masterService.getSupplierCategory = service_getSupplierCategory;
masterService.modifySupplierCategory = service_modifySupplierCategory;
masterService.deleteSupplierCategory = service_deleteSupplierCategory;
masterService.addSupplier = service_addSupplier;
masterService.getSupplier = service_getSupplier;
masterService.getSupplierCode = service_getSupplierCode;
masterService.modifySupplier = service_modifySupplier;
masterService.deleteSupplier = service_deleteSupplier;
masterService.addEmpDepartment = service_addEmpDepartment;
masterService.modifyEmpDepartment = service_modifyEmpDepartment;
masterService.getEmpDepartment = service_getEmpDepartment;
masterService.deleteEmpDepartment = service_deleteEmpDepartment;
masterService.addEmpDesignation = service_addEmpDesignation;
masterService.modifyEmpDesignation = service_modifyEmpDesignation;
masterService.getEmpDesignation = service_getEmpDesignation;
masterService.deleteEmpDesignation = service_deleteEmpDesignation;
masterService.addEmpHierarchy = service_addEmpHierarchy;
masterService.modifyEmpHierarchy = service_modifyEmpHierarchy;
masterService.getEmpHierarchy = service_getEmpHierarchy;
masterService.deleteEmpHierarchy = service_deleteEmpHierarchy;
masterService.addFinancialYear = service_addFinancialYear;
masterService.getFinancialYear = service_getFinancialYear;
masterService.modifyFinancialYear = service_modifyFinancialYear;
masterService.deleteFinancialYear = service_deleteFinancialYear;
masterService.addLedgerGroup = service_addLedgerGroup;
masterService.getLedgerGroup = service_getLedgerGroup;
masterService.modifyLedgerGroup = service_modifyLedgerGroup;
masterService.deleteLedgerGroup = service_deleteLedgerGroup;
masterService.addVisitType = service_addVisitType;
masterService.getVisitType = service_getVisitType;
masterService.modifyVisitType = service_modifyVisitType;
masterService.deleteVisitType = service_deleteVisitType;
masterService.addProductAttribute = service_addProductAttribute;
masterService.getProductAttribute = service_getProductAttribute;
masterService.modifyProductAttribute = service_modifyProductAttribute;
masterService.deleteProductAttribute = service_deleteProductAttribute;

module.exports = masterService;

var getUsersByRefnamePromise = new Promise(function(resolve,reject) {
	userService.getUsersByRefname({refName : "client", active: true})
	.then(function(ret_usr) {
		if(ret_usr) {
			console.log('INFO: Succesfully read users by {"refName" : "client"}');
			resolve(ret_usr);
		} else {
			console.log('ERROR: Succesfully read users by {"refName" : "client"} - empty');
			resolve();
		}
	})
	.catch(function(err) {
		console.log(err.name + ':' + err.message);
		reject(err);
	});
});

function service_addState(stateObj) {
	var deferred = Q.defer();
	stateObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	stateObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	var addStatePromise = new Promise(function(resolve,reject) {
		schemaObj.masterStateModel.create(stateObj, function(err,state) {
			if(err) {			
				console.log(err);
				reject(err);
			}
			if(state) {
				console.log('INFO: Succesfully added master state - ' + state.authorID);
				resolve(state);
			}
		});
	});

	Promise.all([addStatePromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyState(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(stateObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});		
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}	

function service_modifyState(stateObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		stateObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		stateObj.modifiedTime = moment(new Date()).format('HH:mm');
		schemaObj.masterStateModel.findByIdAndUpdate(stateObj._id, {$set: stateObj}, {new : true}, function(err, state) {
			if(err) {
				deferred.reject(err);
			}
			if(state) {			
				deferred.resolve(state);
			}
		});
	} else if(type === 'push') {
		//stateObj from service_addState has all the returned data of state. Future we can change the search query to be better.  
		//createClient send the stateObj query as {active: true} //no change required to this
		schemaObj.masterStateModel.update(stateObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err, state) {	
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(state) {			
				deferred.resolve(state);
			}
		});
	}
	return deferred.promise;
}

function service_getState(stateObj) {
	var deferred = Q.defer();
	schemaObj.masterStateModel.find(stateObj, function(err, state) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(state) {
			deferred.resolve(state);
		}
	});
	return deferred.promise;
}

function service_deleteState(stateObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterStateModel.update(stateObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err, state) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(state) {
			deferred.resolve(state);
		}
	});
	return deferred.promise;
}

function service_addRegion(regObj) {
	var deferred = Q.defer();
	regObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	regObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	
	var addRegionPromise = new Promise(function(resolve, reject) {
		schemaObj.masterRegionModel.create(regObj, function(err,region) {
			if(err) {
				console.log(err);
				reject(err);
			}
			if(region) {
				console.log('INFO: Succesfully added master region - ' + region.authorID);
				resolve(region);
			}
		});
	});

	Promise.all([addRegionPromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyRegion(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(regionObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});		
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err)
	});
	return deferred.promise;
}

function service_modifyRegion(regObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		regObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		regObj.modifiedTime = moment(new Date()).format('HH:mm');
		schemaObj.masterRegionModel.findByIdAndUpdate(regObj._id, {$set: regObj}, {new : true}, function(err, region) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(region) {
				deferred.resolve(region);
			}
		});
	} else if(type === 'push') {
		schemaObj.masterRegionModel.update(regObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err, region) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(region) {			
				deferred.resolve(region);
			}
		});
	}
	return deferred.promise;
}

function service_getRegion(regObj) {
	var deferred = Q.defer();
	schemaObj.masterRegionModel.find(regObj, function(err, region) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(region) {
			deferred.resolve(region);
		}
	});
	return deferred.promise;
}

function service_deleteRegion(regionObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterRegionModel.update(regionObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err, region) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(region) {
			deferred.resolve(region);
		}
	});
	return deferred.promise;
}

function service_addZone(zoneObj) {
	var deferred = Q.defer();
	zoneObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	zoneObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	schemaObj.masterZoneModel.create(zoneObj, function(err, zone) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(zone) {
			deferred.resolve(zone);
		}
	});
	return deferred.promise;
}

function service_modifyZone(zoneObj) {
	var deferred = Q.defer();
	zoneObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	zoneObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterZoneModel.findByIdAndUpdate(zoneObj._id, {$set: zoneObj}, {new : true}, function(err, zone) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(zone) {
			deferred.resolve(zone);
		}
	});
	return deferred.promise;
}

function service_getZone(zoneObj) {
	var deferred = Q.defer();
	schemaObj.masterZoneModel.find(zoneObj, function(err, zone) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(zone) {
			deferred.resolve(zone);
		}
	});
	return deferred.promise;
}

function service_deleteZone(zoneObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterZoneModel.update(zoneObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err, zone) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(zone) {
			deferred.resolve(zone);
		}
	});
	return deferred.promise;
}

function service_addDistrict(distObj) {
	var deferred = Q.defer();
	distObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	distObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	
	var addDistrictPromise = new Promise(function(resolve,reject) {
		schemaObj.masterDistrictModel.create(distObj, function(err,district) {
			if(err) {
				console.log(err);
				reject(err);
			}
			if(district) {
				console.log('INFO: Succesfully added master district - ' + district.authorID);
				resolve(district);
			}
		});
	});

	Promise.all([addDistrictPromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyDistrict(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(distObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});		
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err)
	});
	return deferred.promise;
}

function service_modifyDistrict(distObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		distObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		distObj.modifiedTime = moment(new Date()).format('HH:mm');
		schemaObj.masterDistrictModel.findByIdAndUpdate(distObj._id, {$set: distObj}, {new : true}, function(err, district) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(district) {
				deferred.resolve(district);
			}
		});
	} else if(type === 'push') {
		schemaObj.masterDistrictModel.update(distObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr, modifiedDate: moment(new Date()).format('YYYY-MM-DD'), modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err,district) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(district) {			
				deferred.resolve(district);
			}
		});
	}	
	return deferred.promise;
}

function service_getDistrict(distObj) {
	var deferred = Q.defer();
	schemaObj.masterDistrictModel.find(distObj, function(err, district) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(district) {
			deferred.resolve(district);
		}
	});
	return deferred.promise;
}

function service_deleteDistrict(districtObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterDistrictModel.update(districtObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err, district) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(district) {
			deferred.resolve(district);
		}
	});
	return deferred.promise;
}

function service_addArea(areaObj) {
	var deferred = Q.defer();
	areaObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	areaObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	schemaObj.masterAreaModel.create(areaObj, function(err, area) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(area) {
			deferred.resolve(area);
		}
	});
	return deferred.promise;
}

function service_modifyArea(areaObj) {
	var deferred = Q.defer();
	areaObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	areaObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterAreaModel.findByIdAndUpdate(areaObj._id, {$set: areaObj}, {new : true}, function(err, area) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(area) {
			deferred.resolve(area);
		}
	});
	return deferred.promise;
}

function service_getArea(areaObj) {
	var deferred = Q.defer();
	schemaObj.masterAreaModel.find(areaObj, function(err, area) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(area) {
			deferred.resolve(area);
		}
	});
	return deferred.promise;
}

function service_getAreas(areaObj) {
	var deferred = Q.defer();
	schemaObj.masterAreaModel.find(areaObj, function(err, area) {
		if(err) {
			deferred.reject(err);
		}
		if(area) {
			deferred.resolve(area);
		}
	});
	return deferred.promise;
}

function service_deleteArea(areaObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterAreaModel.update(areaObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err, area) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(area) {
			deferred.resolve(area);
		}
	});
	return deferred.promise;
}

function service_addCountry(counObj) {
	var deferred = Q.defer();
	counObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	counObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	var addCountryPromise = new Promise(function(resolve,reject) {
		schemaObj.masterCountryModel.create(counObj, function (err,country) {
			if(err) {
				console.log(err);
				reject(err);
			}
			if(country) {
				console.log('INFO: Succesfully added master country - ' + country.authorID);
				resolve(country);
			}
		});
	});
	
	Promise.all([addCountryPromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyCountry(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(countryObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err)
	});
	return deferred.promise;
}

function service_modifyCountry(counObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		counObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		counObj.modifiedTime = moment(new Date()).format('HH:mm');
		schemaObj.masterCountryModel.findByIdAndUpdate(counObj._id, {$set: counObj}, {new : true}, function (err,country) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(country) {
				deferred.resolve(country);
			}
		});
	} else if(type === 'push') {
		schemaObj.masterCountryModel.update(counObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err,country) {	
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(country) {
				deferred.resolve(country);
			}
		});
	}
	return deferred.promise;
}

function service_getCountry(counObj) {
	var deferred = Q.defer();
	schemaObj.masterCountryModel.find(counObj, function (err, country) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(country) {
			deferred.resolve(country);
		}
	});
	return deferred.promise;
}

function service_deleteCountry(countryObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterCountryModel.update(countryObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, country) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(country) {
			deferred.resolve(country);
		}
	});
	return deferred.promise;
}

function service_addCity(citObj) {
	var deferred = Q.defer();
	citObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	citObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	var addCityPromise = new Promise(function(resolve,reject) {
		schemaObj.masterCityModel.create(citObj, function (err,city) {
			if(err) {
				console.log(err);
				reject(err);
			}
			if(city) {
				console.log('INFO: Succesfully added master city - ' + city.authorID);
				resolve(city);
			}
		});
	});
	
	Promise.all([addCityPromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyCity(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(cityObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});		
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err)
	});
	return deferred.promise;
}

function service_modifyCity(citObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		citObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		citObj.modifiedTime = moment(new Date()).format('HH:mm');
		schemaObj.masterCityModel.findByIdAndUpdate(citObj._id, {$set: citObj}, {new : true}, function (err,city) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(city) {
				deferred.resolve(city);
			}
		});
	} else if(type === 'push') {
		schemaObj.masterCityModel.update(citObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err,city) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(city) {			
				deferred.resolve(city);
			}
		});
	}	
	return deferred.promise;
}

function service_getCity(citObj) {
	var deferred = Q.defer();
	schemaObj.masterCityModel.find(citObj, function (err, city) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(city) {
			deferred.resolve(city);
		}
	});
	return deferred.promise;
}

function service_deleteCity(cityObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterCityModel.update(cityObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, city) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(city) {
			deferred.resolve(city);
		}
	});
	return deferred.promise;
}

function service_addUnit(unitObj) {
	var deferred = Q.defer();
	unitObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	unitObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterUnitModel.create(unitObj, function (err, unit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(unit) {
			deferred.resolve(unit);
		}
	});
	return deferred.promise;
}

function service_modifyUnit(unitObj) {
	var deferred = Q.defer();
	unitObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	unitObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterUnitModel.findByIdAndUpdate(unitObj._id, {$set: unitObj}, {new : true}, function (err, unit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(unit) {
			deferred.resolve(unit);
		}
	});
	return deferred.promise;
}

function service_getUnit(unitObj) {
	var deferred = Q.defer();
	schemaObj.masterUnitModel.find(unitObj, function (err, unit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(unit) {
			deferred.resolve(unit);
		}
	});
	return deferred.promise;
}

function service_deleteUnit(unitObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterUnitModel.update(unitObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, unit) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(unit) {
			deferred.resolve(unit);
		}
	});
	return deferred.promise;
}

function service_addSalePoint(spObj) {
	var deferred = Q.defer();
	spObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	spObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterSalePointModel.create(spObj, function (err, sp) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(sp) {
			deferred.resolve(sp);
		}
	});
	return deferred.promise;
}

function service_modifySalePoint(spObj) {
	var deferred = Q.defer();
	spObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	spObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterSalePointModel.findByIdAndUpdate(spObj._id, {$set: spObj}, {new : true}, function (err, sp) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(sp) {
			deferred.resolve(sp);
		}
	});
	return deferred.promise;
}

function service_getSalePoint(spObj) {
	var deferred = Q.defer();
	schemaObj.masterSalePointModel.find(spObj, function (err, sp) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(sp) {
			deferred.resolve(sp);
		}
	});
	return deferred.promise;
}

function service_deleteSalePoint(spObjID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterSalePointModel.update(spObjID, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, sp) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(sp){
			deferred.resolve(sp);
		}
	});
	return deferred.promise;
}

function service_addClientDepartment(clientDeptObj) {
	var deferred = Q.defer();
	clientDeptObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	clientDeptObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterClientDepartmentModel.create(clientDeptObj, function (err, ret_ClientDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDepartment) {
			deferred.resolve(ret_ClientDepartment);
		} 
	});
	return deferred.promise;
}

function service_modifyClientDepartment(clientDeptObj) {
	var deferred = Q.defer();
	clientDeptObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	clientDeptObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterClientDepartmentModel.findByIdAndUpdate(clientDeptObj._id, {$set: clientDeptObj}, {new : true}, function (err, ret_ClientDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDepartment) {
			deferred.resolve(ret_ClientDepartment);
		}
	});
	return deferred.promise;
}

function service_getClientDepartment(clientDeptObj) {
	var deferred = Q.defer();
	schemaObj.masterClientDepartmentModel.find(clientDeptObj, function (err, ret_ClientDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDepartment) {
			deferred.resolve(ret_ClientDepartment);
		}
	});
	return deferred.promise;
}

function service_deleteClientDepartment(clientDeptObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterClientDepartmentModel.update(clientDeptObj, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_ClientDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDepartment) {
			deferred.resolve(ret_ClientDepartment);
		}
	});
	return deferred.promise;
}

function service_addClientDesignation(clientDesigObj) {
	var deferred = Q.defer();
	clientDesigObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	clientDesigObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterClientDesignationModel.create(clientDesigObj, function (err, ret_ClientDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDesignation) {
			deferred.resolve(ret_ClientDesignation);
		}
	});
	return deferred.promise;
}

function service_modifyClientDesignation(clientDesigObj) {
	var deferred = Q.defer();
	clientDesigObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	clientDesigObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterClientDesignationModel.findByIdAndUpdate(clientDesigObj._id, {$set: clientDesigObj}, {new : true}, function (err, ret_ClientDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDesignation) {
			deferred.resolve(ret_ClientDesignation);
		}
	});
	return deferred.promise;
}

function service_getClientDesignation(clientDesigObj) {
	var deferred = Q.defer();
	schemaObj.masterClientDesignationModel.find(clientDesigObj, function (err, ret_ClientDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDesignation) {
			deferred.resolve(ret_ClientDesignation);
		}
	});
	return deferred.promise;
}

function service_deleteClientDesignation(clientDesigObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterClientDesignationModel.update(clientDesigObj, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_ClientDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ClientDesignation) {
			deferred.resolve(ret_ClientDesignation);
		}
	});
	return deferred.promise;
}

function service_addDealerCategory(dealerCatObj) {
	var deferred = Q.defer();
	dealerCatObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	dealerCatObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	var addDealerCategPromise = new Promise(function(resolve,reject) {
		schemaObj.masterDealerCategoryModel.create(dealerCatObj, function(err,dealerCatogory) {
			if(err) {			
				console.log(err);
				reject(err);
			}
			if(dealerCatogory) {
				console.log('INFO: Succesfully added dealer category - ' + dealerCatogory.authorID);
				resolve(dealerCatogory);
			}
		});
	}); 
			
	Promise.all([addDealerCategPromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyDealerCategory(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(dealerCategObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});		
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});

	return deferred.promise;
}

function service_modifyDealerCategory(dealerCatObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		dealerCatObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		dealerCatObj.modifiedTime = moment(new Date()).format('HH:mm');
		schemaObj.masterDealerCategoryModel.findByIdAndUpdate(dealerCatObj._id, {$set: dealerCatObj}, {new : true}, function(err, dealer_category) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(dealer_category) {			
				deferred.resolve(dealer_category);
			}
		});
	} else if(type === 'push') {
		//dealerCatObj from service_addDealerCategory has all the returned data of dealer category. Future we can change the search query to be better.  
		//createClient send the dealerCatObj query as {active: true} //no change required to this
		schemaObj.masterDealerCategoryModel.update(dealerCatObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err, dealer_category) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(dealer_category) {			
				deferred.resolve(dealer_category);
			}
		});
	}
	return deferred.promise;
}

function service_getDealerCategory(dealerCatObj) {
	var deferred = Q.defer();
	schemaObj.masterDealerCategoryModel.find(dealerCatObj, function (err, ret_DealerCategory) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_DealerCategory) {
			deferred.resolve(ret_DealerCategory);
		}
	});
	return deferred.promise;
}

function service_deleteDealerCategory(dealercategObj,loginUsr){
	var deferred = Q.defer();
	schemaObj.masterDealerCategoryModel.update(dealercategObj, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_DealerCategory) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_DealerCategory) {
			deferred.resolve(ret_DealerCategory);
		}
	});
	return deferred.promise;
}

function service_addProductType(productType) {
	var deferred = Q.defer();
	productType.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productType.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductTypeModel.create(productType, function(err, ret_ProductType) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductType) {
			deferred.resolve(ret_ProductType);
		}
	});
	return deferred.promise;
}

function service_modifyProductType(productType) {
	var deferred = Q.defer();
	productType.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productType.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductTypeModel.findByIdAndUpdate(productType._id, {$set: productType}, {new : true}, function (err, ret_ProductType) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductType) {
			deferred.resolve(ret_ProductType);
		}
	});
	return deferred.promise;
}

function service_getProductType(productType) {
	var deferred = Q.defer();
	schemaObj.masterProductTypeModel.find(productType, function(err, ret_ProductType) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductType) {
			deferred.resolve(ret_ProductType);
		}
	});
	return deferred.promise;
}

function service_deleteProductType(productType,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterProductTypeModel.findByIdAndUpdate(productType._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, {new : true}, function (err, ret_ProductType) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductType) {
			deferred.resolve(ret_ProductType);
		}
	});
	return deferred.promise;
}

function service_addProductName(productName) {
	var deferred = Q.defer();
	productName.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productName.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductNameModel.create(productName, function (err, ret_ProductName) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductName) {
			deferred.resolve(ret_ProductName);
		}
	});
	return deferred.promise;
}

function service_modifyProductName(productName) {
	var deferred = Q.defer();
	productName.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productName.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductNameModel.findByIdAndUpdate(productName._id, {$set: productName}, {new: true}, function (err, ret_ProductName) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductName) {
			deferred.resolve(ret_ProductName);
		}
	});
	return deferred.promise;
}

function service_getProductName(productName) {
	var deferred = Q.defer();
	schemaObj.masterProductNameModel.find(productName, function(err, ret_ProductName) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductName) {
			deferred.resolve(ret_ProductName);
		}
	});
	return deferred.promise;
}

function service_deleteProductName(productName,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterProductNameModel.findByIdAndUpdate(productName._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_ProductName) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductName) {
			deferred.resolve(ret_ProductName);
		}
	});
	return deferred.promise;
}

function service_addProductBrand(productBrand) {
	var deferred = Q.defer();
	productBrand.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productBrand.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductBrandModel.create(productBrand, function (err, ret_ProductBrand) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductBrand) {
			deferred.resolve(ret_ProductBrand);
		}
	});
	return deferred.promise;
}

function service_modifyProductBrand(productBrand) {
	var deferred = Q.defer();
	productBrand.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productBrand.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductBrandModel.findByIdAndUpdate(productBrand._id, {$set: productBrand}, {new: true}, function (err, ret_ProductBrand) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductBrand) {
			deferred.resolve(ret_ProductBrand);
		}
	});
	return deferred.promise;
}

function service_getProductBrand(productBrand) {
	var deferred = Q.defer();
	schemaObj.masterProductBrandModel.find(productBrand, function(err, ret_ProductBrand) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductBrand) {
			deferred.resolve(ret_ProductBrand);
		}
	});
	return deferred.promise;
}

function service_deleteProductBrand(productBrand,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterProductBrandModel.findByIdAndUpdate(productBrand._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_ProductBrand) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductBrand) {
			deferred.resolve(ret_ProductBrand);
		}
	});
	return deferred.promise;
}

function service_getProductItemCode(loginUsr) {
	var deferred = Q.defer();
	var condition = {authorID: loginUsr.authorID};
	
	if(loginUsr.userType == 'd'){
		condition.itemCode = {$gt: 200000};
	}

	schemaObj.masterProductItemModel.find(condition).sort({$natural:-1}).limit(1).exec(function(err, ret_ProductItem) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductItem){
			var itemCode;
			if(ret_ProductItem.length){
				itemCode = ret_ProductItem[0].itemCode + 1;
			}else{
				itemCode = 100001;
				if(loginUsr.userType == 'd'){
					itemCode = 200001;
				}
			}
			deferred.resolve({code: itemCode});
		}
	});
	return deferred.promise;
}

function service_addProductItem(productItem) {
	var deferred = Q.defer();
	productItem.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productItem.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductItemModel.create(productItem, function (err, ret_ProductItem) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductItem) {
			deferred.resolve(ret_ProductItem);
		}
	});
	return deferred.promise;
}

function service_modifyProductItem(productItem) {
	var deferred = Q.defer();
	productItem.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	productItem.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterProductItemModel.findByIdAndUpdate(productItem._id, {$set: productItem}, {new: true}, function (err, ret_ProductItem) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductItem) {
			deferred.resolve(ret_ProductItem);
		}
	});
	return deferred.promise;
}

function service_getProductItem(productItem) {
	var deferred = Q.defer();
	schemaObj.masterProductItemModel.find(productItem, function(err, ret_ProductItem) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductItem) {
			deferred.resolve(ret_ProductItem);
		}
	});
	return deferred.promise;
}

function service_deleteProductItem(productItem,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterProductItemModel.findByIdAndUpdate(productItem._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_ProductItem) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductItem) {
			deferred.resolve(ret_ProductItem);
		}
	});
	return deferred.promise;
}

function service_identifyProductItem(productItem) {
	var deferred = Q.defer();
	schemaObj.masterProductItemModel.find({authorID: productItem.authorID},{itemName: 1,authorID: 1,IMEINumLen: 1}, function (err, ret_ProductItem) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ProductItem) {
			deferred.resolve(ret_ProductItem);
		}
	});
	return deferred.promise;
}

function service_addSupplierCategory(supplierCategory) {
	var deferred = Q.defer();
	supplierCategory.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	supplierCategory.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterSupplierCategoryModel.create(supplierCategory, function (err, ret_SupplierCategory) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_SupplierCategory) {
			deferred.resolve(ret_SupplierCategory);
		}
	});
	return deferred.promise;
}

function service_modifySupplierCategory(obj) {
	var deferred = Q.defer();
	obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterSupplierCategoryModel.findByIdAndUpdate(obj._id, {$set: obj}, {new : true}, function (err, ret_SupplierCategory) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_SupplierCategory) {
			deferred.resolve(ret_SupplierCategory);
		}
	});
	return deferred.promise;
}

function service_getSupplierCategory(supplierCategory) {
	var deferred = Q.defer();
	schemaObj.masterSupplierCategoryModel.find(supplierCategory, function(err,ret_SupplierCategory) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_SupplierCategory) {
			deferred.resolve(ret_SupplierCategory);
		}
	});
	return deferred.promise;
}

function service_deleteSupplierCategory(supplierCategoryID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterSupplierCategoryModel.findByIdAndUpdate(supplierCategoryID._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err,ret_SupplierCategory) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_SupplierCategory) {
			deferred.resolve(ret_SupplierCategory);
		}
	});
	return deferred.promise;
}

function service_addSupplier(supplier) {
	var deferred = Q.defer();
	supplier.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	var supClone = JSON.parse(JSON.stringify(supplier)),supplierRes;

	var supplierPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.masterSupplierModel.create(supplier,function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerPromise = function(supResObj) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.create({active: true,ledgerGroup: supClone.ledger,refType: 'master_supplier',refId: supResObj._id,finYear: supClone.finYear,credit: 0,debit: 0,authorID: supResObj.authorID,createdBy: supResObj.createdBy,creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, function (err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerEntryPromise = function(ledResObj) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerEntryModel.create({active:true, ledgerId:ledResObj._id, refDate:moment(new Date()).format('YYYY-MM-DD'), credit:0, debit:0, type: 'o', finYear:supClone.finYear, authorID:ledResObj.authorID},function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	supplierPromise().then(function(supResObj) {
		supplierRes = supResObj;
		return ledgerPromise(supResObj);
	}).then(function(ledResObj) {
		return ledgerEntryPromise(ledResObj);
	}).then(function(resultobj) {
		deferred.resolve(supplierRes);
	}).catch(function(err) {
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getSupplier(supplier) {
	var deferred = Q.defer();
	schemaObj.masterSupplierModel.find(supplier, function(err, ret_Supplier) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_Supplier) {
			deferred.resolve(ret_Supplier);
		}
	});
	return deferred.promise;
}

function service_getSupplierCode(loginUsr) {
	var deferred = Q.defer();
	if(loginUsr.userType == 'b') {
		schemaObj.masterSupplierModel.find({authorID: loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err, result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				var code = 100001;
				if(result.length) {
					code = parseInt(result[0].code) + 1;
				}
				deferred.resolve({'code': code});
			}
		});
	} else{
		schemaObj.masterSupplierModel.find({authorID: loginUsr.authorID,code: {$lt: 200000}}).sort({$natural:-1}).limit(1).exec(function(err, result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				var code = 100001;
				if(result.length) {
					code = parseInt(result[0].code) + 1;
				}
				deferred.resolve({'code': code});
			}
		});
	}
	return deferred.promise;
}

function service_modifySupplier(obj) {
	var deferred = Q.defer();
	obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterSupplierModel.findByIdAndUpdate(obj._id, {$set: obj}, {new : true}, function (err, ret_Supplier) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_Supplier) {
			deferred.resolve(ret_Supplier);
		}
	});
	return deferred.promise;
}

function service_deleteSupplier(supplierID,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterSupplierModel.findByIdAndUpdate(supplierID._id, {$set: {active: false,modifiedBy: loginUsr,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function(err,ret_Supplier) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_Supplier) {
			deferred.resolve(ret_Supplier);
		}
	});
	return deferred.promise;
}

function service_addEmpDepartment(empDepartment){
	var deferred = Q.defer();
	empDepartment.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	empDepartment.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterEmpDepartmentModel.create(empDepartment, function(err, ret_EmpDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDepartment){
			deferred.resolve(ret_EmpDepartment);
		}
	});
	return deferred.promise;
}

function service_modifyEmpDepartment(empDepartment){
	var deferred = Q.defer();
	empDepartment.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	empDepartment.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterEmpDepartmentModel.findByIdAndUpdate(empDepartment._id, {$set: empDepartment}, {new : true}, function (err, ret_EmpDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDepartment){
			deferred.resolve(ret_EmpDepartment);
		}
	});
	return deferred.promise;
}

function service_getEmpDepartment(empDept) {
	var deferred = Q.defer();
	schemaObj.masterEmpDepartmentModel.find(empDept, function(err, ret_EmpDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDepartment){
			deferred.resolve(ret_EmpDepartment);
		}
	});
	return deferred.promise;
}

function service_deleteEmpDepartment(empDepartmentID,loginUsr){
	var deferred = Q.defer();
	schemaObj.masterEmpDepartmentModel.findByIdAndUpdate(empDepartmentID._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, {new: true}, function (err, ret_EmpDepartment) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDepartment){
			deferred.resolve(ret_EmpDepartment);
		}
	});
	return deferred.promise;
}

function service_addEmpDesignation(empDesignation) {
	var deferred = Q.defer();
	empDesignation.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	empDesignation.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterEmpDesignationModel.create(empDesignation, function (err, ret_EmpDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDesignation) {
			deferred.resolve(ret_EmpDesignation);
		}
	});
	return deferred.promise;
}

function service_modifyEmpDesignation(empDesignation){
	var deferred = Q.defer();
	empDesignation.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	empDesignation.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterEmpDesignationModel.findByIdAndUpdate(empDesignation._id, {$set: empDesignation}, {new : true}, function (err, ret_EmpDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDesignation){
			deferred.resolve(ret_EmpDesignation);
		}
	});
	return deferred.promise;
}

function service_getEmpDesignation(empDesig) {
	var deferred = Q.defer();
	schemaObj.masterEmpDesignationModel.find(empDesig, function(err, ret_EmpDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDesignation) {
			deferred.resolve(ret_EmpDesignation);
		}
	});
	return deferred.promise;
}

function service_deleteEmpDesignation(empDesignationID,loginUsr){
	var deferred = Q.defer();
	schemaObj.masterEmpDesignationModel.findOneAndUpdate(empDesignationID._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_EmpDesignation) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_EmpDesignation){
			deferred.resolve(ret_EmpDesignation);
		}
	});
	return deferred.promise;
}

function service_addEmpHierarchy(empHierarchy) {
	var deferred = Q.defer();
	empHierarchy.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	empHierarchy.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterEmpHierarchyModel.create(empHierarchy, function (err, ret_empHierarchy) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_empHierarchy) {
			deferred.resolve(ret_empHierarchy);
		}
	});
	return deferred.promise;
}

function service_modifyEmpHierarchy(empHierarchy){
	var deferred = Q.defer();
	empHierarchy.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	empHierarchy.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterEmpHierarchyModel.findByIdAndUpdate(empHierarchy._id, {$set: empHierarchy}, {new : true}, function (err, ret_empHierarchy) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_empHierarchy){
			deferred.resolve(ret_empHierarchy);
		}
	});
	return deferred.promise;
}

function service_getEmpHierarchy(empHierarchy) {
	var deferred = Q.defer();
	schemaObj.masterEmpHierarchyModel.find(empHierarchy, function(err, ret_empHierarchy) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_empHierarchy) {
			deferred.resolve(ret_empHierarchy);
		}
	});
	return deferred.promise;
}

function service_deleteEmpHierarchy(empHierarchyID,loginUsr){
	var deferred = Q.defer();
	schemaObj.masterEmpHierarchyModel.findOneAndUpdate(empHierarchyID._id, {$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_empHierarchy) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_empHierarchy){
			deferred.resolve(ret_empHierarchy);
		}
	});
	return deferred.promise;
}

function service_addFinancialYear(finObj) {
	var deferred = Q.defer();
	finObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	finObj.modifiedTime = moment(new Date()).format('HH:mm:ss');

	var finYearPromise = function(){
		return Q.Promise(function(resolve,reject){
			schemaObj.masterFinYearModel.create(finObj,function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				} 
				resolve(res);
			});
		});
	}
	var updateFinPromise = function(retObj){
		return Q.Promise(function(resolve,reject){
			schemaObj.masterFinYearModel.update({$and: [{status: true},{_id: {$ne: retObj._id}},{authorID: retObj.authorID}]},{$set: {'status': false},modifiedBy: retObj.modifiedBy,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')},{"multi": true},function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(retObj);
			});
		});
	}
	var addFinYearPromise = finYearPromise().then(function(retObj) {
		if(finObj.status == true) {
			return updateFinPromise(retObj);
		}else{
			return retObj;
		}
	});

	Promise.all([addFinYearPromise, getUsersByRefnamePromise])
	.then(function(result){
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyFinancialYear({_id: result[0]._id},authorIDs,result[0].modifiedBy,'push')
		.then(function(finYearObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});	
	}).catch(function(err){
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getFinancialYear(obj) {
	var deferred = Q.defer();
	schemaObj.masterFinYearModel.find(obj, function(err, ret_finyear) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_finyear) {
			deferred.resolve(ret_finyear);
		}
	});
	return deferred.promise;
}

function service_modifyFinancialYear(finObj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set') {
		finObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		finObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
		var finYearPromise = function(){
			return Q.Promise(function(resolve,reject){
				schemaObj.masterFinYearModel.findOneAndUpdate({_id: finObj._id},finObj, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					resolve(res);
				});
			});
		}
		var updateFinPromise = function(retObj){
			return Q.Promise(function(resolve,reject){
				schemaObj.masterFinYearModel.update({$and: [{status: true},{_id: {$ne: finObj._id}},{authorID: retObj.authorID}]},{$set: {'status': false}},{"multi": true},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					resolve(res);
				});
			});
		}
		finYearPromise().then(function(retObj){
			if(finObj.status == true) {
				return updateFinPromise(retObj);
			}else{
				return retObj;
			}
		}).then(function(resultobj){
			deferred.resolve(resultobj);
		}).catch(function(err){
			deferred.reject(err);
		});
	} else if(type === 'push') {
		schemaObj.masterFinYearModel.update(finObj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err, finYear) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(finYear) {
				deferred.resolve(finYear);
			}
		});
	}
	return deferred.promise;
}

function service_deleteFinancialYear(finObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterFinYearModel.findOneAndUpdate({_id: finObj._id},{$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_finYear) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_finYear) {
			deferred.resolve(ret_finYear);
		}
	});
	return deferred.promise;
}

function service_addLedgerGroup(ledgerObj){
	var deferred = Q.defer();
	if(ledgerObj.parent){
		schemaObj.masterLedgerGroupModel.findOneAndUpdate({_id:ledgerObj.parent, authorID:ledgerObj.authorID}, {$push:{subName:{name:ledgerObj.name, active:true}}}, function(err, ret_ledger){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			if(ret_ledger){
				deferred.resolve(ret_ledger);
			}
		});
	} else{
		ledgerObj['active'] = true;
		schemaObj.masterLedgerGroupModel.create(ledgerObj, function(err, ret_ledger){
			if(err){
				console.log(err);
				deferred.reject(err);
			}
			if(ret_ledger){
				deferred.resolve(ret_ledger);
			}
		});
	}
	return deferred.promise;
}

//ledger group should be read by all users
function service_getLedgerGroup(obj){
	var deferred = Q.defer();
	schemaObj.masterLedgerGroupModel.find(obj, function(err, ret_ledger) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ledger) {
			deferred.resolve(ret_ledger);
		}
	});
	return deferred.promise;
}

function service_modifyLedgerGroup(ledgerObj){
	var deferred = Q.defer();
	ledgerObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	ledgerObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterLedgerGroupModel.findOneAndUpdate({_id: ledgerObj._id}, ledgerObj, function (err, ret_ledger) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ledger) {
			deferred.resolve(ret_ledger);
		}
	});
	return deferred.promise;
}

function service_deleteLedgerGroup(ledgerObj,loginUsr){
	var deferred = Q.defer();
	schemaObj.masterLedgerGroupModel.findOneAndUpdate({_id:ledgerObj._id}, {$set:{active:false, modifiedBy:loginUsr._id, modifiedTime:moment(new Date()).format('HH:mm:ss'), modifiedDate:moment(new Date()).format('YYYY-MM-DD')}}, function(err, ret_ledger) {
		if(err) { 
			console.log(err);
			deferred.reject(err);
		}
		if(ret_ledger){
			deferred.resolve(ret_ledger);
		}
	});
	return deferred.promise;
}

function service_addVisitType(visitObj) {
	var deferred = Q.defer();
	visitObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	visitObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterVisitTypeModel.create(visitObj, function (err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
	});
	return deferred.promise;
}

function service_getVisitType(obj) {
	var deferred = Q.defer();
	schemaObj.masterVisitTypeModel.find(obj, function(err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
	});
	return deferred.promise;
}

function service_modifyVisitType(visitObj) {
	var deferred = Q.defer();
	visitObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	visitObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.masterVisitTypeModel.findOneAndUpdate({_id: visitObj._id},visitObj, function (err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
	});
	return deferred.promise;
}

function service_deleteVisitType(visitObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterVisitTypeModel.findOneAndUpdate({_id: visitObj._id},{$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
	});
	return deferred.promise;
}

function service_addProductAttribute(obj) {
	var deferred = Q.defer();
	obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	
	var addAttributePromise = new Promise(function(resolve, reject) {
		schemaObj.masterProductAttributeModel.create(obj, function(err, attribute) {
			if(err) {
				console.log(err);
				reject(err);
			}
			if(attribute) {
				resolve(attribute);
			}
		});
	});

	Promise.all([addAttributePromise, getUsersByRefnamePromise])
	.then(function(result) {
		var authorIDs = [];
		result[1].forEach(function(usr) {
			authorIDs.push(usr._id);
		});
		service_modifyProductAttribute(result[0],authorIDs,result[0].modifiedBy,'push')
		.then(function(attributeObj) {
			deferred.resolve(result[0]);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});		
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getProductAttribute(obj) {
	var deferred = Q.defer();
	schemaObj.masterProductAttributeModel.find(obj, function(err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
	});
	return deferred.promise;
}

function service_modifyProductAttribute(obj,authorIDs,loginUsr,type='set') {
	var deferred = Q.defer();
	if(type === 'set'){
		obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
		schemaObj.masterProductAttributeModel.findByIdAndUpdate(obj._id, {$set: obj}, {new : true}, function(err, ret_obj) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(ret_obj){
				deferred.resolve(ret_obj);
			}
		});
	} else if(type === 'push'){
		schemaObj.masterProductAttributeModel.update(obj, {$push: {authorID: authorIDs}, modifiedBy: loginUsr,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm')}, {new: true, multi: true}, function(err, ret_obj) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(ret_obj){
				deferred.resolve(ret_obj);
			}
		});
	}
	return deferred.promise;
}

function service_deleteProductAttribute(obj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.masterProductAttributeModel.findOneAndUpdate({_id: obj._id},{$set: {active: false,modifiedBy: loginUsr._id,modifiedTime: moment(new Date()).format('HH:mm:ss'),modifiedDate: moment(new Date()).format('YYYY-MM-DD')}}, function (err, ret_obj) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(ret_obj) {
			deferred.resolve(ret_obj);
		}
	});
	return deferred.promise;
}