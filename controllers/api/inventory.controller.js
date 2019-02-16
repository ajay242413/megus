var express = require('express');
var router = express.Router();
var inventoryService = require('services/inventory.service');
var genericService = require('services/generic.service');

router.post('/readInvoiceNumber', controller_getInvoiceNumber);
router.post('/readInventory', controller_getInventory);
router.post('/readInventoryById', controller_getInventoryById);
router.get('/readInventoryCode', controller_getInventoryCode);
router.get('/readPurchaseInvoice', controller_getPurchaseInvoice);
router.post('/savePurchase', controller_addPurchase);
router.get('/readSalesInvoice', controller_getSalesInvoice);
router.post('/saveSales', controller_addSales);
router.get('/readSalesReturnInvoice', controller_getSalesReturnInvoice);
router.post('/saveSalesReturn', controller_addSalesReturn);
router.post('/readPurchaseItems', controller_getPurchaseItems);
router.post('/readSalesItems', controller_getSalesItems);
router.get('/readStockTransferInvoice', controller_getStockTransferInvoice);
router.post('/saveStockTransfer', controller_addStockTransfer);
router.post('/removeStockTransfer', controller_deleteStockTransfer);
router.post('/readPurInvoices', controller_getPurInvoices);
router.post('/readSalesInvoices', controller_getSalesInvoices);
router.get('/readPurchaseAck', controller_getPurchaseAck);
router.post('/savePurchaseAck', controller_addPurchaseAck);
router.get('/readSales', controller_getSales);
router.post('/stockStatus', controller_stockStatus);
router.post('/stockRegister', controller_stockRegister);
router.post('/activateIMEI', controller_activateIMEI);
router.post('/readRDSstockSummary', controller_getRDSstockSummary);
router.get('/readDealerStockSummary', controller_getDealerStockSummary);
router.post('/readIMEIinventory', controller_getIMEIinventory);
router.post('/readIMEIboxNumber', controller_getIMEIboxNumber);
router.post('/IMEIstatus', controller_IMEIstatus);
router.post('/IMEIduplication', controller_IMEIduplication);
router.post('/rdsTertiarySummary', controller_rdsTertiarySummary);
router.post('/removeRDSsaleInvoice', controller_deleteRDSsaleInvoice);
router.post('/removeRDSpurchaseInvoice', controller_deleteRDSpurchaseInvoice);
router.post('/removeBrandSaleInvoice', controller_deleteBrandSaleInvoice);
router.post('/removeBrandPurchaseInvoice', controller_deleteBrandPurchaseInvoice);
router.post('/updateInvoice', controller_editInvoice);
router.post('/rdsSecondarySummary', controller_rdsSecondarySummary);
router.post('/saveSalesBills', controller_addSalesBills);
router.post('/readRdsSalesReport', controller_getRdsSalesReport);
router.post('/rdsPrimarySummary', controller_rdsPrimarySummary);
router.post('/savePurchaseDc', controller_addPurchaseDc);
router.post('/removeBrandPurchaseDcInvoice', controller_deleteBrandPurchaseDcInvoice);
router.post('/savePurchaseDcBill', controller_addPurchaseDcBill);
router.post('/saveSaleDcBill', controller_addSaleDcBill);
router.post('/saveSaleDc', controller_addSaleDc);
router.post('/rdsActivationReport', controller_rdsActivationReport);
router.post('/rdsStockReport', controller_rdsStockReport);
router.post('/dealerStockReport', controller_dealerStockReport);
router.post('/dcStatus', controller_dcStatus);

module.exports = router;

