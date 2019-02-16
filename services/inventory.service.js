var Q = require('q'), _ = require('lodash');
var cron = require('node-cron');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectID;
var schemaObj = require('./custom.schema');
var userService = require('./user.service');
var vouchersService = require('services/voucher.service');

var inventoryService = {};

inventoryService.getInvoiceNumber = service_getInvoiceNumber;
inventoryService.getInventory = service_getInventory;
inventoryService.getInventoryById = service_getInventoryById;
inventoryService.getInventoryCode = service_getInventoryCode;
inventoryService.getPurchaseInvoice = service_getPurchaseInvoice;
inventoryService.addPurchase = service_addPurchase;
inventoryService.getSalesInvoice = service_getSalesInvoice;
inventoryService.addSales = service_addSales;
inventoryService.getSalesReturnInvoice = service_getSalesReturnInvoice;
inventoryService.addSalesReturn = service_addSalesReturn;
inventoryService.getPurchaseItems = service_getPurchaseItems;
inventoryService.getSalesItems = service_getSalesItems;
inventoryService.getStockTransferInvoice = service_getStockTransferInvoice;
inventoryService.addStockTransfer = service_addStockTransfer;
inventoryService.deleteStockTransfer = service_deleteStockTransfer;
inventoryService.getPurInvoices = service_getPurInvoices;
inventoryService.getSalesInvoices = service_getSalesInvoices;
inventoryService.getPurchaseAck = service_getPurchaseAck;
inventoryService.addPurchaseAck = service_addPurchaseAck;
inventoryService.getSales = service_getSales;
inventoryService.stockStatus = service_stockStatus;
inventoryService.stockRegister = service_stockRegister;
inventoryService.activateIMEI = service_activateIMEI;
inventoryService.getRDSstockSummary = service_getRDSstockSummary;
inventoryService.getDealerStockSummary = service_getDealerStockSummary;
inventoryService.getIMEIinventory = service_getIMEIinventory;
inventoryService.getIMEIboxNumber = service_getIMEIboxNumber;
inventoryService.IMEIstatus = service_IMEIstatus;
inventoryService.getRDSstockSummary = service_getRDSstockSummary;
inventoryService.IMEIduplication = service_IMEIduplication;
inventoryService.rdsTertiarySummary = service_rdsTertiarySummary;
inventoryService.deleteRDSsaleInvoice = service_deleteRDSsaleInvoice;
inventoryService.deleteRDSpurchaseInvoice = service_deleteRDSpurchaseInvoice;
inventoryService.deleteBrandSaleInvoice = service_deleteBrandSaleInvoice;
inventoryService.deleteBrandPurchaseInvoice = service_deleteBrandPurchaseInvoice;
inventoryService.editInvoice = service_editInvoice;
inventoryService.rdsSecondarySummary = service_rdsSecondarySummary;
inventoryService.addSalesBills = service_addSalesBills;
inventoryService.getRdsSalesReport = service_getRdsSalesReport;
inventoryService.rdsPrimarySummary = service_rdsPrimarySummary;
inventoryService.addPurchaseDc = service_addPurchaseDc;
inventoryService.deleteBrandPurchaseDcInvoice = service_deleteBrandPurchaseDcInvoice;
inventoryService.addPurchaseDcBill = service_addPurchaseDcBill;
inventoryService.addSaleDcBill = service_addSaleDcBill;
inventoryService.rdsActivationReport = service_rdsActivationReport;
inventoryService.rdsStockReport = service_rdsStockReport;
inventoryService.dealerStockReport = service_dealerStockReport;
inventoryService.addSaleDc = service_addSaleDc;
inventoryService.dcStatus = service_dcStatus;

module.exports = inventoryService;

function service_getInvoiceNumber(obj) {
	var deferred=Q.defer(), settingRes=[];
	var settingPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.settingModel.findOne({authorID:obj.authorID},function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				} else {
					resoilve({});
				}
			});
		});
	}
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOne({authorID:obj.authorID, invenType:obj.type}).sort({$natural:-1}).limit(1).exec(function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				} else {
					resolve({});
				}
			});
	
		});
	}
	settingPromise().then(function(res_obj) {
		settingRes = JSON.parse(JSON.stringify(res_obj));
		return inventoryPromise();
	}).then(function(inv_obj) {
		var invoiceNo="", seqNum=1;
		if(inv_obj.invoiceNumber) {
			var splitInvoice = inv_obj.invoiceNumber.split('/');
			seqNum = parseInt(splitInvoice[splitInvoice.length - 1]) + 1;
		}
		if(settingRes.invoice) {
			if(obj.type == 'pdc') {
				if(settingRes.invoice.purchaseDc) {
					invoiceNo = 'PDC/' + settingRes.invoice.purchaseDc + '/' + seqNum;
				}
			} else if(obj.type == 'sdc') {
				if(settingRes.invoice.purchaseDc) {
					invoiceNo = 'SDC/' + settingRes.invoice.saleDc + '/' + seqNum;
				}
			}
		}
		if(invoiceNo == "") {
			invoiceNo = "empty";
		}
		deferred.resolve({invoice:invoiceNo});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getPurchaseInvoice(loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,invenType: "p"}).sort({$natural:-1}).limit(1).exec(function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			schemaObj.settingModel.find({authorID: loginUsr.authorID}, function (err1, ret_obj) {
				if(err) {
					console.log(err1);
				}
				if(ret_obj) {
					var invoice = "";
					var seqNum = 1;
					if(result.length) {
						var splitInvoice = result[0].invoiceNumber.split('/');
						seqNum = parseInt(splitInvoice[splitInvoice.length - 1]) + 1;
					}
					if(ret_obj.length) {
						if(ret_obj[0].invoice) {
							if(ret_obj[0].invoice.purchase) {
								invoice = 'PI/' + ret_obj[0].invoice.purchase + '/' + seqNum;
							}
						}
					}
					if(invoice === "") {
						invoice = "empty";
					}
					deferred.resolve({'purchase': invoice});
				}
			});
		}
	});
	return deferred.promise;
}

