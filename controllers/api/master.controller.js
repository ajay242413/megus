var express = require('express');
var router = express.Router();
var masterService = require('services/master.service');
var genericService = require('services/generic.service');

router.post('/saveState', controller_addState);
router.put('/updateState', controller_modifyState);
router.post('/readState', controller_getState);
router.post('/removeState', controller_deleteState);
router.post('/saveRegion', controller_addRegion);
router.put('/updateRegion', controller_modifyRegion);
router.post('/readRegion', controller_getRegion);
router.post('/removeRegion', controller_deleteRegion);
router.post('/saveZone', controller_addZone);
router.post('/readZone', controller_getZone);
router.put('/updateZone', controller_modifyZone);
router.post('/removeZone', controller_deleteZone);
router.post('/saveDistrict', controller_addDistrict);
router.put('/updateDistrict', controller_modifyDistrict);
router.post('/readDistrict', controller_getDistrict);
router.post('/removeDistrict', controller_deleteDistrict);
router.post('/saveArea', controller_addArea);
router.put('/updateArea', controller_modifyArea);
router.post('/readArea', controller_getArea);
router.post('/readAreas', controller_getAreas);
router.post('/removeArea', controller_deleteArea);
router.post('/saveCountry', controller_addCountry);
router.post('/readCountry', controller_getCountry);
router.put('/updateCountry', controller_modifyCountry);
router.post('/removeCountry', controller_deleteCountry);
router.post('/saveCity', controller_addCity);
router.put('/updateCity', controller_modifyCity);
router.post('/readCity', controller_getCity);
router.post('/removeCity', controller_deleteCity);
router.post('/saveUnit', controller_addUnit);
router.put('/updateUnit', controller_modifyUnit);
router.post('/readUnit', controller_getUnit);
router.post('/removeUnit', controller_deleteUnit);
router.post('/saveSalePoint', controller_addSalePoint);
router.put('/updateSalePoint', controller_modifySalePoint);
router.post('/readSalePoint', controller_getSalePoint);
router.post('/removeSalePoint', controller_deleteSalePoint);
router.post('/saveClientDepartment', controller_addClientDepartment);
router.put('/updateClientDepartment', controller_modifyClientDepartment);
router.post('/readClientDepartment', controller_getClientDepartment);
router.post('/removeClientDepartment', controller_deleteClientDepartment);
router.post('/saveClientDesignation', controller_addClientDesignation);
router.put('/updateClientDesignation', controller_modifyClientDesignation);
router.post('/readClientDesignation', controller_getClientDesignation);
router.post('/removeClientDesignation', controller_deleteClientDesignation);
router.post('/saveDealerCategory', controller_addDealerCategory);
router.put('/updateDealerCategory', controller_modifyDealerCategory);
router.post('/readDealerCategory', controller_getDealerCategory);
router.post('/removeDealerCategory', controller_deleteDealerCategory);
router.post('/saveProductType', controller_addProductType);
router.get('/readProductType', controller_getProductType);
router.put('/updateProductType', controller_modifyProductType);
router.put('/removeProductType', controller_deleteProductType);
router.post('/saveProductName', controller_addProductName);
router.get('/readProductName', controller_getProductName);
router.put('/updateProductName', controller_modifyProductName);
router.put('/removeProductName', controller_deleteProductName);
router.post('/saveProductBrand', controller_addProductBrand);
router.get('/readProductBrand', controller_getProductBrand);
router.put('/updateProductBrand', controller_modifyProductBrand);
router.put('/removeProductBrand', controller_deleteProductBrand);
router.get('/readProductItemCode', controller_getProductItemCode);
router.post('/saveProductItem', controller_addProductItem);
router.get('/readProductItem', controller_getProductItem);
router.put('/updateProductItem', controller_modifyProductItem);
router.put('/removeProductItem', controller_deleteProductItem);
router.post('/findProductItem', controller_identifyProductItem);
router.post('/saveSupplierCategory', controller_addSupplierCategory);
router.get('/readSupplierCategory', controller_getSupplierCategory);
router.put('/updateSupplierCategory', controller_modifySupplierCategory);
router.put('/removeSupplierCategory', controller_deleteSupplierCategory);
router.post('/saveSupplier', controller_addSupplier);
router.get('/readSupplier', controller_getSupplier);
router.get('/readSupplierCode', controller_getSupplierCode);
router.put('/updateSupplier', controller_modifySupplier);
router.put('/removeSupplier', controller_deleteSupplier);
router.post('/saveEmpDepartment', controller_addEmpDepartment);
router.put('/updateEmpDepartment', controller_modifyEmpDepartment);
router.post('/readEmpDepartment', controller_getEmpDepartment);
router.post('/removeEmpDepartment', controller_deleteEmpDepartment);
router.post('/saveEmpDesignation', controller_addEmpDesignation);
router.put('/updateEmpDesignation', controller_modifyEmpDesignation);
router.post('/readEmpDesignation', controller_getEmpDesignation);
router.post('/removeEmpDesignation', controller_deleteEmpDesignation);
router.post('/saveEmpHierarchy', controller_addEmpHierarchy);
router.put('/updateEmpHierarchy', controller_modifyEmpHierarchy);
router.post('/readEmpHierarchy', controller_getEmpHierarchy);
router.put('/removeEmpHierarchy', controller_deleteEmpHierarchy);
router.post('/saveFinancialYear', controller_addFinancialYear);
router.post('/readFinancialYear', controller_getFinancialYear);
router.put('/updateFinancialYear', controller_modifyFinancialYear);
router.put('/deleteFinancialYear', controller_deleteFinancialYear);
router.post('/saveLedgerGroup', controller_addLedgerGroup);
router.post('/readLedgerGroup', controller_getLedgerGroup);
router.put('/updateLedgerGroup', controller_modifyLedgerGroup);
router.put('/deleteLedgerGroup', controller_deleteLedgerGroup);
router.post('/saveVisitType', controller_addVisitType);
router.post('/readVisitType', controller_getVisitType);
router.put('/updateVisitType', controller_modifyVisitType);
router.put('/removeVisitType', controller_deleteVisitType);
router.post('/saveProductAttribute', controller_addProductAttribute);
router.post('/readProductAttribute', controller_getProductAttribute);
router.put('/updateProductAttribute', controller_modifyProductAttribute);
router.put('/removeProductAttribute', controller_deleteProductAttribute);