function controller_getInvoiceNumber(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		inventoryService.getInvoiceNumber(req.body)
		.then(function(pur) {
			if(pur) {
				res.send(pur);
			} else {
				res.sendStatus(404);
			}
		}) 
		.catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getInventory(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		inventoryService.getInventory(req.body)
		.then(function(pur) {
			if(pur) {
				res.send(pur);
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

function controller_getInventoryById(req,res) { 
	inventoryService.getInventoryById(req.body)
	.then(function(pur) {
		if(pur) {
			res.send(pur);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getInventoryCode(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getInventoryCode(usrObj)
		.then(function(pur) {
			if(pur) {
				res.send(pur);
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

function controller_getPurchaseInvoice(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getPurchaseInvoice(usrObj)
		.then(function(invo) {
			if(invo) {
				res.send(invo);
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

function controller_addPurchase(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addPurchase(req.body,usrObj)
		.then(function(pur) {
			if(pur) {
				res.send(pur);
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

function controller_getPurchaseItems(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getPurchaseItems(req.body,usrObj)
		.then(function(entry) {
			if(entry) {
				res.send(entry);
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

function controller_getSalesItems(req,res) {
	inventoryService.getSalesItems(req.body)
	.then(function(entry) {
		if(entry) {
			res.send(entry);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getStockTransferInvoice(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getStockTransferInvoice(usrObj)
		.then(function(invo) {
			if(invo) {
				res.send(invo);
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

function controller_addStockTransfer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addStockTransfer(req.body,usrObj)
		.then(function(item) {
			if(item) {
				res.send(item);
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

function controller_deleteStockTransfer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.deleteStockTransfer(req.body,usrObj)
		.then(function(item) {
			if(item) {
				res.send(item);
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

function controller_getPurInvoices(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getPurInvoices(req.body,usrObj)
		.then(function(invo) {
			if(invo) {
				res.send(invo);
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

function controller_getSalesInvoices(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getSalesInvoices(req.body,usrObj)
		.then(function(invo) {
			if(invo) {
				res.send(invo);
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

function controller_getSalesInvoice(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getSalesInvoice(usrObj)
		.then(function(invoice) {
			if(invoice) {
				res.send(invoice);
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

function controller_addSales(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addSales(req.body,usrObj)
		.then(function(sale) {
			if(sale) {
				res.send(sale);
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

function controller_getSalesReturnInvoice(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getSalesReturnInvoice(usrObj)
		.then(function(invo) {
			if(invo) {
				res.send(invo);
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

function controller_addSalesReturn(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addSalesReturn(req.body,usrObj)
		.then(function(sale) {
			if(sale) {
				res.send(sale);
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

function controller_getPurchaseAck(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getPurchaseAck(usrObj)
		.then(function(invoice) {
			if(invoice) {
				res.send(invoice);
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

function controller_addPurchaseAck(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addPurchaseAck(req.body,usrObj)
		.then(function(invoice) {
			if(invoice) {
				res.send(invoice);
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

function controller_getSales(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getSales(usrObj)
		.then(function(invoice) {
			if(invoice) {
				res.send(invoice);
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

function controller_stockStatus(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.stockStatus(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_stockRegister(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.stockRegister(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}).catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_activateIMEI(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.activateIMEI(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_getRDSstockSummary(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.getRDSstockSummary(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_getDealerStockSummary(req,res) { 
	inventoryService.getDealerStockSummary()
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getIMEIinventory(req,res) { 
	inventoryService.getIMEIinventory(req.body)
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getIMEIboxNumber(req,res) { 
	inventoryService.getIMEIboxNumber(req.body)
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_IMEIstatus(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.IMEIstatus(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_IMEIduplication(req,res) { 
	inventoryService.IMEIduplication(req.body)
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_rdsTertiarySummary(req,res) { 
	inventoryService.rdsTertiarySummary(req.body)
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_deleteRDSsaleInvoice(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.deleteRDSsaleInvoice(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteRDSpurchaseInvoice(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.deleteRDSpurchaseInvoice(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteBrandSaleInvoice(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.deleteBrandSaleInvoice(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteBrandPurchaseInvoice(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.deleteBrandPurchaseInvoice(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_editInvoice(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.editInvoice(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_rdsSecondarySummary(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.rdsSecondarySummary(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addSalesBills(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addSalesBills(req.body,usrObj)
		.then(function(ret_obj){
			if(ret_obj){
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}) 
		.catch(function(err){
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getRdsSalesReport(req,res){ 
	inventoryService.getRdsSalesReport(req.body)
	.then(function(ret_obj){
		if(ret_obj) {
			res.send(ret_obj);
		} else{
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_rdsPrimarySummary(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.rdsPrimarySummary(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else{
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

function controller_addPurchaseDc(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addPurchaseDc(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_deleteBrandPurchaseDcInvoice(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.deleteBrandPurchaseDcInvoice(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_addPurchaseDcBill(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addPurchaseDcBill(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_addSaleDcBill(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addSaleDcBill(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_addSaleDc(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.addSaleDc(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_rdsActivationReport(req,res) {
	inventoryService.rdsActivationReport(req.body)
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_rdsStockReport(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.rdsStockReport(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_dealerStockReport(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.dealerStockReport(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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

function controller_dcStatus(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		inventoryService.dcStatus(req.body, usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
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