function service_addPurchase(purObj,loginUsr){
	var deferred = Q.defer();
	purObj.createdBy = loginUsr._id;
	purObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	purObj.active = true;
	purObj.partyType = "master_supplier";
	purObj.invenType = 'p';
	purObj.authorID = loginUsr.authorID;
	var purClone = JSON.parse(JSON.stringify(purObj));
	var purREFid = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(purObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var ledgerPromise = function() {
		var supplierLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:purClone.party}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+purClone.netValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:purClone.netValue, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate, pending:purClone.netValue, received:0}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var purchaseLedgerPromise = new Promise(function(resolve, reject){
			schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.grossValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.grossValue, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(purClone.IGST != undefined){
			var inputIgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.IGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.IGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputIgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var inputCgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.CGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.CGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var inputSgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.SGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.SGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var stockStatusPromise = function() {
		var promisePool = function(purRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(purRes.IMEINumber){
					for (var i = 0; i < purRes.IMEINumber.length; i++) {
						IMEINum.push({IMEI: purRes.IMEINumber[i].IMEI,active: false,createdBy: loginUsr._id,pp: purClone.invoiceDate, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),boxno: purRes.IMEINumber[i].boxno,model: purRes.name,brand: [{date: purClone.invoiceDate,refID: purREFid._id,author: loginUsr.authorID}],position: 'B'});
					}
					schemaObj.IMEImodel.insertMany(IMEINum, function(imeierr, imeires) {
						if(imeierr) {
							console.log("ERROR: Purchase IMEI creation:" + imeierr);
						}
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({authorID:loginUsr.authorID, name:purRes.name, salePoint:purClone.salePoint}, {$inc:{quantity:+purRes.quantity}, $push:{IMEINumber:{$each: IMEINum}}, name:purRes.name, salePoint:purClone.salePoint, authorID:loginUsr.authorID, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},{upsert:true, new:true}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(purClone.item.map(promisePool))
			.then(function(data) {
				resolve(data);
			})
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	inventoryPromise()
	.then(function(retpurObj) {
		purREFid = JSON.parse(JSON.stringify(retpurObj));
		return ledgerPromise();
	})
	.then(function() {
		return stockStatusPromise();
	})
	.then(function() {
		deferred.resolve(purREFid);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getSalesInvoice(loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,invenType: "s"}).sort({$natural:-1}).limit(1).exec(function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			schemaObj.settingModel.find({authorID: loginUsr.authorID},function (err1, ret_obj) {
				if(err) {
					console.log(err);
					deferred.reject(err1);
				}
				if(ret_obj) {
					var invoice = "";
					var seqNum = 1;
					if(result.length){
						var splitInvoice = result[0].invoiceNumber.split('/');
						seqNum = parseInt(splitInvoice[splitInvoice.length - 1]) + 1;
					}
					if(ret_obj.length) {
						if(ret_obj[0].invoice) {
							if(ret_obj[0].invoice.sale) {
								invoice = 'SI/' + ret_obj[0].invoice.sale + '/' + seqNum;
							}
						}
					}
					if(invoice === "") {
						invoice = "empty";
					}
					deferred.resolve({'sale': invoice});
				}
			});
		}
	});
	return deferred.promise;
}

function service_getSalesReturnInvoice(loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,invenType: "sr"}).sort({$natural:-1}).limit(1).exec(function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			schemaObj.settingModel.find({authorID: loginUsr.authorID},function (err1, ret_obj) {
				if(err) {
					console.log(err);
					deferred.reject(err1);
				}
				if(ret_obj) {
					var invoice = "";
					var seqNum = 1;
					if(result.length){
						var splitInvoice = result[0].invoiceNumber.split('/');
						seqNum = parseInt(splitInvoice[splitInvoice.length - 1]) + 1;
					}
					if(ret_obj.length){
						if(ret_obj[0].invoice){
							if(ret_obj[0].invoice.saleReturn){
								invoice = 'SRN/' + ret_obj[0].invoice.saleReturn + '/' + seqNum;
							}
						}
					}
					if(invoice == ""){
						invoice = "empty";
					}
					deferred.resolve({'salesReturn': invoice});
				}
			});
		}
	});
	return deferred.promise;
}

function service_getPurchaseItems(salepoint,loginUsr) {
	var deferred = Q.defer();
	var cond = {authorID: loginUsr.authorID};
	if(salepoint.salePoint){
		cond.salePoint = salepoint.salePoint;
	}
	schemaObj.stockStatusModel.find(cond, function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getSalesItems(obj){
	var deferred = Q.defer();
	schemaObj.stockStatusModel.find({authorID: obj.authorID},function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

// function productName_create(masterProdName) {
// 	console.log('product name create - callback' + masterProdName);
// 	schemaObj.masterUnitModel.findOneAndUpdate({'name': masterProdName.unit.name, 'authorID': masterProdName.authorID}, {'code': masterProdName.unit.code, 'name': masterProdName.unit.name, 'authorID': masterProdName.authorID, modifiedBy: loginUser._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss'), 'active': masterProdName.unit.active}, {upsert: true, returnNewDocument: true}, function(err, masterUnit_ret) {
// 		if(err) {
// 			console.log('ERROR: Failed to create unit to ');
// 		}
// 		if(masterUnit_ret) {
// 			masterProdName.unit = masterUnit_ret._id;
// 			console.log('INFO: Successfully created unit to ');
// 			console.log(masterUnit_ret._id);
// 		}
// 	});
// 	masterProdName.lastModifiedTime = new Date();
// 	schemaObj.masterProductNameModel.findOneAndUpdate({'name': masterProdName.name, 'authorID': masterProdName.authorID}, {masterProdName}, {upsert: true, returnNewDocument: true}, function(err, masterProductName_ret) {
// 		if(err) {
// 			console.log('ERROR: Failed to create product name to ' + masterProdName.authorID);
// 		}
// 		if(masterProductName_ret) {
// 			console.log('INFO: Successfully created product name to ' + masterProdName.authorID);
// 		}
// 	});
// }

function service_addSales(salObj,loginUsr) {
	var deferred = Q.defer();
	salObj.invenType = 's';
	salObj.authorID = loginUsr.authorID;
	salObj.createdBy = loginUsr._id;
	salObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	salObj.active = true;
	if(loginUsr.userType == 'b') {
		salObj.partyType = "client";
	} else if(loginUsr.userType == 'd') {
		salObj.partyType = "dealer";
	}
	var saleClone = JSON.parse(JSON.stringify(salObj));
	var salresRef = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(salObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				} 
				if(res) {
					resolve(res);
				} else {
					reject('ERROR: No create return object');
				}
			});
		});
	}
	var ledgerPromise = function(retSalObj) {
		var clientLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:saleClone.party}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+saleClone.netValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:saleClone.netValue, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate, pending:saleClone.netValue, received:0}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var salesLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.grossValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.grossValue, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(saleClone.IGST != undefined){
			var outputIgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.IGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.IGST, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([clientLedgerPromise, salesLedgerPromise, outputIgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var outputCgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.CGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.CGST, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var outputSgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.SGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.SGST, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([clientLedgerPromise, salesLedgerPromise, outputCgstLedgerPromise, outputSgstLedgerPromise]).then(function(data) {
					resolve(retSalObj);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var stockStatusPromise = function(ret_retSalObj) {
		var saleDate = saleClone.invoiceDate;
		var promisePool = function(saleRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(saleRes.IMEINumber) {
					if(loginUsr.userType === 'b') {
						IMEINum = saleRes.IMEINumber.map(a => a.IMEI);
						schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum}},{$push: {'sales': {author: loginUsr.authorID,date: saleDate,refID: salresRef._id}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
							if(imeierr) {
								console.log(imeierr);
							}
						});
					} else {
						IMEINum = saleRes.IMEINumber;
						schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{$push: {'dealer': {'author': saleClone.dealerUserID,'date': saleDate,'refID': salresRef._id}},modifiedBy: loginUsr._id,position: 'D',modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
							if(imeierr) {
								console.log(imeierr);
							}
						});
						IMEINum.map((obj) => {
							obj.ss = saleDate;
							return obj;
						});
					}
				}
				if(loginUsr.userType === 'b'){
					schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID, 'name': saleRes.name,'salePoint': saleClone.salePoint},{ $inc: {'quantity': -saleRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
						if(result) {
							resolve(result);
						}
					});
				} else {
					schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID, 'name': saleRes.name,'salePoint': saleClone.salePoint},{ $inc: {'quantity': -saleRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
						if(result) {
							schemaObj.stockStatusModel.findOneAndUpdate({'authorID': saleClone.dealerUserID,'name': saleRes.name},{ $inc: {'quantity': +saleRes.quantity}, $push: {'IMEINumber': { $each: IMEINum}},'name': saleRes.name, 'authorID': saleClone.dealerUserID,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},{upsert: true,new: true},function(err1,res) {
								if(res) {
									resolve(res);
								}
							});
						}
					});
				}
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(saleClone.item.map(promisePool)).then(function(data) {
				resolve(ret_retSalObj);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var getAuthorID = function(retSalObj) {
		return Q.Promise(function(resolve, reject) {
			schemaObj.userModel.findOne({'refID':retSalObj.party}, function(err, userObj) {
				if(userObj) {
					resolve(userObj._id);
				}
				if(err) {
					console.log(err);
					reject(err);
				}
			});
		});
	}
	var addDistMasterItem = function(login_authorID, client_authorID) {
		return Q.Promise(function(resolve, reject) {
			var addMasterItemPool = new Promise(function(resolve, reject) {
				saleClone.item.forEach(function(saleRes) {
					schemaObj.masterProductItemModel.findOne({'_id': saleRes.name, 'authorID': client_authorID}, function(err, masterProdItemObj_ret) {
						if(err) {
							console.log(err);
							reject(err);
						}
						if(masterProdItemObj_ret) {
							console.log('INFO: Master product item match for author: ' + client_authorID);
							resolve(masterProdItemObj_ret);
						} else {
							console.log('INFO: Master product item not found for author: ' + client_authorID);
							//product name model
							schemaObj.masterProductItemModel.findById(saleRes.name, function(err, masterProdItemObj) {
								masterProdName = masterProdItemObj.prodName;
								var masterProdType_promise = new Promise(function(resolve, reject) {
									schemaObj.masterProductTypeModel.findOne({'_id': masterProdName.type, 'authorID': client_authorID}, function(err, masterProdType_ret) {
										if(err) {
											console.log(err);
											reject(err);
										}
										if(masterProdType_ret) {
											console.log('INFO: Product type match for authorID: ' + client_authorID);
											resolve(masterProdType_ret);											
										} else {
											console.log('INFO: Product type not found for author: ' + client_authorID);
											schemaObj.masterProductTypeModel.findByIdAndUpdate(masterProdName.type, {$push: {authorID: client_authorID}, modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, {new: true}, function(err, ret_prodType) {
												if(err) {
													console.log(err);
													reject(err);
												}
												if(ret_prodType) {
													console.log('INFO: Product type updated to ' + client_authorID + ': ' + ret_prodType);
													resolve(ret_prodType);
												} else {
													console.log('ERROR: Query did not return value');
													reject('ERROR: Query did not return value');
												}
											});
										}
									});
								});
								var masterProdUnit_promise = new Promise(function(resolve, reject) {
									schemaObj.masterUnitModel.findOne({'_id': masterProdName.unit, 'authorID': client_authorID}, function(err, masterUnit_ret) {
										if(err) {
											console.log(err);
											reject(err);
										}
										if(masterUnit_ret) {
											console.log('INFO: Master unit match for author: ' + client_authorID);
											resolve(masterUnit_ret);
										} else {
											console.log('INFO: Master unit not found for author: ' + client_authorID);
											schemaObj.masterUnitModel.findByIdAndUpdate(masterProdName.unit, {$push: {authorID: client_authorID}, modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, {new: true}, function(err, ret_unit) {
												if(err) {
													console.log(err);
													reject(err);
												}
												if(ret_unit) {
													console.log('INFO: Master unit updated to ' + client_authorID + ': ' + ret_unit);
													resolve(ret_unit);
												} else {
													console.log('ERROR: Query did not return value');
													reject('ERROR: Query did not return value');
												}
											});
										}
									});
								});
								var masterProdName_promise = Promise.all([masterProdType_promise, masterProdUnit_promise])
								.then(function(prodName_sub) {
									return Q.Promise(function(resolve, reject) {
										schemaObj.masterProductNameModel.findOne({'_id': masterProdName, 'authorID': client_authorID}, function(err, masterProdName_ret) {
											if(err) {
												console.log(err);
												reject(err);
											}
											if(masterProdName_ret) {
												console.log('INFO: Master product name match for author: ' + client_authorID);
												resolve(masterProdName_ret);
											} else {
												console.log('INFO: Master product name not found for author: ' + client_authorID);
												schemaObj.masterProductNameModel.findByIdAndUpdate(masterProdName, {$push: {authorID: client_authorID}, modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, {new: true}, function(err, ret_ProductName) {
													if(err) {
														console.log(err);	
														reject(err);
													}
													if(ret_ProductName) {
														console.log('INFO: Product name updated to ' + client_authorID + ': ' + ret_ProductName);	
														resolve(ret_ProductName);
													} else {
														console.log('ERROR: Query did not return value');
														reject('ERROR: Query did not return value');
													}
												});
											}
										});
									});
								})
								.catch(function(err) {
									console.log(err);
									reject(err);
								});
								var masterProdBrand_promise = new Promise(function(resolve, reject) {
									schemaObj.masterProductBrandModel.findOne({'_id': masterProdItemObj.brandName, 'authorID': client_authorID}, function(err, masterProdBrand_ret) {
										if(err) {
											console.log(err);
											reject(err);
										}
										if(masterProdBrand_ret) {
											console.log('INFO: Master product brand match for author: ' + client_authorID);
											resolve(masterProdBrand_ret);
										} else {
											console.log('INFO: Master product brand not found for author: ' + client_authorID);
											schemaObj.masterProductBrandModel.findByIdAndUpdate(masterProdItemObj.brandName, {$push: {authorID: client_authorID}, modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, {new: true}, function(err, ret_ProductBrand) {
												if(err) {
													console.log(err);	
													reject(err);
												}
												if(ret_ProductBrand) {
													console.log('INFO: Product brand updated to ' + client_authorID + ': ' + ret_ProductBrand);	
													resolve(ret_ProductBrand);
												} else {
													console.log('ERROR: Query did not return value');
													reject('ERROR: Query did not return value');
												}
											});
										}
									});
								});
								Promise.all([masterProdBrand_promise, masterProdName_promise])
								.then(function(prodItem) {
									return Q.Promise(function(resolve, reject) {
										schemaObj.masterProductItemModel.findByIdAndUpdate(saleRes.name, {$push: {authorID: client_authorID},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, {new: true}, function(err, ret_ProductItem) {
											if(err) {
												console.log(err);	
												reject(err);
											}
											if(ret_ProductItem) {
												console.log('INFO: Product item updated to ' + client_authorID + ': ' + ret_ProductItem);
												resolve(ret_ProductItem);
											} else {
												console.log('ERROR: Query did not return value');
												reject('ERROR: Query did not return value');
											}
										});
									});
								})
								.catch(function(err) {
									console.log(err);
									reject(err);
								});
							});					
						}
					});
				});
			});
			addMasterItemPool
			.then(function(masterProdItem) {
				console.log('INFO: Successfully added master product item');
				resolve(masterProdItem);
			})
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	inventoryPromise()
	.then(function(retSalObj) {
		salresRef = JSON.parse(JSON.stringify(retSalObj));
		return Q.Promise(function(resolve, reject) {
			getAuthorID(retSalObj).then(function(client_authorID) {
				addDistMasterItem(retSalObj.authorID, client_authorID);
			})
			ledgerPromise(retSalObj).then(function(ledger_retSalObj) {
				resolve(ledger_retSalObj);
			})
		});
	})
	.then(function(ret_retSalObj) {
		return Q.Promise(function(resolve, reject) {
			resolve(stockStatusPromise(ret_retSalObj));
		});
	})
	.then(function(ret_retSalObj) {
		return Q.Promise(function(resolve, reject) {
			if(loginUsr.userType == 'b'){
				resolve(ret_retSalObj);
			} else {
				resolve(service_secondarySales({item:saleClone.item, retObj:ret_retSalObj}, loginUsr));
			}
		});
	})
	.then(function(data) {
		deferred.resolve(data);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getStockTransferInvoice(loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,invenType: "t"}).sort({$natural:-1}).limit(1).exec(function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			schemaObj.settingModel.find({authorID: loginUsr.authorID},function (err1, ret_obj) {
				if(err) {
					console.log(err);
					deferred.reject(err);
				}
				if(ret_obj) {
					var invoice = "";
					var seqNum = 1;
					if(result.length){
						var splitInvoice = result[0].invoiceNumber.split('/');
						seqNum = parseInt(splitInvoice[splitInvoice.length - 1]) + 1;
					}
					if(ret_obj.length){
						if(ret_obj[0].invoice){
							if(ret_obj[0].invoice.transfer){
								invoice = 'ST/' + ret_obj[0].invoice.transfer + '/' + seqNum;
							}
						}
					}
					if(invoice === ""){
						invoice = "empty";
					}
					deferred.resolve({'transfer': invoice});
				}
			});
		}
	});
	return deferred.promise;
}

function service_addStockTransfer(transferObj,loginUsr) {
	var deferred = Q.defer();
	transferObj.invenType = 't';
	transferObj.authorID = loginUsr.authorID;
	transferObj.createdBy = loginUsr._id;
	transferObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	transferObj.active = true;
	var transClone = JSON.parse(JSON.stringify(transferObj));
	var inventoryPromise = function(){
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(transferObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var stockStatusPromise = function(transResObj) {
		var promisePool = function(transItem) {
			var IMEINum = [];
			if(transItem.IMEINumber){
				IMEINum = transItem.IMEINumber;
				if(loginUsr.userType == 'b'){
					schemaObj.IMEImodel.updateMany({IMEI: {$in: IMEINum.map(a => a.IMEI)}},{$push: {brandTransfer: {author: loginUsr.authorID,date: transResObj.invoiceDate,refID: transResObj._id}}},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							console.log(imeierr);
						}
					});
				} else {
					schemaObj.IMEImodel.updateMany({IMEI: {$in: IMEINum.map(a => a.IMEI)}},{$push: {rdsTransfer: {author: loginUsr.authorID,date: transResObj.invoiceDate,refID: transResObj._id}}},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
						}
					});
				}
			}
			schemaObj.stockStatusModel.findOneAndUpdate({authorID: loginUsr.authorID, name: transItem.name,salePoint: transClone.salePoint},{ $inc: {quantity: +transItem.quantity},$push: {IMEINumber: { $each: IMEINum}},name: transItem.name,authorID: loginUsr.authorID,modifiedBy: loginUsr._id,salePoint: transClone.salePoint,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},{upsert: true,new: true},function(err,result) { 
				if(result) {
					schemaObj.stockStatusModel.findOneAndUpdate({authorID: loginUsr.authorID,name: transItem.name,salePoint: transClone.source},{$inc: {quantity: -transItem.quantity},$pull: {IMEINumber: {IMEI: {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err1,res) {
						if(res) {
							return res;
						}
					});
				}
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(transClone.item.map(promisePool)).then(function(data) {
				resolve(transResObj);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	inventoryPromise().then(function(ret_Obj) {
		return stockStatusPromise(ret_Obj);
	})
	.then(function(resultobj) {
		deferred.resolve(resultobj);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_deleteStockTransfer(reqObj,loginUsr) {
	var deferred = Q.defer();
	var imeiNumbers = [];
	var soldInvoice;
	for(var i=0; i<reqObj.item.length; i++) {
		if(reqObj.item[i].name.IMEINumLen) {
			imeiNumbers = imeiNumbers.concat(reqObj.item[i].IMEINumber.map(a => a.IMEI));
		}
	}
	var checkIMEIpromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.find({_id: {'$ne': reqObj._id},code: {'$gt': reqObj.code},authorID: loginUsr.authorID,'$or': [{invenType: 's'},{invenType: 't'}],'item.IMEINumber.IMEI': {$in: imeiNumbers},active: true},function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					soldInvoice = res;
					resolve(res);
				}
			});
		});
	}
	var imeiPromise = function(){
		return Q.Promise(function(resolve,reject){
			if(loginUsr.userType == "b"){
				schemaObj.IMEImodel.updateMany({'IMEI': {$in: imeiNumbers}},{$pop: {brandTransfer: 1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						soldInvoice = res;
						resolve(res);
					}
				});
			} else {
				schemaObj.IMEImodel.updateMany({'IMEI': {$in: imeiNumbers}},{$pop: {rdsTransfer: 1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						soldInvoice = res;
						resolve(res);
					}
				});
			}
		});
	}
	var stockStatusPromise = function() {
		var promisePool = function(reqRes) {
			var IMEINum = [];
			if(reqRes.IMEINumber) {
				IMEINum = reqRes.IMEINumber;
			}
			schemaObj.stockStatusModel.findOneAndUpdate({authorID: loginUsr.authorID, name: reqRes.name._id,salePoint: reqObj.salePoint._id},{$inc: {quantity: -reqRes.quantity},$pull: {IMEINumber: {IMEI: {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
				if(result) {
					schemaObj.stockStatusModel.findOneAndUpdate({authorID: loginUsr.authorID,name: reqRes.name._id,salePoint: reqObj.source._id},{$inc: {quantity: reqRes.quantity},$push: {IMEINumber: { $each: IMEINum}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err1,res) {
						if(res) {
							return res;
						}
					});
				}
			});                                                                                                                                                                                    
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(reqObj.item.map(promisePool))
			.then(function(data) {
				resolve(data);
			})
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var disablePromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id: reqObj._id},{active: false,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	checkIMEIpromise()
	.then(function(resultObj) {
		if(resultObj.length) {
			return {status: 'Not Deleted'};
		} else {
			return imeiPromise();
		}
	})
	.then(function(imeiResObj) {
		if(imeiResObj.status) {
			return imeiResObj;
		} else {
			return stockStatusPromise();
		}
	})
	.then(function(imeiResObj) {
		if(imeiResObj.status) {
			return imeiResObj;
		} else {
			return disablePromise();
		}
	})
	.then(function(ledgerObj) {
		console.log(ledgerObj);
		if(ledgerObj.status) {
			deferred.resolve(soldInvoice);
		} else {
			deferred.resolve({status: 'Deleted'});
		}
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getPurInvoices(sup,loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,'party': sup.party},{'party': 1,'invoiceNumber': 1,'netValue': 1},function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getSalesInvoices(parObj,loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,'party': parObj.party},{'invoiceNumber': 1,'netValue': 1},function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getPurchaseAck(loginUsr) {
	var deferred = Q.defer();
	userService.loginAuthorRefID(loginUsr)
	.then(function(ret_user) {
		var loginAuthorRefID = ret_user;
		schemaObj.inventoryModel.find({party: loginAuthorRefID.refID._id,invenType: "s",'ack': undefined, active: true},{item:0, createdBy:0, creationTime:0, invenType:0, authorID:0, creditDays:0, code:0, paymentType:0, active:0, CGST:0, SGST:0, IGST:0, grossValue:0}, function(err, result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result){
				deferred.resolve(result);
			}
		});
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_addPurchaseAck(purObj, loginUsr) {
	var deferred = Q.defer();
	purObj.createdBy = loginUsr._id;
	purObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	purObj.partyType = "master_supplier";
	purObj.invenType = 'p';
	purObj.authorID = loginUsr.authorID;
	purObj.active = true;
	var purClone = JSON.parse(JSON.stringify(purObj));
	var purREFid = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(purObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.inventoryModel.findOneAndUpdate({_id: purClone.ackID}, {$set:{'ack':1, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}}, function(ackErr, ackRes) {
						if(ackErr) {
							console.log(ackErr);
							reject(ackErr);
						}
						if(ackRes) {
							resolve(res);
						}
					});
				}
			});
		});
	}
	var ledgerPromise = function() {
		var supplierLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:purClone.party}, {$set: {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},$inc: {credit:+purClone.netValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:purClone.netValue, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate, pending:purClone.netValue, received:0}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var purchaseLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID:loginUsr.authorID}, {$set: {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},$inc: {debit:+purClone.grossValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.grossValue, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(purClone.IGST != undefined) {
			var inputIgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputIGST", authorID:loginUsr.authorID}, {$set: {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},$inc: {debit:+purClone.IGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.IGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputIgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var inputCgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputCGST", authorID:loginUsr.authorID}, {$set: {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},$inc: {debit:+purClone.CGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.CGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var inputSgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputSGST", authorID:loginUsr.authorID}, {$set: {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},$inc: {debit:+purClone.SGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.SGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var stockStatusPromise = function() {
		var promisePool = function(purRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(purRes.IMEINumber) {
					IMEINum = purRes.IMEINumber;
					var imei = purRes.IMEINumber.map(a => a.IMEI);
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: imei}},{$push: {'rds': {'author': loginUsr.authorID,'date': purClone.invoiceDate,'refID': purREFid._id}},position: 'R'},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							reject(imeierr);
						}
					});
					IMEINum.map((obj) => {
						obj.sp = purClone.invoiceDate;
						return obj;
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID,'name': purRes.name,'salePoint': purClone.salePoint},{ $inc: {'quantity': +purRes.quantity}, $push: {'IMEINumber': { $each: IMEINum}},'name': purRes.name,'salePoint': purClone.salePoint,'authorID': loginUsr.authorID,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},{upsert: true,new: true},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					resolve(res);
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(purClone.item.map(promisePool))
			.then(function(data) {
				resolve(data);
			})
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	inventoryPromise()
	.then(function(retpurObj) {
		purREFid = JSON.parse(JSON.stringify(retpurObj));
		return ledgerPromise();
	}).then(function() {
		return stockStatusPromise();
	}).then(function() {
		return service_primarySales(purClone.item, loginUsr);
	}).then(function() {
		deferred.resolve(purREFid);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getSales(loginUsr) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({authorID: loginUsr.authorID,invenType: "s"},function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_stockStatus(obj,loginUsr) {
	var deferred = Q.defer();
	var stockStatusPromise = function() {
		return Q.Promise(function(resolve,reject) {
			if(obj.date) {
				schemaObj.inventoryModel.find({authorID:loginUsr.authorID, active:true, invoiceDate:{$lte:obj.date}, $or:[{salePoint:{$in:obj.sp}}, {source:{$in:obj.sp}}]},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						var result = [];
						for(var i=0; i<res.length; i++){
							if((res[i].invenType == 'p') || (res[i].invenType == 'sr') || (res[i].invenType == 'pdc')){
								for(var j=0; j<res[i].item.length; j++){
									if(res[i].item[j].quantity > 0){
										var matchItem = false;
										for(var k=0; k<result.length; k++){
											if((res[i].item[j].name._id == result[k].name._id) && (res[i].salePoint._id == result[k].salePoint._id)){
												result[k].quantity = result[k].quantity + res[i].item[j].quantity;
												if(res[i].item[j].IMEINumber){
													if(result[k].IMEINumber){
														Array.prototype.push.apply(result[k].IMEINumber, res[i].item[j].IMEINumber);
													} else{
														result[k].IMEINumber = res[i].item[j].IMEINumber;
													}
												}
												matchItem = true;
											}
										}
										if(!matchItem){
											result.push({name:res[i].item[j].name,salePoint:res[i].salePoint,quantity:res[i].item[j].quantity});
											if(res[i].item[j].IMEINumber){
												result[result.length - 1].IMEINumber = res[i].item[j].IMEINumber;
											}
										}
									}
								}
							} else if((res[i].invenType == 's') || (res[i].invenType == 'pr') || (res[i].invenType == 'sdc')){
								for(var j=0; j<res[i].item.length; j++){
									if(res[i].item[j].quantity > 0){
										var matchItem = false;
										for(var k=0; k<result.length; k++){
											if((res[i].item[j].name._id == result[k].name._id) && (res[i].salePoint._id == result[k].salePoint._id)){
												result[k].quantity = result[k].quantity - res[i].item[j].quantity;
												if(res[i].item[j].IMEINumber){
													for(var l=0; l<res[i].item[j].IMEINumber.length; l++){
														var imeiInd = result[k].IMEINumber.findIndex(x => JSON.stringify(x.IMEI) == JSON.stringify(res[i].item[j].IMEINumber[l].IMEI));
														if(imeiInd >= 0){
															result[k].IMEINumber.splice(imeiInd, 1);
														}
													}
												}
												matchItem = true;
											}
										}
										if(!matchItem){
											result.push({name:res[i].item[j].name,salePoint:res[i].salePoint,quantity: 0 - res[i].item[j].quantity});
										}
									}
								}
							} else if(res[i].invenType == 't'){
								for(var j=0; j<res[i].item.length; j++){
									var matchItem1 = false;
									var matchItem2 = false;
									for(var k=0; k<result.length; k++){
										if((res[i].item[j].name._id == result[k].name._id) && (String(res[i].source._id) == String(result[k].salePoint._id))){
											result[k].quantity = result[k].quantity - res[i].item[j].quantity;
											if(res[i].item[j].IMEINumber){
												for(var l=0; l<res[i].item[j].IMEINumber.length; l++){
													var imeiInd = result[k].IMEINumber.findIndex(x => JSON.stringify(x.IMEI) == JSON.stringify(res[i].item[j].IMEINumber[l].IMEI));
													if(imeiInd.length >= 0){
														result[k].IMEINumber.splice(imeiInd, 1);
													}
												}
											}
											matchItem2 = true;
										} else if((res[i].item[j].name._id == result[k].name._id) && (String(res[i].salePoint._id) == String(result[k].salePoint._id))){
											result[k].quantity = result[k].quantity + res[i].item[j].quantity;
											if(res[i].item[j].IMEINumber){
												if(result[k].IMEINumber){
													Array.prototype.push.apply(result[k].IMEINumber, res[i].item[j].IMEINumber);
												} else{
													result[k].IMEINumber = res[i].item[j].IMEINumber;
												}
											}
											matchItem1 = true;
										}
									}
									if(!matchItem1){
										var imInd = obj.sp.findIndex(x => x == String(res[i].salePoint._id));
										if(imInd >= 0){
											result.push({name:res[i].item[j].name,salePoint:res[i].salePoint,quantity:res[i].item[j].quantity});
											if(res[i].item[j].IMEINumber){
												result[result.length - 1].IMEINumber = res[i].item[j].IMEINumber;
											}
										}
									}
									if(!matchItem2){
										var imInd = obj.sp.findIndex(x => x == String(res[i].source._id));
										if(imInd >= 0){
											result.push({name:res[i].item[j].name,salePoint:res[i].source,quantity: 0 - res[i].item[j].quantity});
										}
									}
								}
							}
						}
						resolve(result);
					}
				});
			} else {
				schemaObj.stockStatusModel.find({authorID:loginUsr.authorID, name:{$in:obj.itm}, salePoint:{$in:obj.sp}}, {authorID:0, modifiedBy:0, modifiedDate:0, modifiedTime:0}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			}
		});
	}
	stockStatusPromise()
	.then(function(fin_result) {
		var result = JSON.parse(JSON.stringify(fin_result));
		if(obj.age) {
			if(loginUsr.userType == 'b') {
				for(var i=0; i<result.length; i++) {
					if(result[i].IMEINumber) {
						var diff = 0;
						for(var j=0; j<result[i].IMEINumber.length; j++) {
							var startDate = moment(new Date(result[i].IMEINumber[j].pp), "YYYY-MM-DD");
    						var endDate = moment(new Date(), "YYYY-MM-DD");
							result[i].IMEINumber[j].age = endDate.diff(startDate, 'days');
							diff = diff + result[i].IMEINumber[j].age;
						}
						result[i].age = diff / result[i].IMEINumber.length;
					}
				}
			} else {
				for(var i=0; i<result.length; i++) {
					if(result[i].IMEINumber) {
						var diff = 0;
						for(var j=0; j<result[i].IMEINumber.length; j++) {
							var startDate = moment(new Date(result[i].IMEINumber[j].sp), "YYYY-MM-DD");
    						var endDate = moment(new Date(), "YYYY-MM-DD");
							result[i].IMEINumber[j].age = endDate.diff(startDate, 'days');
							diff = diff + result[i].IMEINumber[j].age;
						}
						result[i].age = diff / result[i].IMEINumber.length;
					}
				}
			}
		}
		deferred.resolve(result);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_stockRegister(obj, loginUsr){
	var deferred = Q.defer(),  objClone = JSON.parse(JSON.stringify(obj));
	for(var i=0; i<obj.sp.length; i++) {
		obj.sp[i] = ObjectId(obj.sp[i]);
	}
	for(var i=0; i<obj.itm.length; i++) {
		obj.itm[i] = ObjectId(obj.itm[i]);
	}
	var finalResult = {open:[], current:[]};
	var openingStockPromise = function() {
		var stockPromise = new Promise(function(resolve, reject) {
			schemaObj.inventoryModel.aggregate([
				{
					$match: {
						authorID: ObjectId(loginUsr.authorID),
						active: true,
						invenType: {$ne: 't'},
						salePoint: {$in: obj.sp},
						invoiceDate: {
							$lt: obj.start
						}
					}
				},
				{
					$unwind: '$item'
				},
				{
					$match: {
						'item.name': {$in: obj.itm}
					}
				},
				{
					$project: {
						'salePoint': 1,
						'item.name': 1,
						customField: {
							'$cond': {
								if: {
									$or: [{$eq: ["$invenType",'s']}, {$eq: ["$invenType",'sdc']}, {$eq: ["$invenType",'pr']}],
								},
								then: {
									$subtract: [ 0, "$item.quantity" ] 
								},
								// else: {
								// 	$cond: {
								// 		if: {
								// 			$eq: ["$invenType",'sr']
								// 		},
								// 		then: {
								// 			$subtract: [ 0, "$item.quantity" ] 
								// 		},
								// 		else: '$item.quantity'
								// 	}
								// }
								else: '$item.quantity'
							}
						}
					}
				},
				{
					$group: {
						_id: {item:'$item.name',sp:'$salePoint'},
						qty: {$sum: '$customField'}
					}
				}
			],function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		var transferPromise = new Promise(function(resolve, reject) {
			schemaObj.inventoryModel.aggregate([
				{
					$match: {
						authorID: ObjectId(loginUsr.authorID),
						active: true,
						invenType: {$eq: 't'},
						$or: [{salePoint: {$in: obj.sp}}, {source: {$in: obj.sp}}],
						invoiceDate: {
							$lt: obj.start
						}
					}
				},
				{
					$unwind: '$item'
				},
				{
					$match: {
						'item.name': {$in: obj.itm}
					}
				},
				{
					$project: {
						'item.name': 1,
						'item.quantity': 1,
						salePoint: 1,
						quantity: 1,
						source: 1
					}
				},
				{
					$group: {
						_id: {item: '$item.name', sp: '$salePoint', src: '$source'},
						qty: {$sum: '$item.quantity'}
					}
				}
			],function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		return Q.Promise(function(resolve, reject) {
			Promise.all([stockPromise, transferPromise]).then(function(data) {
				var stockData = data[0], transferData = data[1];
				for(var i=0; i<transferData.length; i++) {
					var matchItem1 = false, matchItem2 = false;
					for(var j=0; j<stockData.length; j++) {
						if((String(transferData[i]._id.item) == String(stockData[j]._id.item)) && (String(transferData[i]._id.src) == String(stockData[j]._id.sp))) {
							stockData[j].qty = stockData[j].qty - transferData[i].qty;
							matchItem2 = true;
						} else if((String(transferData[i]._id.item) == String(stockData[j]._id.item)) && (String(transferData[i]._id.sp) == String(stockData[j]._id.sp))) {
							stockData[j].qty = stockData[j].qty + transferData[i].qty;
							matchItem1 = true;
						}
					}
					if(!matchItem1) {
						var imInd = objClone.sp.findIndex(x => String(x) == String(transferData[i]._id.sp));
						if(imInd >= 0) {
							stockData.push({_id:{item:transferData[i]._id.item, sp:transferData[i]._id.sp}, qty:transferData[i].qty});
						}
					}
					if(!matchItem2) {
						var imInd = objClone.sp.findIndex(x => String(x) == String(transferData[i]._id.src));
						if(imInd >= 0) {
							stockData.push({_id:{item:transferData[i]._id.item, sp:transferData[i]._id.src}, qty: 0 - transferData[i].qty});
						}
					}
				}
				var openStock = [];
				for(var i=0; i<stockData.length; i++) {
					var itemMatch = false;
					for(var j=0; j<openStock.length; j++) {
						// if(openStock[j].item.equals(stockData[i]._id.item)){
						if(String(openStock[j].item) == String(stockData[i]._id.item)) {
							openStock[j].qty = openStock[j].qty + stockData[i].qty;
							itemMatch = true;
						}
					}
					if(!itemMatch) {
						openStock.push({item:stockData[i]._id.item, qty:stockData[i].qty});
					}
				}
				resolve(openStock);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var closingStockPromise = function() {
		var stockPromise = new Promise(function(resolve, reject) {
			schemaObj.inventoryModel.aggregate([
				{
					$match: {
						authorID: ObjectId(loginUsr.authorID),
						active: true,
						invenType: {$ne: 't'},
						salePoint: {$in: obj.sp},
						invoiceDate : {
							$gte: obj.start,
							$lte: obj.end
						}
					}
				},
				{
					$unwind: '$item'
				},
				{
					$match: {
						'item.name': {$in: obj.itm}
					}
				},
				{
					$project: {
						'salePoint': 1,
						'item.name': 1,
						'invenType': 1,
						'item.quantity': 1
					}
				},
				{
					$group: {
						_id: {item:'$item.name', sp:'$salePoint', type:'$invenType'},
						qty: {$sum:'$item.quantity'}
					}
				}
			],function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		var transferPromise = new Promise(function(resolve, reject) {
			schemaObj.inventoryModel.aggregate([
				{
					$match: {
						authorID: ObjectId(loginUsr.authorID),
						active: true,
						invenType: {$eq: 't'},
						$or: [{salePoint: {$in: obj.sp}}, {source: {$in: obj.sp}}],
						invoiceDate : {
							$gte: obj.start,
							$lte: obj.end
						}
					}
				},
				{
					$unwind: '$item'
				},
				{
					$match: {
						'item.name': {$in:obj.itm}
					}
				},
				{
					$project: {
						'item.name': 1,
						'item.quantity': 1,
						salePoint: 1,
						quantity: 1,
						source: 1
					}
				},
				{
					$group: {
						_id: {item:'$item.name', sp:'$salePoint', src:'$source'},
						qty: {$sum:'$item.quantity'}
					}
				}
			],function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		return Q.Promise(function(resolve, reject) {
			Promise.all([stockPromise, transferPromise]).then(function(data) {
				var stockData = data[0], transferData = data[1];
				for(var i=0; i<transferData.length; i++) {
					var matchItem1 = false, matchItem2 = false;
					for(var j=0; j<stockData.length; j++) {
						if((String(transferData[i]._id.item) == String(stockData[j]._id.item)) && (String(transferData[i]._id.src) == String(stockData[j]._id.sp)) && ((stockData[j]._id.type == 'p') || (stockData[j]._id.type == 'pdc') || (stockData[j]._id.type == 'sr'))) {
							stockData[j].qty = stockData[j].qty - transferData[i].qty;
							matchItem2 = true;
						} else if((String(transferData[i]._id.item) == String(stockData[j]._id.item)) && (String(transferData[i]._id.sp) == String(stockData[j]._id.sp)) && ((stockData[j]._id.type == 'p') || (stockData[j]._id.type == 'pdc') || (stockData[j]._id.type == 'sr'))) {
							stockData[j].qty = stockData[j].qty + transferData[i].qty;
							matchItem1 = true;
						}
					}
					if(!matchItem1) {
						var imInd = objClone.sp.findIndex(x => String(x) == String(transferData[i]._id.sp));
						if(imInd >= 0) {
							stockData.push({_id:{item:transferData[i]._id.item, sp:transferData[i]._id.sp, type:'p'}, qty:transferData[i].qty});
						}
					}
					if(!matchItem2) {
						var imInd = objClone.sp.findIndex(x => String(x) == String(transferData[i]._id.src));
						if(imInd >= 0) {
							stockData.push({_id:{item:transferData[i]._id.item, sp:transferData[i]._id.src, type:'p'}, qty: 0 - transferData[i].qty});
						}
					}
				}
				var closeStock = [];
				for(var i=0; i<stockData.length; i++) {
					var itemMatch = false;
					for(var j=0; j<closeStock.length; j++) {
						if(String(closeStock[j].item) == String(stockData[i]._id.item) && (closeStock[j].type == stockData[i]._id.type)){
							closeStock[j].qty = closeStock[j].qty + stockData[i].qty;
							itemMatch = true;
						}
					}
					if(!itemMatch) {
						closeStock.push({item:stockData[i]._id.item, qty:stockData[i].qty, type:stockData[i]._id.type});
					}
				}
				resolve(closeStock);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	openingStockPromise().then(function(result1) {
		finalResult.open = result1;
		return closingStockPromise();
	}).then(function(result2) {
		finalResult.current = result2;
		deferred.resolve(finalResult);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getInventory(cond) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.find({invenType: cond.type, authorID: cond.authorID, active: true}, {item:0, createdBy:0, creationTime:0, invenType:0, authorID:0, creditDays:0, code:0, paymentType:0, active:0, CGST:0, SGST:0, IGST:0, grossValue:0}, function(err, result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getInventoryById(cond) {
	var deferred = Q.defer();
	schemaObj.inventoryModel.findById(cond.id, function(err, result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getInventoryCode(loginUsr) {
	var deferred = Q.defer();
	var masterElem = {};
	var invenCodePromise = function(){
		return Q.Promise(function(resolve, reject){
			schemaObj.inventoryModel.find({authorID: loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					var cod = 1;
					if(res.length) {
						cod = parseInt(res[0].code) + 1;
					}
					resolve({code: cod});
				}
			});
		});
	}
	var loadMasterPromise = function(codObj) {
		return Q.Promise(function(resolve, reject) {
			schemaObj.masterLedgerGroupModel.find({active:true}, function(err, ret_ledger) {
				if(err) {
					reject(err);
				}
				if(ret_ledger) {
					for(var i = 0; i < ret_ledger.length; i++){
						if(ret_ledger[i].name == "Direct Expenses"){
							for(var j=0; j<ret_ledger[i].subName.length; j++){
								if(ret_ledger[i].subName[j].name == "Purchase Account"){
									masterElem.purchase = ret_ledger[i].subName[j]._id;
								}
							}
						}
						if(ret_ledger[i].name == "Direct Income"){
							for(var j=0; j<ret_ledger[i].subName.length; j++){
								if(ret_ledger[i].subName[j].name == "Sales Account"){
									masterElem.sales = ret_ledger[i].subName[j]._id;
								}
							}
						}
						if(ret_ledger[i].name == "Current Liabilities"){
							for(var j=0; j<ret_ledger[i].subName.length; j++){
								if(ret_ledger[i].subName[j].name == "Duties & Taxes"){
									masterElem.duty = ret_ledger[i].subName[j]._id;
								}
							}
						}
					}
					schemaObj.masterFinYearModel.find({authorID: loginUsr.authorID, active:true}, function(err1, ret_finyear) {
						if(err1) {
							reject(err1);
						}
						if(ret_finyear) {
							var finInd = ret_finyear.findIndex(x => x.status === true);
							if(finInd >= 0) {
								masterElem.year = ret_finyear[finInd]._id;
							}
							resolve(codObj);
						}
					});
				}
			});
		});
	}
	var ledgerCreationPromise = function(codObj) {
		var purchaseLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code:"purchase", authorID: loginUsr.authorID}, {name:"Purchase Account", code:"purchase", active:true, authorID: loginUsr.authorID, createdBy: loginUsr._id, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID: loginUsr.authorID}, {ledgerGroup: masterElem.purchase, finYear: masterElem.year, credit:0, debit:0, refId: res._id, refType: 'ledgerIndividual', code: "purchase", active: true, authorID: loginUsr.authorID, createdBy: loginUsr._id, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId:res1._id}, {type: 'o', ledgerId: res1._id, credit: 0, debit: 0, finYear: masterElem.year, refDate: moment(new Date()).format('YYYY-MM-DD'), authorID: loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2){
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var inputIgstLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code: "inputIGST", authorID: loginUsr.authorID}, {name: "Input IGST", code: "inputIGST", active: true, authorID: loginUsr.authorID, createdBy: loginUsr._id, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code: "inputIGST", authorID: loginUsr.authorID}, {ledgerGroup: masterElem.duty, finYear: masterElem.year, credit: 0, debit: 0, refId: res._id, refType: 'ledgerIndividual', code: "inputIGST", active: true, authorID: loginUsr.authorID, createdBy: loginUsr._id, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId: res1._id}, {type: 'o', ledgerId: res1._id, credit: 0, debit: 0, finYear: masterElem.year, refDate: moment(new Date()).format('YYYY-MM-DD'), authorID: loginUsr.authorID, active: true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var inputCgstLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code: "inputCGST", authorID: loginUsr.authorID}, {name: "Input CGST", code: "inputCGST", active: true, authorID: loginUsr.authorID, createdBy: loginUsr._id, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code: "inputCGST", authorID: loginUsr.authorID}, {ledgerGroup: masterElem.duty, finYear: masterElem.year, credit: 0, debit: 0, refId: res._id, refType: 'ledgerIndividual', code: "inputCGST", active: true, authorID: loginUsr.authorID, createdBy: loginUsr._id, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId: res1._id}, {type: 'o', ledgerId: res1._id, credit: 0, debit: 0, finYear: masterElem.year, refDate: moment(new Date()).format('YYYY-MM-DD'), authorID: loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var inputSgstLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code: "inputSGST", authorID: loginUsr.authorID}, {name:"Input SGST", code:"inputSGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code: "inputSGST", authorID: loginUsr.authorID}, {ledgerGroup:masterElem.duty, finYear:masterElem.year, credit:0, debit:0, refId: res._id, refType:'ledgerIndividual', code:"inputSGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId:res1._id}, {type:'o', ledgerId:res1._id, credit:0, debit:0, finYear:masterElem.year, refDate:moment(new Date()).format('YYYY-MM-DD'), authorID:loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var salesLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {$set: {name:"Sales Account", code:"sales", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {ledgerGroup:masterElem.sales, finYear:masterElem.year, credit:0, debit:0, refId: res._id, refType:'ledgerIndividual', code:"sales", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId:res1._id}, {type:'o', ledgerId:res1._id, credit:0, debit:0, finYear:masterElem.year, refDate:moment(new Date()).format('YYYY-MM-DD'), authorID:loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var outputSgstLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {name:"Output SGST", code:"outputSGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {ledgerGroup:masterElem.duty, finYear:masterElem.year, credit:0, debit:0, refId: res._id, refType:'ledgerIndividual', code:"outputSGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId:res1._id}, {type:'o', ledgerId:res1._id, credit:0, debit:0, finYear:masterElem.year, refDate:moment(new Date()).format('YYYY-MM-DD'), authorID:loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var outputCgstLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {name:"Output CGST", code:"outputCGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {ledgerGroup:masterElem.duty, finYear:masterElem.year, credit:0, debit:0, refId: res._id, refType:'ledgerIndividual', code:"outputCGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId:res1._id}, {type:'o', ledgerId:res1._id, credit:0, debit:0, finYear:masterElem.year, refDate:moment(new Date()).format('YYYY-MM-DD'), authorID:loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2) {
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		var outputIgstLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerIndividualModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {name:"Output IGST", code:"outputIGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {ledgerGroup:masterElem.duty, finYear:masterElem.year, credit:0, debit:0, refId: res._id, refType:'ledgerIndividual', code:"outputIGST", active:true, authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss')}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							schemaObj.ledgerEntryModel.findOneAndUpdate({ledgerId:res1._id}, {type:'o', ledgerId:res1._id, credit:0, debit:0, finYear:masterElem.year, refDate:moment(new Date()).format('YYYY-MM-DD'), authorID:loginUsr.authorID, active:true}, {upsert:true, new:true}, function(err2, res2){
								if(err2) {
									console.log(err2);
									reject(err2);
								}
								if(res2) {
									resolve(codObj);
								}
							});
						}
					});
				}
			});
		});
		return Q.Promise(function(resolve, reject){
			Promise.all([purchaseLedgerPromise, inputIgstLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise, salesLedgerPromise, outputIgstLedgerPromise, outputCgstLedgerPromise, outputSgstLedgerPromise]).then(function(data) {
				resolve(codObj);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	invenCodePromise().then(function(codObj) {
		if(codObj.code == 1) {
			return loadMasterPromise(codObj);
		} else {
			return codObj;
		}
	}).then(function(codObj) {
		if(codObj.code == 1) {
			return ledgerCreationPromise(codObj);
		} else {
			return codObj;
		}
	}).then(function(resObj) {
		deferred.resolve(resObj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

// function service_getPurchaseOrder() {
// 	var deferred = Q.defer();
// 	var loginUser = userService.loginUser();
// 	schemaObj.psOrderModel.find({'orderType': 'p', authorID: loginUser.authorID}, function(err, result){
// 	    if(err){
// 			deferred.reject(err.name + ': ' + err.message);
// 		}
// 		if(result){
// 			deferred.resolve(result);
// 		}
// 	});
// 	return deferred.promise;
// }

// function service_getSalesOrder() {
// 	var deferred = Q.defer();
// 	var loginUser = userService.loginUser();
// 	schemaObj.psOrderModel.find({'orderType': 's', authorID: loginUser.authorID}, function(err, result){
// 	    if(err) {
// 	    	console.log(err)
// 			deferred.reject(err);
// 		}
// 		if(result) {
// 			deferred.resolve(result);
// 		}
// 	});
// 	return deferred.promise;
// }

function service_activateIMEI(IMEIobj,loginUsr) {
	var deferred = Q.defer();
	var imeiInvalid = [];
	var stockStatusPromise = function(IMEIvalues) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.stockStatusModel.update({'IMEINumber.IMEI': {$in: [IMEIvalues.imei]}},{$pull: {'IMEINumber': {'IMEI': {$in: [IMEIvalues.imei]}}},$inc: {quantity: -1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var IMEIpromise = function(IMEIvalues) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.IMEImodel.update({'IMEI': {$in: [IMEIvalues.imei]}},{$push: {customer: IMEIvalues},activeDate: moment(new Date(IMEIvalues.date)).format('YYYY-DD-MM'),position: 'C',active: true,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					if(res.nModified == 0) {
						imeiInvalid.push(IMEIvalues);
					}
					resolve(res);
				}
			});
		});
	}
	Promise.all(IMEIobj.map(stockStatusPromise))
	.then(function(stockRes) {
		return Promise.all(IMEIobj.map(IMEIpromise));
	}).then(function(imeiRes) {
		if(imeiInvalid.length == 0){
			deferred.resolve({valid: imeiRes});
		} else {
			deferred.resolve({invalid: imeiInvalid});
		}
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getRDSstockSummary(obj,loginUsr) {
	var deferred = Q.defer();
	// var mainAuthor = userService.loginAuthorRefID(loginUsr);
	schemaObj.stockStatusModel.find({authorID: {$ne: loginUsr.authorID}, salePoint: {$exists: true}}, function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getDealerStockSummary(obj) {
	var deferred = Q.defer();
	schemaObj.stockStatusModel.find({salePoint: undefined}, function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getIMEIinventory(obj) {
	var deferred = Q.defer();
	var condition = {};
	if(obj.ids.length == 1){
		condition = {_id: obj.ids[0]};
	} else{
		condition = {_id: {$in: obj.ids}};
	}
	schemaObj.inventoryModel.find(condition,{invoiceNumber: 1,invoiceDate: 1,party: 1,partyType: 1},function(err,res) {
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

function service_getIMEIboxNumber(obj) {
	var deferred = Q.defer();
	schemaObj.stockStatusModel.find({name: obj.item, salePoint: obj.sp
	// aggregate([
	// 	{
	// 		$match: {name: ObjectId(obj.item),salePoint: ObjectId(obj.sp)}
	// 	},
	// 	{
	// 		$unwind: '$IMEINumber'
	// 	},
	// 	{
	// 		$group: {
	// 			_id: '$_id',
	// 			boxno: { $addToSet: "$IMEINumber.boxno" } 
	// 		}
	// 	}
	// ]
	},function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result){
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_IMEIstatus(obj,loginUsr) {
	var deferred = Q.defer();
	var imeiSplit = obj.number.split('*');
	var condition = {};
	if(loginUsr.userType == 'd') {
		if(imeiSplit.length == 1) {
			condition = {IMEI: {$in: [imeiSplit[0]]},'rds.author': loginUsr.authorID};
		} else{
			condition = {IMEI: {$regex: imeiSplit[1]},'rds.author': loginUsr.authorID};
		}
	} else {
		if(imeiSplit.length == 1) {
			condition = {IMEI: {$in: [imeiSplit[0]]}};
		} else{
			condition = {IMEI: {$regex: imeiSplit[1]}};
		}
	}
	schemaObj.IMEImodel.find(condition,function(err,res) {
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

function service_IMEIduplication(obj) {
	var deferred = Q.defer();
	var duplicate = [];
	// VALIDATION 1
	schemaObj.IMEImodel.find({IMEI: {$in: obj.uploadIMEI}},function(err,res) {
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

function service_rdsTertiarySummary(obj) {
	var deferred = Q.defer();
	for(var i=0; i<obj.item.length; i++) {
		obj.item[i] = ObjectId(obj.item[i]);
	}
	schemaObj.IMEImodel.aggregate([
		{
			$match: {
				active: true,
				activeDate : {
					$gte: obj.start,
					$lte: obj.end
				},
				model: {$in: obj.item}
			}
		},
		{
			$project:{
				model: 1,
				rds: {
					$slice: ['$rds', -1]
				},
				dealer: {
					$slice: ['$dealer', -1]
				}
			}
		},
		{
			$group:{
				'_id': {model: "$model",'rds': "$rds.author",'dealer': "$dealer.author"},
				'quantity': {$sum: 1}
			}
		}
	]
	,function(err,res) {
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

function service_addSalesReturn(salObj,loginUsr){
	var deferred = Q.defer();
	salObj.invenType = 'sr';
	salObj.authorID = loginUsr.authorID;
	salObj.createdBy = loginUsr._id;
	salObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	salObj.modifiedBy = loginUsr._id;
	salObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	salObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	salObj.active = true;
	var saleClone = JSON.parse(JSON.stringify(salObj));
	salObj.partyType = "dealer";
	var salresRef = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(salObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				} 
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var ledgerEntryPromise = function(retSalObj) {
		return Q.Promise(function(resolve, reject) {
			var partic = 'salesReturn-' + retSalObj.invoiceNumber;
			schemaObj.ledgerEntryModel.create({authorID: loginUsr.authorID,credit: saleClone.ledgerEntry.credit,ledgerId: saleClone.ledgerEntry.ledgerId,particulars: partic,refIdType: 'inventory',refId: retSalObj._id,finYear: saleClone.ledgerEntry.finYear,createdBy: loginUsr._id,creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss'),active: true},function(err, result) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(retSalObj);
			});
		});
	}
	var stockStatusPromise = function(ret_retSalObj) {
		return Q.Promise(function(resolve,reject) {
			var saleDate = saleClone.invoiceDate;
			var promisePool = saleClone.item.map(function(saleRes) {
				var IMEINum = [];
				if(saleRes.IMEINumber) {
					if(loginUsr.userType === 'b'){
						IMEINum = saleRes.IMEINumber.map(a => a.IMEI);
					} else {
						IMEINum = saleRes.IMEINumber;
						schemaObj.IMEImodel.updateMany({IMEI: {$in: IMEINum.map(a => a.IMEI)}},{$push: {rds: {author: loginUsr.authorID,date: saleDate,refID: ret_retSalObj._id}}},function(imeierr,imeires) {
							if(imeierr) {
								console.log(imeierr);
							}
						});
					}
				}
				schemaObj.stockStatusModel.findOneAndUpdate({authorID: loginUsr.authorID, name: saleRes.name,salePoint: saleClone.salePoint},{ $inc: {quantity: +saleRes.quantity},$push: {IMEINumber: { $each: IMEINum}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
					if(result) {
						schemaObj.stockStatusModel.findOneAndUpdate({authorID: saleClone.dealerUserID,name: saleRes.name},{$inc: {quantity: -saleRes.quantity},$pull: {IMEINumber: {IMEI: {$in: IMEINum.map(a => a.IMEI)}}},name: saleRes.name,authorID: saleClone.dealerUserID,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},{upsert: true,new: true},function(err1,res) {
							if(res) {
								return res;
							}
						});
					}
				});
			});
			Q.all(promisePool)
			.then(function(data) {
				resolve(ret_retSalObj);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var ledgerPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({_id: saleClone.ledgerEntry.ledgerId},{$inc: {credit: +saleClone.ledgerEntry.credit},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err, result) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(result);
			});
		});
	}
	inventoryPromise()
	.then(function(retSalObj) {
		salresRef = JSON.parse(JSON.stringify(retSalObj));
		return Q.Promise(function(resolve, reject) {
			resolve(ledgerEntryPromise(retSalObj));
		});
	})
	.then(function(ret_retSalObj) {
		return Q.Promise(function(resolve, reject) {
			resolve(stockStatusPromise(ret_retSalObj));
		});
	})
	.then(function(ret_stocks_retSalObj) {
		return Q.Promise(function(resolve, reject) {
			resolve(ledgerPromise(ret_stocks_retSalObj));
		});
	})
	.then(function(data) {
		deferred.resolve(data);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_deleteRDSsaleInvoice(reqObj,loginUsr) {
	var deferred = Q.defer();
	var imeiNumbers = [];
	for(var i=0; i<reqObj.item.length; i++) {
		if(reqObj.item[i].name.IMEINumLen){
			imeiNumbers = imeiNumbers.concat(reqObj.item[i].IMEINumber.map(a => a.IMEI));
		}
	}
	var checkIMEIpromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.IMEImodel.find({IMEI: {$in: imeiNumbers},active: true},function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var stockStatusPromise = function() {
		var promisePool = function(reqRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(reqRes.IMEINumber) {
					IMEINum = reqRes.IMEINumber;
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{$pop: {dealer: 1},position: 'R',modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							reject(imeierr);
						}
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID, 'name': reqRes.name._id,'salePoint': reqObj.salePoint._id},{$inc: {'quantity': +reqRes.quantity},$push: {'IMEINumber': {$each: IMEINum}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(result) {
						schemaObj.stockStatusModel.findOneAndUpdate({'authorID': reqObj.dealerUserID,'name': reqRes.name._id},{$inc: {'quantity': -reqRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err1,res) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res) {
								resolve(res);
							}
						});
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(reqObj.item.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var disablePromise = function() {
		var salesPromise = new Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id:reqObj._id}, {active:false, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		var clientLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:reqObj.party._id}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.netValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active: false}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var salesAccountLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.grossValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(reqObj.IGST != undefined) {
			var outputIgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.IGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([salesPromise, clientLedgerPromise, salesLedgerPromise, outputIgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var outputCgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.CGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active: false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var outputSgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.SGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([salesPromise, clientLedgerPromise, salesAccountLedgerPromise, outputCgstLedgerPromise, outputSgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	checkIMEIpromise()
	.then(function(resultObj) {
		if(resultObj.length) {
			return {status: 'Not Deleted'};
		} else {
			return stockStatusPromise();
		}
	})
	.then(function(stockObj) {
		if(stockObj.status) {
			return {status: 'Not Deleted'};
		} else {
			return disablePromise();
		}
	})
	.then(function(ledgerObj) {
		if(ledgerObj.status) {
			deferred.resolve({status: 'Not Deleted'});
		} else {
			deferred.resolve({status: 'Deleted'});
		}
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_deleteRDSpurchaseInvoice(reqObj,loginUsr) {
	var deferred = Q.defer();
	var imeiNumbers = [];
	var soldInvoice;
	for(var i=0; i<reqObj.item.length; i++) {
		if(reqObj.item[i].name.IMEINumLen) {
			imeiNumbers = imeiNumbers.concat(reqObj.item[i].IMEINumber.map(a => a.IMEI));
		}
	}
	var checkIMEIpromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.find({authorID: loginUsr.authorID,'$or': [{invenType: 's'},{invenType: 't'}],'item.IMEINumber.IMEI': {$in: imeiNumbers},active: true},function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					soldInvoice = res;
					resolve(res);
				}
			});
		});
	}
	var stockStatusPromise = function() {
		return Q.Promise(function(resolve,reject) {
			var promises = [];
			_.forEach(reqObj.item, function(reqRes) {
				var IMEINum = [];
				if(reqRes.IMEINumber) {
					IMEINum = reqRes.IMEINumber;
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{position: 'B',$pop: {rds: 1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							reject(imeierr);
						}
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({'authorID': reqObj.authorID,'name': reqRes.name._id,'salePoint': reqObj.salePoint._id},{$inc: {'quantity': -reqRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						promises.push(res);
					}
				});
			});
			Q.all(promises).then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var disablePromise = function() {
		var purchasePromise = new Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id:reqObj._id}, {active:false, $unset: {ackID: ""}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
					schemaObj.inventoryModel.findOneAndUpdate({_id: reqObj.ackID},{$unset: {ack: ""},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res);
						}
					});
				}
			});
		});
		var supplierLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:reqObj.party._id}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.netValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var purchaseAccountLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.grossValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(reqObj.IGST != undefined) {
			var inputIgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.IGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([purchasePromise, supplierLedgerPromise, purchaseAccountLedgerPromise, inputIgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var inputCgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.CGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var inputSgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.SGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([purchasePromise, supplierLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	checkIMEIpromise().then(function(resultObj) {
		if(resultObj.length) {
			return {status: 'Not Deleted'};
		} else {
			return stockStatusPromise();
		}
	})
	.then(function(stockObj) {
		if(stockObj.status) {
			return {status: 'Not Deleted'};
		} else {
			return disablePromise();
		}
	})
	.then(function(ledgerObj) {
		if(ledgerObj.status) {
			deferred.resolve(soldInvoice);
		} else {
			deferred.resolve({status: 'Deleted'});
		}
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_deleteBrandSaleInvoice(reqObj,loginUsr) {
	var deferred = Q.defer();
	var stockStatusPromise = function() {
		var promisePool = function(reqRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(reqRes.IMEINumber) {
					IMEINum = reqRes.IMEINumber;
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{position: 'B',$pop: {sales: 1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							reject(imeierr);
						}
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID, 'name': reqRes.name._id,'salePoint': reqObj.salePoint._id},{$inc: {'quantity': +reqRes.quantity},$push: {'IMEINumber': {$each: IMEINum}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(reqObj.item.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var disablePromise = function() {
		var salesPromise = new Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id:reqObj._id}, {active:false, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		var clientLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:reqObj.party._id}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.netValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active: false}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var salesAccountLedgerPromise = new Promise(function(resolve,reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.grossValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(reqObj.IGST != undefined) {
			var outputIgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.IGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([salesPromise, clientLedgerPromise, salesLedgerPromise, outputIgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var outputCgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.CGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active: false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var outputSgstLedgerPromise = new Promise(function(resolve,reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.SGST}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([salesPromise, clientLedgerPromise, salesAccountLedgerPromise, outputCgstLedgerPromise, outputSgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	stockStatusPromise().then(function() {
		return disablePromise();
	}).then(function() {
		deferred.resolve({status: 'Deleted'});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_deleteBrandPurchaseInvoice(reqObj, loginUsr) {
	var deferred=Q.defer(), imeiNumbers=[], soldInvoice=[], rj=[];
	for(var i=0; i<reqObj.item.length; i++) {
		if(reqObj.item[i].IMEINumber) {
			imeiNumbers = imeiNumbers.concat(reqObj.item[i].IMEINumber.map(a => a.IMEI));
		}
	}
	var checkIMEIpromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.find({authorID:loginUsr.authorID, active:true, '$and': [{invenType: {$ne:'p'}},{invenType: {$ne:'pdc'}}], 'item.IMEINumber.IMEI':{$in:imeiNumbers}}, {item:0, authorID:0, category:0}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					soldInvoice = res;
					resolve(res);
				}
			});
		});
	}
	var stockStatusPromise = function() {
		var promisePool = function(reqRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(reqObj.dcID) {
					if(reqRes.IMEINumber) {
						IMEINum = reqRes.IMEINumber;
						schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{$pop: {brand: 1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
							if(imeierr) {
								console.log(imeierr);
								reject(imeierr);
							}
							if(imeires) {
								resolve(reqRes);
							}
						});
					} else {
						resolve(reqRes);
					}
				} else {
					if(reqRes.IMEINumber) {
						IMEINum = reqRes.IMEINumber;
						schemaObj.IMEImodel.remove({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},function(imeierr, imeires) {
							if(imeierr) {
								console.log(imeierr);
								reject(imeierr);
							}
						});
					}
					schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID,'name': reqRes.name._id,'salePoint': reqObj.salePoint._id},{$inc: {'quantity': -reqRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,res) {
						if(err) {
							console.log(err);
							reject(err);
						}
						if(res) {
							resolve(res);
						}
					});
				}
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(reqObj.item.map(promisePool)).then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var disablePromise = function() {
		var purchasePromise = new Promise(function(resolve, reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id:reqObj._id}, {active:false, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
		var supplierLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:reqObj.party._id}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:-reqObj.netValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var purchaseAccountLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.grossValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(reqObj.IGST != undefined) {
			var inputIgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.IGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([purchasePromise, supplierLedgerPromise, purchaseAccountLedgerPromise, inputIgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else{
			var inputCgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.CGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1){
								resolve(res1);
							}
						});
					}
				});
			});
			var inputSgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:-reqObj.SGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:reqObj._id, ledgerId:res._id}, {active:false}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([purchasePromise, supplierLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var dcPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOne({_id:reqObj.dcID}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					var totQty = 0, itemClone = res.item;
					for(var i=0; i<itemClone.length; i++) {
						itemClone[i].name = itemClone[i].name._id;
					}
					for(var i=0; i<reqObj.item.length; i++) {
						for(var j=0; j<itemClone.length; j++) {
							if(reqObj.item[i].name._id == itemClone[j].name) {
								if(reqObj.item[i].IMEINumber) {
									itemClone[j].IMEINumber = itemClone[j].IMEINumber.concat(reqObj.item[i].IMEINumber);
								}
								itemClone[j].quantity = itemClone[j].quantity + reqObj.item[i].quantity;
								totQty = totQty + reqObj.item[i].quantity;
							}
						}
					}
					schemaObj.inventoryModel.findOneAndUpdate({_id:reqObj.dcID}, {item:itemClone, $inc:{totalQuantity:+totQty}, $pull:{invenID: {$in:[reqObj._id]}}}, function(err, res) {
						if(err) {
							console.log(err);
							reject(err);
						}
						if(res) {
							resolve(res);
						}
					});
				}
			});
		});
	}
	vouchersService.getRJinvoice({id:reqObj._id, credit:1}, loginUsr).then(function(rejRes) {
		rj = rejRes;
		return checkIMEIpromise();
	}).then(function(resultObj) {
		if((resultObj.length) && (rj.length)) {
			return {status: 'Not Deleted'};
		} else {
			return stockStatusPromise();
		}
	}).then(function(stockObj) {
		if(stockObj.status) {
			return {status: 'Not Deleted'};
		} else {
			return disablePromise();
		}
	}).then(function(stockObj) {
		if(stockObj.status) {
			return {status: 'Not Deleted'};
		} else {
			if(reqObj.dcID) {
				return dcPromise();
			} else {
				return reqObj;
			}
		}
	}).then(function(ledgerObj) {
		if(ledgerObj.status) {
			deferred.resolve({invoice:soldInvoice,'rj':rj});
		} else {
			deferred.resolve({status: 'Deleted'});
		}
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_editInvoice(reqObj,loginUsr) {
	var deferred = Q.defer();
	reqObj.modifiedBy = loginUsr._id;
	reqObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	reqObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	var invoClone = JSON.parse(JSON.stringify(reqObj));
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id: reqObj._id},reqObj,function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var purchaseLedgerPromise = function() {
		var supplierLedgerPromise = new Promise(function(resolve,reject) {
			var adjusValue = parseFloat(invoClone.netValue) - parseFloat(invoClone.oldValue.netValue);
			schemaObj.ledgerModel.findOneAndUpdate({refId:invoClone.party._id}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+adjusValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {pending:invoClone.netValue, credit:invoClone.netValue}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var purchaseAccountLedgerPromise = new Promise(function(resolve,reject) {
			var adjusValue = parseFloat(invoClone.grossValue) - parseFloat(invoClone.oldValue.grossValue);
			schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+adjusValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {debit:invoClone.grossValue}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(rr1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(invoClone.IGST != undefined) {
			var inputIgstLedgerPromise = new Promise(function(resolve,reject) {
				var adjusValue = parseFloat(invoClone.IGST) - parseFloat(invoClone.oldValue.IGST);
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+adjusValue}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {debit:invoClone.IGST}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([supplierLedgerPromise, purchaseAccountLedgerPromise, inputIgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var inputCgstLedgerPromise = new Promise(function(resolve,reject) {
				var adjusValue = parseFloat(invoClone.SGST) - parseFloat(invoClone.oldValue.SGST);
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+adjusValue}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {debit:invoClone.SGST}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var inputSgstLedgerPromise = new Promise(function(resolve,reject) {
				var adjusValue = parseFloat(invoClone.SGST) - parseFloat(invoClone.oldValue.SGST);
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+adjusValue}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {debit:invoClone.SGST}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var salesLedgerPromise = function(retSalObj) {
		var clientLedgerPromise = new Promise(function(resolve,reject) {
			var adjusValue = parseFloat(invoClone.netValue) - parseFloat(invoClone.oldValue.netValue);
			schemaObj.ledgerModel.findOneAndUpdate({refId:invoClone.party._id}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+adjusValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {pending: invoClone.netValue, debit:invoClone.netValue}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var salesAccountLedgerPromise = new Promise(function(resolve,reject) {
			var adjusValue = parseFloat(invoClone.grossValue) - parseFloat(invoClone.oldValue.grossValue);
			schemaObj.ledgerModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+adjusValue}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {credit:invoClone.grossValue}, function(err1,res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(invoClone.IGST != undefined) {
			var outputIgstLedgerPromise = new Promise(function(resolve,reject) {
				var adjusValue = parseFloat(invoClone.IGST) - parseFloat(invoClone.oldValue.IGST);
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+adjusValue}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {credit:invoClone.IGST}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([clientLedgerPromise, salesLedgerPromise, outputIgstLedgerPromise])
				.then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var outputCgstLedgerPromise = new Promise(function(resolve,reject) {
				var adjusValue = parseFloat(invoClone.SGST) - parseFloat(invoClone.oldValue.SGST);
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+adjusValue}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {credit:invoClone.SGST}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var outputSgstLedgerPromise = new Promise(function(resolve,reject) {
				var adjusValue = parseFloat(invoClone.SGST) - parseFloat(invoClone.oldValue.SGST);
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+adjusValue}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({refId:invoClone._id, ledgerId:res._id}, {credit:invoClone.SGST}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve,reject) {
				Promise.all([clientLedgerPromise, salesAccountLedgerPromise, outputCgstLedgerPromise, outputSgstLedgerPromise])
				.then(function(data) {
					resolve(retSalObj);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	inventoryPromise().then(function() {
		if(invoClone.invenType == 'p') {
			return purchaseLedgerPromise();
		} else if(invoClone.invenType == 's'){
			return salesLedgerPromise();
		} else{
			return invoClone;
		}
	}).then(function() {
		deferred.resolve(reqObj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_rdsSecondarySummary(obj,loginUsr) {
	var deferred=Q.defer();
	for(var i=0; i<obj.item.length; i++) {
		obj.item[i] = ObjectId(obj.item[i]);
	}
	if(obj['imei'] == 'wod') {
		schemaObj.inventoryModel.aggregate([
			{
				$match: {
					active: true,
					authorID: {
						'$ne': ObjectId(loginUsr.authorID)
					},
					$or: [{invenType: 's'},{invenType: 'sdc'},{invenType: 'pr'}],
					invoiceDate : {
						$gte: obj.start,
						$lte: obj.end
					}
				}
			},
			{
				$unwind: '$item'
			},
			{
				$match: {
					'item.name': {$in: obj.item}
				}
			},
			{
				$project: {
					authorID: 1,
					party: 1,
					'item.name': 1,
					'item.quantity': 1
				}
			},
			{
				$group: {
					_id: {model:'$item.name', authorID:'$authorID'},
					party: {$addToSet: '$party'},
					qty: {$sum: '$item.quantity'}
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	} else {
		var groupObj = {
			_id: {model:'$item.name', authorID:'$authorID', party:'$party'},
			qty: {$sum: '$item.quantity'}
		}
		var projectObj = {
			authorID: 1,
			party: 1,
			'item.name': 1,
			'item.quantity': 1
		}
		if(obj['imei'] == 'imei') {
			groupObj['IMEI'] = { $push: "$item.IMEINumber" };
			projectObj['item.IMEINumber'] = 1;
		}
		schemaObj.inventoryModel.aggregate([
			{
				$match: {
					active: true,
					authorID: {
						'$ne': ObjectId(loginUsr.authorID)
					},
					$or: [{invenType: 's'},{invenType: 'sdc'},{invenType: 'pr'}],
					invoiceDate : {
						$gte: obj.start,
						$lte: obj.end
					}
				}
			},
			{
				$unwind: '$item'
			},
			{
				$match: {
					'item.name': {$in: obj.item}
				}
			},
			{
				$project: projectObj
			},
			{
				$group: groupObj
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	}
	return deferred.promise;
}

function service_addSalesBills(obj,loginUsr) {
	var deferred = Q.defer();
	var saleBillPromise = function(saleObj) {
		saleObj.invenType = 's';
		saleObj.partyType = "dealer";
		saleObj.authorID = loginUsr.authorID;
		saleObj.createdBy = loginUsr._id;
		saleObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
		saleObj.modifiedBy = loginUsr._id;
		// saleObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		// saleObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
		saleObj.active = true;
		var saleClone = JSON.parse(JSON.stringify(saleObj));
		var inventoryPromise = function() {
			return Q.Promise(function(resolve,reject) {
				schemaObj.inventoryModel.create(saleObj, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					resolve(res);
				});
			});
		}
		var ledgerEntryPromise = function(retSalObj) {
			return Q.Promise(function(resolve,reject) {
				var partic = 'sales-' + retSalObj.invoiceNumber;
				schemaObj.ledgerEntryModel.create({'authorID': loginUsr.authorID,'debit': saleClone.netValue,pending: saleClone.netValue,received: 0,'ledgerId': saleClone.ledgerID,particulars: partic,'refIdType': 'inventory','refId': retSalObj._id,'finYear': obj.finYear,createdBy: loginUsr._id,creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss'),'active': true},function(err,result) {
					if(err) {
						console.log(err);
						reject(err);
					}
					resolve(retSalObj);
				});
			});
		}
		var stockStatusPromise = function(ret_retSalObj) {
			var saleDate = saleClone.billDate;
			var promisePool = function(saleRes) {
				var IMEINum = [];
				if(saleRes.IMEINumber) {
					IMEINum = saleRes.IMEINumber;
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{$push: {'dealer': {'author': saleClone.dealerID,'date': saleDate,'refID': ret_retSalObj._id}},modifiedBy: loginUsr._id,position: 'D',modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
						}
					});
					IMEINum.map((obj) => {
						obj.ss = saleDate;
						return obj;
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID, 'name': saleRes.name,'salePoint': saleClone.salePoint},{ $inc: {'quantity': -saleRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
					if(result) {
						schemaObj.stockStatusModel.findOneAndUpdate({'authorID': saleClone.dealerID,'name': saleRes.name},{ $inc: {'quantity': +saleRes.quantity}, $push: {'IMEINumber': { $each: IMEINum}},'name': saleRes.name,'authorID': saleClone.dealerID,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},{upsert: true,new: true},function(err1,res) {
							if(res) {
								return res;
							}
						});
					}
				});
			}
			return Q.Promise(function(resolve,reject) {
				Promise.all(saleObj.item.map(promisePool))
				.then(function(data) {
					resolve(ret_retSalObj);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
		var ledgerPromise = function(ret_stocks_retSalObj) {
			return Q.Promise(function(resolve,reject) {
				schemaObj.ledgerModel.update({authorID: loginUsr.authorID,_id: saleClone.ledgerID},{$inc: {'debit': +saleClone.netValue},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
					if(err) {
						console.log(err);
						reject(err);
					}
					resolve(ret_stocks_retSalObj);
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			inventoryPromise()
			.then(function(retSalObj) {
				return ledgerEntryPromise(retSalObj);
			})
			.then(function(ret_retSalObj) {
				return stockStatusPromise(ret_retSalObj);
			})
			.then(function(ret_stocks_retSalObj) {
				return ledgerPromise(ret_stocks_retSalObj)
			})
			.then(function(data) {
				resolve(data);
			})
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	Promise.all(obj.bills.map(saleBillPromise))
	.then(function(resultObj) {
		deferred.resolve(resultObj);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_primarySales(obj, loginUsr) {
	var deferred=Q.defer();
	var primarySalePromise = function(purObj) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.salesReportModel.findOneAndUpdate({clientID:loginUsr.refID._id, type:'ps', 'item.name':purObj.name}, {$inc:{'item.$.quantity': +purObj.quantity}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				} else {
					schemaObj.salesReportModel.findOneAndUpdate({clientID:loginUsr.refID._id, type:'ps'}, {$push:{item:{name:purObj.name, quantity:purObj.quantity}}, clientID:loginUsr.refID._id, type:'ps'}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
	}
	Promise.all(obj.map(primarySalePromise)).then(function(resultObj) {
		deferred.resolve(resultObj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_secondarySales(obj, loginUsr) {
	var deferred=Q.defer();
	var secondarySalePromise = function(purObj) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.salesReportModel.findOneAndUpdate({clientID:loginUsr.refID._id, type:'ss', 'item.name':purObj.name}, {$inc:{'item.$.quantity': +purObj.quantity}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				} else {
					schemaObj.salesReportModel.findOneAndUpdate({clientID:loginUsr.refID._id, type:'ss'}, {$push:{item:{name:purObj.name, quantity:purObj.quantity}}, clientID:loginUsr.refID._id, type:'ss'}, {upsert:true, new:true}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						} else {
							console.log(' **** Not **** ');
						}
					});
				}
			});
		});
	}
	Promise.all(obj.item.map(secondarySalePromise)).then(function() {
		deferred.resolve(obj.retObj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getRdsSalesReport(obj) {
	var deferred = Q.defer();
	schemaObj.salesReportModel.find({type:obj.type}, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_rdsPrimarySummary(obj,loginUsr) {
	var deferred=Q.defer();
	var groupObj = {
		_id: {model:'$item.name', authorID:'$authorID'},
		qty: {$sum: '$item.quantity'}
	}
	var projectObj = {
		authorID: 1,
		party: 1,
		'item.name': 1,
		'item.quantity': 1
	}
	if(obj['imei']) {
		groupObj['IMEI'] = { $push: "$item.IMEINumber" };
		projectObj['item.IMEINumber'] = 1;
	}
	for(var i=0; i<obj.item.length; i++) {
		obj.item[i] = ObjectId(obj.item[i]);
	}
	schemaObj.inventoryModel.aggregate([
		{
			$match: {
				authorID: {
					'$ne': ObjectId(loginUsr.authorID)
				},
				active: true,
				$or: [{invenType: 'p'},{invenType: 'sr'}, {invenType: 'pdc'}],
				invoiceDate : {
					$gte: obj.start,
					$lte: obj.end
				}
			}
		},
		{
			$unwind: '$item'
		},
		{
			$match: {
				'item.name': {$in: obj.item}
			}
		},
		{
			$project: projectObj
		},
		{
			$group: groupObj
		}
	],function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_addPurchaseDc(purObj, loginUsr) {
	var deferred = Q.defer();
	purObj.createdBy = loginUsr._id;
	purObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	purObj.active = true;
	purObj.partyType = "master_supplier";
	purObj.invenType = 'pdc';
	purObj.authorID = loginUsr.authorID;
	var purClone = JSON.parse(JSON.stringify(purObj)), purREFid = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(purObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var stockStatusPromise = function() {
		var promisePool = function(purRes) {
			return Q.Promise(function(resolve, reject) {
				var IMEINum = [];
				if(purRes.IMEINumber) {
					for (var i = 0; i < purRes.IMEINumber.length; i++) {
						IMEINum.push({IMEI: purRes.IMEINumber[i].IMEI,active: false,createdBy: loginUsr._id,pp: purClone.invoiceDate, creationTime: moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'),model: purRes.name,pdc: [{date: purClone.invoiceDate,refID: purREFid._id,author: loginUsr.authorID}],position: 'B'});
					}
					schemaObj.IMEImodel.insertMany(IMEINum, function(imeierr, imeires) {
						if(imeierr){
							console.log(imeierr);
							console.log(imeierr);
						}
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({authorID:loginUsr.authorID, name:purRes.name, salePoint:purClone.salePoint}, {$inc:{quantity:+purRes.quantity}, $push:{IMEINumber:{$each: IMEINum}}, name:purRes.name, salePoint:purClone.salePoint, authorID:loginUsr.authorID, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')},{upsert:true, new:true}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(purClone.item.map(promisePool)).then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(res);
				reject(err);
			});
		});
	}
	inventoryPromise().then(function(retpurObj) {
		purREFid = JSON.parse(JSON.stringify(retpurObj));
		return stockStatusPromise();
	}).then(function() {
		deferred.resolve(purREFid);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_addPurchaseDcBill(invObj, loginUsr) {
	var deferred = Q.defer(), purObj = invObj.pur;
	purObj.createdBy = loginUsr._id;
	purObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	purObj.active = true;
	purObj.partyType = "master_supplier";
	purObj.invenType = 'p';
	purObj.dcID = invObj.dc._id;
	purObj.authorID = loginUsr.authorID;
	var purClone = JSON.parse(JSON.stringify(purObj)), purREFid = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(purObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var ledgerPromise = function() {
		var supplierLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:purClone.party}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+purClone.netValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:purClone.netValue, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate, pending:purClone.netValue, received:0}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var purchaseLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"purchase", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.grossValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.grossValue, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(purClone.IGST != undefined) {
			var inputIgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.IGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.IGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputIgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else{
			var inputCgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.CGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res){
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.CGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var inputSgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"inputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+purClone.SGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:purClone.SGST, refId:purREFid._id, refIdType:'inventory', finYear:purClone.finYear, active:true, type:'p', refDate:purClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([supplierLedgerPromise, purchaseLedgerPromise, inputCgstLedgerPromise, inputSgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var stockStatusPromise = function() {
		var promisePool = function(purRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(purRes.IMEINumber) {
					IMEINum = purRes.IMEINumber.map(a => a.IMEI);
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum}},{$push: {'brand': {author: loginUsr.authorID,date: purClone.invoiceDate,refID: purREFid._id}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							reject(imeierr);
						}
						if(imeires) {
							resolve(purRes);
						}
					});
				} else {
					resolve(purRes);
				}
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(purClone.item.map(promisePool)).then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var dcPromise = function() {
		return Q.Promise(function(resolve,reject) {
			var totQty = 0, itemClone = invObj.dc.item;
			for(var i=0; i<itemClone.length; i++) {
				itemClone[i].name = itemClone[i].name._id;
			}
			for(var i=0; i<invObj.pur.item.length; i++) {
				for(var j=0; j<itemClone.length; j++) {
					if(invObj.pur.item[i].name === itemClone[j].name) {
						if(invObj.pur.item[i].IMEINumber) {
							for(var k=0; k<invObj.pur.item[i].IMEINumber.length; k++) {
								for(var l=0; l<itemClone[j].IMEINumber.length; l++) {
									var imeiIndex = itemClone[j].IMEINumber[l].IMEI.indexOf(invObj.pur.item[i].IMEINumber[k].IMEI[0]);
									if(imeiIndex >= 0) {
										itemClone[j].IMEINumber.splice(l, 1);
										break;
									}
								}
							}
						}
						itemClone[j].quantity = itemClone[j].quantity - invObj.pur.item[i].quantity;
						totQty = totQty + invObj.pur.item[i].quantity;
					}
				}
			}
			schemaObj.inventoryModel.findOneAndUpdate({_id:invObj.dc._id}, {item:itemClone, $inc:{totalQuantity:-totQty}, $push:{invenID:purREFid._id}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	inventoryPromise().then(function(retpurObj) {
		purREFid = JSON.parse(JSON.stringify(retpurObj));
		return ledgerPromise();
	}).then(function() {
		return stockStatusPromise();
	}).then(function() {
		return dcPromise();
	}).then(function() {
		deferred.resolve(purREFid);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_addSaleDcBill(invObj, loginUsr) {
	var deferred = Q.defer(), saleObj = invObj.sale;
	saleObj.createdBy = loginUsr._id;
	saleObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	saleObj.active = true;
	saleObj.partyType = "dealer";
	saleObj.invenType = 's';
	saleObj.dcID = invObj.dc._id;
	saleObj.authorID = loginUsr.authorID;
	var saleClone = JSON.parse(JSON.stringify(saleObj)), salresRef = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(saleObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var ledgerPromise = function(retSalObj) {
		var clientLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({refId:saleClone.party}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {debit:+saleClone.netValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, debit:saleClone.netValue, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate, pending:saleClone.netValue, received:0}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		var salesLedgerPromise = new Promise(function(resolve, reject) {
			schemaObj.ledgerModel.findOneAndUpdate({code:"sales", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.grossValue}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.grossValue, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
						if(err1) {
							console.log(err1);
							reject(err1);
						}
						if(res1) {
							resolve(res1);
						}
					});
				}
			});
		});
		if(saleClone.IGST != undefined){
			var outputIgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputIGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.IGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.IGST, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([clientLedgerPromise, salesLedgerPromise, outputIgstLedgerPromise]).then(function(data) {
					resolve(data);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		} else {
			var outputCgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputCGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.CGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.CGST, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			var outputSgstLedgerPromise = new Promise(function(resolve, reject) {
				schemaObj.ledgerModel.findOneAndUpdate({code:"outputSGST", authorID:loginUsr.authorID}, {modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss'),$inc: {credit:+saleClone.SGST}}, function(err, res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.create({authorID:loginUsr.authorID, ledgerId:res._id, credit:saleClone.SGST, refId:salresRef._id, refIdType:'inventory', finYear:saleClone.finYear, active:true, type:'s', refDate:saleClone.invoiceDate}, function(err1, res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
			return Q.Promise(function(resolve, reject) {
				Promise.all([clientLedgerPromise, salesLedgerPromise, outputCgstLedgerPromise, outputSgstLedgerPromise]).then(function(data) {
					resolve(retSalObj);
				}).catch(function(err) {
					console.log(err);
					reject(err);
				});
			});
		}
	}
	var stockStatusPromise = function() {
		var promisePool = function(salRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(salRes.IMEINumber) {
					IMEINum = salRes.IMEINumber.map(a => a.IMEI);
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum}},{$push: {'dealer': {'author': saleClone.dealerUserID,'date': saleClone.invoiceDate,'refID': salresRef._id}},modifiedBy: loginUsr._id,position: 'D',modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
							reject(imeierr);
						}
						if(imeires) {
							resolve(salRes);
						}
					});
				} else {
					resolve(salRes);
				}
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(saleClone.item.map(promisePool)).then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var dcPromise = function() {
		return Q.Promise(function(resolve,reject) {
			var totQty = 0, itemClone = invObj.dc.item;
			for(var i=0; i<itemClone.length; i++) {
				itemClone[i].name = itemClone[i].name._id;
			}
			for(var i=0; i<invObj.sale.item.length; i++) {
				for(var j=0; j<itemClone.length; j++) {
					if(invObj.sale.item[i].name === itemClone[j].name) {
						if(invObj.sale.item[i].IMEINumber) {
							for(var k=0; k<invObj.sale.item[i].IMEINumber.length; k++) {
								for(var l=0; l<itemClone[j].IMEINumber.length; l++) {
									var imeiIndex = itemClone[j].IMEINumber[l].IMEI.indexOf(invObj.sale.item[i].IMEINumber[k].IMEI[0]);
									if(imeiIndex >= 0) {
										itemClone[j].IMEINumber.splice(l, 1);
										break;
									}
								}
							}
						}
						itemClone[j].quantity = itemClone[j].quantity - invObj.sale.item[i].quantity;
						totQty = totQty + invObj.sale.item[i].quantity;
					}
				}
			}
			schemaObj.inventoryModel.findOneAndUpdate({_id:invObj.dc._id}, {item:itemClone, $inc:{totalQuantity:-totQty}, $push:{invenID:salresRef._id}}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	inventoryPromise().then(function(retsalObj) {
		salresRef = JSON.parse(JSON.stringify(retsalObj));
		return ledgerPromise(retsalObj);
	}).then(function() {
		return stockStatusPromise();
	}).then(function() {
		return dcPromise();
	}).then(function() {
		deferred.resolve(salresRef);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_deleteBrandPurchaseDcInvoice(reqObj, loginUsr) {
	var deferred=Q.defer();
	var stockStatusPromise = function() {
		var promisePool = function(reqRes) {
			return Q.Promise(function(resolve,reject) {
				var IMEINum = [];
				if(reqObj.dcID) {
					if(reqRes.IMEINumber) {
						IMEINum = reqRes.IMEINumber;
						schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{$pop: {brand: 1},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
							if(imeierr) {
								console.log(imeierr);
								reject(imeierr);
							}
							if(imeires) {
								resolve(reqRes);
							}
						});
					} else {
						resolve(reqRes);
					}
				} else{
					if(reqRes.IMEINumber) {
						IMEINum = reqRes.IMEINumber;
						schemaObj.IMEImodel.remove({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},function(imeierr,imeires) {
							if(imeierr){
								console.log(imeierr);
								reject(imeierr);
							}
						});
					}
					schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID,'name': reqRes.name._id,'salePoint': reqObj.salePoint._id},{$inc: {'quantity': -reqRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}},modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,res) {
						if(err) {
							console.log(err);
							reject(err);
						}
						if(res) {
							resolve(res);
						}
					});
				}
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(reqObj.item.map(promisePool)).then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var disablePromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.findOneAndUpdate({_id:reqObj._id}, {active:false}, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	stockStatusPromise().then(function() {
		return disablePromise();
	}).then(function() {
		deferred.resolve({status: 'Deleted'});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_rdsActivationReport(obj) {
	var deferred=Q.defer();
	for(var i=0; i<obj.item.length; i++) {
		obj.item[i] = ObjectId(obj.item[i]);
	}
	if(obj['type'] == 'wod') {
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					active: true,
					position: 'C',
					model: { $in: obj.item },
					activeDate : {
						$gte: obj.start,
						$lte: obj.end
					}
				}
			},
			{
				$project: {
					model: 1,
					party: { $arrayElemAt: ["$dealer", -1] },
					rds: { $arrayElemAt: ["$rds", -1] },
					IMEI: 1,
				}
			},
			{
				$group: {
					_id: { model:'$model', authorID:'$rds.author' },
					party: { $addToSet: '$party.author' },
					qty: { $sum: 1 }
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	} else {
		var groupObj = {
			_id: {model:'$model', authorID:'$rds.author', party:'$party.author'},
			qty: {$sum: 1}
		}
		var projectObj = {
			model: 1,
			party: { $arrayElemAt: ["$dealer", -1] },
			rds: { $arrayElemAt: ["$rds", -1] }
		}
		if(obj['type'] == 'imei') {
			projectObj['IMEI'] = 1;
			projectObj['boxno'] = 1;
			projectObj['customer'] = { $arrayElemAt: ["$customer", -1] };
			groupObj['IMEI'] = { $push: { imei: "$IMEI", boxno: '$boxno', info: '$customer' } };
		}
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					active: true,
					position: 'C',
					model: { $in: obj.item },
					activeDate : {
						$gte: obj.start,
						$lte: obj.end
					}
				}
			},
			{
				$project: projectObj
			},
			{
				$group: groupObj
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	}
	return deferred.promise;
}

function service_rdsStockReport(obj, loginUsr) {
	var deferred = Q.defer();
	for(var i=0; i<obj.item.length; i++) {
		obj.item[i] = ObjectId(obj.item[i]);
	}
	if(!obj.imei){
		schemaObj.inventoryModel.aggregate([
			{
				$match: {
					active: true,
					authorID: {
						'$ne': ObjectId(loginUsr.authorID)
					},
					invenType: {
						'$ne': 't'
					},
					invoiceDate : {
						$lte: obj.onDate
					}
				}
			},
			{
				$unwind: '$item'
			},
			{
				$match: {
					'item.name': { $in: obj.item }
				}
			},
			{
				$project: {
					'authorID': 1,
					'item.name': 1,
					customQuantity: {
						'$cond': {
							if: {
								$or: [{$eq: ["$invenType",'s']}, {$eq: ["$invenType",'sdc']}, {$eq: ["$invenType",'pr']}],
							},
							then: {
								$subtract: [ 0, "$item.quantity" ]
							},
							else: '$item.quantity'
						}
					},
					customParty: {
						'$cond': {
							if: {
								$eq: [ "$partyType", "dealer" ]
							},
							then: '$party',
							else: ''
						}
					}
	
				}
			},
			{
				$group: {
					_id: { model: '$item.name', authorID: '$authorID' },
					party: { $addToSet: '$customParty' },
					qty: { $sum: '$customQuantity' }
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	} else {
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					active: false,
					position: 'R',
					model: { $in: obj.item }
				}
			},
			{
				$project: {
					model: 1,
					IMEI: 1,
					boxno: 1,
					rds: { $arrayElemAt: ["$rds", -1] }
				}
			},
			{
				$match: {
					'rds.date': {
						$lte: obj.onDate
					}
				}
			},
			{
				$group: {
					_id: {model:'$model', authorID:'$rds.author'},
					IMEI: { $push: { imei: "$IMEI", boxno: '$boxno' } },
					qty: {$sum: 1}
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	}
	return deferred.promise;
}

function service_dealerStockReport(obj) {
	var deferred = Q.defer();
	for(var i=0; i<obj.item.length; i++) {
		obj.item[i] = ObjectId(obj.item[i]);
	}
	if(obj['type'] == 'wod') {
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					active: false,
					position: 'D',
					model: { $in: obj.item }
				}
			},
			{
				$project: {
					model: 1,
					rds: { $arrayElemAt: ["$rds", -1] },
					dealer: { $arrayElemAt: ["$dealer", -1] }
				}
			},
			{
				$match: {
					'dealer.date': {
						$lte: obj.onDate
					}
				}
			},
			{
				$group: {
					_id: { model:'$model', authorID:'$rds.author' },
					party: { $addToSet: '$dealer.author' },
					qty: { $sum: 1 }
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	} else {
		var projectObj = {
			model: 1,
			party: { $arrayElemAt: ["$dealer", -1] },
			rds: { $arrayElemAt: ["$rds", -1] }
		}
		var groupObj = {
			_id: {model:'$model', authorID:'$rds.author', party:'$party.author'},
			qty: {$sum: 1}
		}
		if(obj['type'] == 'imei') {
			projectObj['IMEI'] = 1;
			projectObj['boxno'] = 1;
			groupObj['IMEI'] = { $push: { imei: "$IMEI", boxno: '$boxno' } };
		}
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					active: false,
					position: 'D',
					model: { $in: obj.item }
				}
			},
			{
				$project: projectObj
			},
			{
				$match: {
					'rds.date': {
						$lte: obj.onDate
					}
				}
			},
			{
				$group: groupObj
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	}
	return deferred.promise;
}

function service_addSaleDc(salObj, loginUsr) {
	salObj.invenType = 'sdc';
	salObj.authorID = loginUsr.authorID;
	salObj.createdBy = loginUsr._id;
	salObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	salObj.active = true;
	salObj.partyType = "dealer";
	var deferred = Q.defer(), saleClone = JSON.parse(JSON.stringify(salObj)), salresRef = {};
	var inventoryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.inventoryModel.create(salObj, function(err, res) {
				if(err) {
					console.log(err);
					reject(err);
				} 
				if(res) {
					resolve(res);
				} else {
					reject('ERROR: No create return object');
				}
			});
		});
	}
	var stockStatusPromise = function(ret_retSalObj) {
		var promisePool = function(saleRes) {
			return Q.Promise(function(resolve, reject) {
				var IMEINum = [];
				if(saleRes.IMEINumber) {
					IMEINum = saleRes.IMEINumber;
					schemaObj.IMEImodel.updateMany({'IMEI': {$in: IMEINum.map(a => a.IMEI)}},{$push: {'sdc': {author: saleClone.dealerUserID,date: saleClone.invoiceDate,refID: salresRef._id}},modifiedBy: loginUsr._id,position: 'D', modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(imeierr,imeires) {
						if(imeierr) {
							console.log(imeierr);
						}
					});
					IMEINum.map((obj) => {
						obj.ss = salresRef.invoiceDate;
						return obj;
					});
				}
				schemaObj.stockStatusModel.findOneAndUpdate({'authorID': loginUsr.authorID, 'name': saleRes.name,'salePoint': saleClone.salePoint},{ $inc: {'quantity': -saleRes.quantity}, $pull: {'IMEINumber': {'IMEI': {$in: IMEINum.map(a => a.IMEI)}}}, modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},function(err,result) {
					if(result) {
						schemaObj.stockStatusModel.findOneAndUpdate({'authorID': saleClone.dealerUserID,'name': saleRes.name},{ $inc: {'quantity': +saleRes.quantity}, $push: {'IMEINumber': { $each: IMEINum}},'name': saleRes.name, 'authorID': saleClone.dealerUserID,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')},{upsert: true,new: true},function(err1,res) {
							if(res) {
								resolve(res);
							}
						});
					}
				});
			});
		}
		return Q.Promise(function(resolve, reject) {
			Promise.all(saleClone.item.map(promisePool)).then(function(data) {
				resolve(ret_retSalObj);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	inventoryPromise()
	.then(function(ret_retSalObj) {
		salresRef = JSON.parse(JSON.stringify(ret_retSalObj));
		return stockStatusPromise(ret_retSalObj);
	})
	.then(function(data) {
		deferred.resolve(data);
	})
	.catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_dcStatus(obj, loginUsr) {
	var deferred = Q.defer();
	for(var i=0; i<obj.itm.length; i++) {
		obj.itm[i] = ObjectId(obj.itm[i]);
	}
	if(!obj['imei']) {
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					position: { $ne: 'B'},
					model: { $in: obj.itm }
				}
			},
			{
				$project: {
					model: 1,
					sdc: 1,
					active: 1,
					sdCount: {
						"$size": { "$ifNull": [ "$sdc", [] ] }
					},
					rds: { $arrayElemAt: ["$rds", -1] },
					sdc: { $arrayElemAt: ["$sdc", -1] }
				}
			},
			{
				$match: {
					sdCount: { "$gt": 0 },
					'rds.author': ObjectId(loginUsr.authorID)
					}
			},
			{
				$group: {
					_id: { model:'$model', active: '$active', party: '$sdc.author' },
					qty: { $sum: 1 }
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	} else {
		schemaObj.IMEImodel.aggregate([
			{
				$match: {
					position: { $ne: 'B'},
					model: { $in: obj.itm }
				}
			},
			{
				$project: {
					model: 1,
					sdc: 1,
					active: 1,
					IMEI: 1,
					sdCount: {
						"$size": { "$ifNull": [ "$sdc", [] ] }
					},
					rds: { $arrayElemAt: ["$rds", -1] },
					sdc: { $arrayElemAt: ["$sdc", -1] }
				}
			},
			{
				$match: {
					sdCount: { "$gt": 0 },
					'rds.author': ObjectId(loginUsr.authorID)
					}
			},
			{
				$lookup: {
					from: 'inventory',
					localField: 'sdc.refID',
					foreignField: '_id',
					as: 'dc'
				}
			},
			{
				$unwind: '$dc'
			},
			{
				$group: {
					_id: { model:'$model', party: '$sdc.author' },
					imei: { $push: { imei: "$IMEI", active: '$active', dc: '$dc.invoiceNumber' } }
				}
			}
		],function(err,result) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(result) {
				deferred.resolve(result);
			}
		});
	}
	return deferred.promise;
}

cron.schedule('0 0 0 1 * *', () => {
	schemaObj.salesReportModel.remove({}, function(err, result) {
		if(err) {
			console.log('ERROR Remove Sales Report Documents : ' + err);
		}
		if(result) {
			console.log('Sales Report Documents Removed');
		}
	});
});