module.exports = router;

function controller_addState(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addState(req.body)
		.then(function(state) {
			if(state) {
				res.send(state);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyState(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyState(req.body)
		.then(function(state) {
			if(state) {
				res.send(state);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getState(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getState(req.body)
		.then(function(state) {
			if(state) {
				res.send(state);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteState(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteState(req.body,usrObj)
		.then(function(state) {
			if(state) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addRegion(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addRegion(req.body)
		.then(function(region) {
			if(region) {
				res.send(region);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyRegion(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyRegion(req.body)
		.then(function(region) {
			if(region) {
				res.send(region);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getRegion(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getRegion(req.body)
		.then(function(region) {
			if(region) {
				res.send(region);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteRegion(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteRegion(req.body,usrObj)
		.then(function(region) {
			if(region) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addZone(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addZone(req.body)
		.then(function(zone) {
			if(zone) {
				res.send(zone);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyZone(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyZone(req.body)
		.then(function(zone) {
			if(zone) {
				res.send(zone);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getZone(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getZone(req.body)
		.then(function(zone) {
			if(zone) {
				res.send(zone);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteZone(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteZone(req.body,usrObj)
		.then(function(zone) {
			if(zone) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addDistrict(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addDistrict(req.body)
		.then(function(dist) {
			if(dist) {
				res.send(dist);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyDistrict(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyDistrict(req.body)
		.then(function(dist) {
			if(dist) {
				res.send(dist);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getDistrict(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getDistrict(req.body)
		.then(function(dist) {
			if(dist) {
				res.send(dist);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteDistrict(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteDistrict(req.body,usrObj)
		.then(function(district) {
			if(district) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addArea(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addArea(req.body)
		.then(function(area) {
			if(area) {
				res.send(area);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyArea(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyArea(req.body)
		.then(function(area) {
			if(area) {
				res.send(area);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getArea(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getArea(req.body)
		.then(function(area) {
			if(area) {
				res.send(area);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getAreas(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		// req.body.authorID = usrObj.authorID;
		masterService.getAreas(req.body)
		.then(function(areas) {
			if(areas) {
				res.send(areas);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteArea(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteArea(req.body,usrObj)
		.then(function(area) {
			if(area) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addCountry(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addCountry(req.body)
		.then(function(coun) {
			if(coun) {
				res.send(coun);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyCountry(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyCountry(req.body)
		.then(function(coun) {
			if(coun) {
				res.send(coun);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getCountry(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getCountry(req.body)
		.then(function(coun) {
			if(coun) {
				res.send(coun);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteCountry(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteCountry(req.body,usrObj)
		.then(function(coun) {
			if(coun) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addCity(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addCity(req.body)
		.then(function(cit) {
			if(cit) {
				res.send(cit);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyCity(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyCity(req.body)
		.then(function(cit) {
			if(cit) {
				res.send(cit);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getCity(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getCity(req.body)
		.then(function(cit) {
			if(cit) {
				res.send(cit);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteCity(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteCity(req.body,usrObj)
		.then(function(city) {
			if(city) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addUnit(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addUnit(req.body)
		.then(function(unit) {
			if(unit) {
				res.send(unit);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyUnit(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyUnit(req.body)
		.then(function(unit) {
			if(unit) {
				res.send(unit);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});	
}

function controller_getUnit(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getUnit(req.body)
		.then(function(unit) {
			if(unit) {
				res.send(unit);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteUnit(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteUnit(req.body,usrObj)
		.then(function(unit) {
			if(unit) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addSalePoint(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addSalePoint(req.body)
		.then(function(sp) {
			if(sp) {
				res.send(sp);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});	
}

function controller_modifySalePoint(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifySalePoint(req.body)
		.then(function(sp) {
			if(sp) {
				res.send(sp);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});	
}

function controller_getSalePoint(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getSalePoint(req.body)
		.then(function(sp) {
			if(sp) {
				res.send(sp);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteSalePoint(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteSalePoint(req.body,usrObj)
		.then(function(sp) {
			if(sp) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addClientDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addClientDepartment(req.body)
		.then(function(ret_ClientDepartment) {
			if(ret_ClientDepartment) {
				res.send(ret_ClientDepartment);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});	
}

function controller_modifyClientDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyClientDepartment(req.body)
		.then(function(obj) {
			if(obj) {
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getClientDepartment(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getClientDepartment(req.body)
		.then(function(ret_ClientDepartment) {
			if(ret_ClientDepartment) {
				res.send(ret_ClientDepartment);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteClientDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteClientDepartment(req.body,usrObj)
		.then(function(obj) {
			if(obj) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addClientDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addClientDesignation(req.body)
		.then(function(ret_ClientDesignation) {
			if(ret_ClientDesignation) {
				res.send(ret_ClientDesignation);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyClientDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyClientDesignation(req.body)
		.then(function(obj) {
			if(obj) {
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getClientDesignation(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getClientDesignation(req.body)
		.then(function(ret_ClientDesignation) {
			if(ret_ClientDesignation) {
				res.send(ret_ClientDesignation);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteClientDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteClientDesignation(req.body,usrObj)
		.then(function(obj) {
			if(obj) {
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addDealerCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addDealerCategory(req.body)
		.then(function(ret_DealerCategory) {
			if(ret_DealerCategory) {
				res.send(ret_DealerCategory);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyDealerCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyDealerCategory(req.body)
		.then(function(obj) {
			if(obj) {
				res.send(obj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getDealerCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getDealerCategory(req.body)
		.then(function(ret_DealerCategory) {
			if(ret_DealerCategory) {
				res.send(ret_DealerCategory);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteDealerCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteDealerCategory(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj){
				res.sendStatus(200);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addProductType(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addProductType(req.body)
		.then(function(ret_ProdType) {
			if(ret_ProdType) {
				res.send(ret_ProdType);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyProductType(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyProductType(req.body)
		.then(function(ret_ProductType) {
			if(ret_ProductType) {
				res.send(ret_ProductType);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getProductType(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getProductType(req.body)
		.then(function(ret_ProductType) {
			if(ret_ProductType) {
				res.send(ret_ProductType);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteProductType(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteProductType(req.body,usrObj)
		.then(function(ret_ProductType) {
			if(ret_ProductType) {
				res.send(ret_ProductType);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addProductName(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addProductName(req.body)
		.then(function(ret_ProdName) {
			if(ret_ProdName) {
				res.send(ret_ProdName);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyProductName(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyProductName(req.body)
		.then(function(ret_ProductName) {
			if(ret_ProductName) {
				res.send(ret_ProductName);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getProductName(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getProductName(req.body)
		.then(function(ret_ProductName) {
			if(ret_ProductName) {
				res.send(ret_ProductName);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteProductName(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteProductName(req.body,usrObj)
		.then(function(ret_ProductName) {
			if(ret_ProductName) {
				res.send(ret_ProductName);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addProductBrand(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addProductBrand(req.body)
		.then(function(ret_ProdBrand) {
			if(ret_ProdBrand) {
				res.send(ret_ProdBrand);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyProductBrand(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyProductBrand(req.body)
		.then(function(ret_ProductBrand) {
			if(ret_ProductBrand) {
				res.send(ret_ProductBrand);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getProductBrand(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getProductBrand(req.body)
		.then(function(ret_ProdBrand) {
			if(ret_ProdBrand) {
				res.send(ret_ProdBrand);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteProductBrand(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteProductBrand(req.body,usrObj)
		.then(function(ret_ProductBrand) {
			if(ret_ProductBrand) {
				res.send(ret_ProductBrand);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getProductItemCode(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.getProductItemCode(usrObj)
		.then(function(ret_ProdItem) {
			if(ret_ProdItem) {
				res.send(ret_ProdItem);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addProductItem(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addProductItem(req.body)
		.then(function(ret_ProdItem) {
			if(ret_ProdItem) {
				res.send(ret_ProdItem);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyProductItem(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyProductItem(req.body)
		.then(function(ret_ProductItem) {
			if(ret_ProductItem) {
				res.send(ret_ProductItem);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getProductItem(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getProductItem(req.body)
		.then(function(ret_ProdItem) {
			if(ret_ProdItem) {
				res.send(ret_ProdItem);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteProductItem(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteProductItem(req.body,usrObj)
		.then(function(ret_ProductItem) {
			if(ret_ProductItem) {
				res.send(ret_ProductItem);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});	
}

//check where this function being used. If not delete
function controller_identifyProductItem(req,res) {
	masterService.identifyProductItem(req.body)
	.then(function(ret_ProductItem) {
		if(ret_ProductItem) {
			res.send(ret_ProductItem);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_addSupplierCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addSupplierCategory(req.body)
		.then(function(ret_SupplierCategory) {
			if(ret_SupplierCategory) {
				res.send(ret_SupplierCategory);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifySupplierCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifySupplierCategory(req.body)
		.then(function(ret_SupplierCategory) {
			if(ret_SupplierCategory) {
				res.send(ret_SupplierCategory);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getSupplierCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getSupplierCategory(req.body)
		.then(function(ret_SupplierCategory) {
			if(ret_SupplierCategory) {
				res.send(ret_SupplierCategory);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteSupplierCategory(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteSupplierCategory(req.body,usrObj)
		.then(function(ret_SupplierCategory) {
			if(ret_SupplierCategory) {
				res.send(ret_SupplierCategory);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});	
}

function controller_addSupplier(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.createdBy = usrObj._id;
		masterService.addSupplier(req.body)
		.then(function(ret_Supplier) {
			if(ret_Supplier) {
				res.send(ret_Supplier);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifySupplier(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifySupplier(req.body)
		.then(function(ret_Supplier) {
			if(ret_Supplier) {
				res.send(ret_Supplier);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getSupplier(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getSupplier(req.body)
		.then(function(ret_Supplier) {
			if(ret_Supplier) {
				res.send(ret_Supplier);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getSupplierCode(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.userType = usrObj.userType;
		masterService.getSupplierCode(req.body)
		.then(function(ret_Supplier) {
			if(ret_Supplier) {
				res.send(ret_Supplier);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteSupplier(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteSupplier(req.body,usrObj)
		.then(function(ret_Supplier) {
			if(ret_Supplier) {
				res.send(ret_Supplier);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addEmpDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addEmpDepartment(req.body)
		.then(function(ret_EmpDepartment) {
			if(ret_EmpDepartment) {
				res.send(ret_EmpDepartment);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyEmpDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyEmpDepartment(req.body)
		.then(function(ret_EmpDepartment) {
			if(ret_EmpDepartment) {
				res.send(ret_EmpDepartment);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getEmpDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getEmpDepartment(req.body)
		.then(function(ret_EmpDepartment) {
			if(ret_EmpDepartment) {
				res.send(ret_EmpDepartment);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteEmpDepartment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteEmpDepartment(req.body,usrObj)
		.then(function(ret_EmpDepartment) {
			if(ret_EmpDepartment) {
				res.send(ret_EmpDepartment);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addEmpDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addEmpDesignation(req.body)
		.then(function(ret_EmpDesignation) {
			if(ret_EmpDesignation) {
				res.send(ret_EmpDesignation);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyEmpDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyEmpDesignation(req.body)
		.then(function(ret_EmpDesignation) {
			if(ret_EmpDesignation) {
				res.send(ret_EmpDesignation);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getEmpDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getEmpDesignation(req.body)
		.then(function(ret_EmpDesignation) {
			if(ret_EmpDesignation) {
				res.send(ret_EmpDesignation);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteEmpDesignation(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteEmpDesignation(req.body,usrObj)
		.then(function(ret_EmpDesignation) {
			if(ret_EmpDesignation) {
				res.send(ret_EmpDesignation);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addEmpHierarchy(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addEmpHierarchy(req.body)
		.then(function(ret_EmpHierarchy) {
			if(ret_EmpHierarchy) {
				res.send(ret_EmpHierarchy);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyEmpHierarchy(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyEmpHierarchy(req.body)
		.then(function(ret_EmpHierarchy) {
			if(ret_EmpHierarchy) {
				res.send(ret_EmpHierarchy);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getEmpHierarchy(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getEmpHierarchy(req.body)
		.then(function(ret_EmpHierarchy) {
			if(ret_EmpHierarchy) {
				res.send(ret_EmpHierarchy);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteEmpHierarchy(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteEmpHierarchy(req.body,usrObj)
		.then(function(ret_EmpHierarchy) {
			if(ret_EmpHierarchy) {
				res.send(ret_EmpHierarchy);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addFinancialYear(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addFinancialYear(req.body)
		.then(function(ret_FinancialYear) {
			if(ret_FinancialYear) {
				res.send(ret_FinancialYear);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getFinancialYear(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getFinancialYear(req.body)
		.then(function(ret_FinancialYear) {
			if(ret_FinancialYear) {
				res.send(ret_FinancialYear);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyFinancialYear(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyFinancialYear(req.body)
		.then(function(ret_FinancialYear) {
			if(ret_FinancialYear) {
				res.send(ret_FinancialYear);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteFinancialYear(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteFinancialYear(req.body,usrObj)
		.then(function(ret_FinancialYear) {
			if(ret_FinancialYear) {
				res.send(ret_FinancialYear);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addLedgerGroup(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		masterService.addLedgerGroup(req.body)
		.then(function(ret_ledger) {
			if(ret_ledger) {
				res.send(ret_ledger);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getLedgerGroup(req,res) {
	masterService.getLedgerGroup(req.body)
	.then(function(ret_ledger) {
		if(ret_ledger) {
			res.send(ret_ledger);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_modifyLedgerGroup(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyLedgerGroup(req.body)
		.then(function(ret_Ledger) {
			if(ret_Ledger) {
				res.send(ret_Ledger);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteLedgerGroup(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteLedgerGroup(req.body,usrObj)
		.then(function(ret_Ledger) {
			if(ret_Ledger) {
				res.send(ret_Ledger);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addVisitType(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addVisitType(req.body)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getVisitType(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getVisitType(req.body)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyVisitType(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyVisitType(req.body)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteVisitType(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteVisitType(req.body,usrObj)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addProductAttribute(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		req.body.modifiedBy = usrObj._id;
		masterService.addProductAttribute(req.body)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getProductAttribute(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		masterService.getProductAttribute(req.body)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyProductAttribute(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		masterService.modifyProductAttribute(req.body)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteProductAttribute(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		masterService.deleteProductAttribute(req.body,usrObj)
		.then(function(retObj) {
			if(retObj) {
				console.log(err);
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}