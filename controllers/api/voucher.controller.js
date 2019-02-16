var express = require('express');
var router = express.Router();
var vouchersService = require('services/voucher.service');
var genericService = require('services/generic.service');

router.post('/readVoucherNumber', controller_getVoucherNumber);
router.post('/readLedgerEntry', controller_getLedgerEntry);
router.post('/saveLedger', controller_addLedger);
router.post('/readLedger', controller_getLedger);
router.post('/updateMainLedger', controller_editMainLedger);
router.post('/saveReceipt', controller_addReceipt);
router.get('/readReceipt', controller_getReceipt);
router.post('/readBankReceipt', controller_getBankReceipt);
router.post('/updateReceiptBankDate', controller_editReceiptBankDate);
router.post('/readCheque', controller_getCheque);
router.post('/updateCheque', controller_editCheque);
router.post('/saveReferenceJournal', controller_addReferenceJournal);
router.post('/readReferenceJournal', controller_getReferenceJournal);
router.post('/removeReferenceJournal', controller_deleteReferenceJournal);
router.post('/readReferenceJournalById', controller_getReferenceJournalById);
router.post('/saveJournal', controller_addJournal);
router.get('/readJournal', controller_getJournal);
router.post('/removeJournal', controller_deleteJournal);
router.post('/saveContra', controller_addContra);
router.get('/readContra', controller_getContra);
router.post('/removeContra', controller_deleteContra);
router.post('/savePayment', controller_addPayment);
router.get('/readPayment', controller_getPayment);
router.post('/saveDebit', controller_addDebit);
router.get('/readDebit', controller_getDebit);
router.post('/saveCredit', controller_addCredit);
router.get('/readCredit', controller_getCredit);
router.post('/readAccountStatement', controller_getAccountStatement);
router.post('/updateLedger', controller_modifyLedger);
router.post('/removeLedger', controller_deleteLedger);
router.post('/readLedgerId', controller_getLedgerId);
router.post('/readRJinvoice', controller_getRJinvoice);
router.post('/readReport', controller_getReport);

module.exports = router;

function controller_getVoucherNumber(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getVoucherNumber(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getLedgerEntry(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getLedgerEntry(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else{
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addLedger(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addLedger(req.body,usrObj)
		.then(function(ledger) {
			if(ledger) {
				res.send(ledger);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getLedger(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getLedger(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.status(200).send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_editMainLedger(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.editMainLedger(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addReceipt(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addReceipt(req.body,usrObj)
		.then(function(ret_obj){
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

function controller_getReceipt(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getReceipt(usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getBankReceipt(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getBankReceipt(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_editReceiptBankDate(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.editReceiptBankDate(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getCheque(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getCheque(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_editCheque(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.editCheque(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addReferenceJournal(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addReferenceJournal(req.body,usrObj)
		.then(function(retObj) {
			if(retObj) {
				res.send(retObj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getReferenceJournal(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getReferenceJournal(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteReferenceJournal(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.deleteReferenceJournal(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getReferenceJournalById(req,res) {
	vouchersService.getReferenceJournalById(req.body)
	.then(function(ret_obj) {
		if(ret_obj) {
			res.send(ret_obj);
		} else {
			res.sendStatus(404);
		}
	}).catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_addJournal(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addJournal(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getJournal(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getJournal(usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteJournal(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.deleteJournal(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addContra(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addContra(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getContra(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getContra(usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteContra(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.deleteContra(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addPayment(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addPayment(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getPayment(req,res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getPayment(usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addDebit(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addDebit(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getDebit(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getDebit(usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_addCredit(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.addCredit(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getCredit(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getCredit(usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getAccountStatement(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getAccountStatement(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_modifyLedger(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.modifyLedger(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_deleteLedger(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.deleteLedger(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getLedgerId(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getLedgerId(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getRJinvoice(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getRJinvoice(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}

function controller_getReport(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		vouchersService.getReport(req.body,usrObj)
		.then(function(ret_obj) {
			if(ret_obj) {
				res.send(ret_obj);
			} else {
				res.sendStatus(404);
			}
		}).catch(function(err) {
			res.status(503).send(err);
		});
	})
	.catch(function(err) {
		res.status(401).send(err);
	});
}