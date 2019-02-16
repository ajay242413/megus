var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'assets/upload_files/uploaded_files/'});
var expensesService = require('services/expenses.service');
var genericService = require('services/generic.service');

router.post('/saveExpense', upload.any(), controller_addExpense);
router.post('/readExpense', controller_getExpense);
router.post('/approveExpense', controller_approveExpense);
router.post('/readInvoiceNumber', controller_getInvoiceNumber);
router.get('/readInvoice', controller_getInvoice);
router.get('/readJourneyPlanumber', controller_getJourneyPlanumber);
router.post('/createJourneyPlan', controller_addJourneyPlan);
router.post('/readJourneyPlan', controller_getJourneyPlan);
router.post('/updateJourneyPlan', controller_modifyJourneyPlan);
router.post('/createHRevent', controller_addHRevent);
router.post('/readHRevent', controller_getHRevent);
router.post('/updateHRevent', controller_modifyHRevent);
router.post('/removeHRevent', controller_deleteHRevent);
router.post('/createBulkHREvent', controller_addBulkHREvent);
router.post('/removeBulkHREvent', controller_deleteBulkHREvent);
router.post('/getPlanEvents', controller_readPlanEvents);

module.exports = router;

function controller_addExpense(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		var expense = JSON.parse(req.body.expenses);
		expense.authorID = usrObj.authorID;
		expense.active = true;
		expense.modifiedBy = usrObj._id;
		expensesService.addExpense(req.files, expense)
		.then(function(expenses) {
			if(expenses) {
				res.send(expenses);
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

function controller_getExpense(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID
		expensesService.getExpense(req.body)
		.then(function(expenses) {
			if(expenses) {
				res.send(expenses);
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

function controller_approveExpense(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		expensesService.approveExpense(req.body,usrObj)
		.then(function(expenses) {
			if(expenses) {
				res.send(expenses);
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

function controller_getInvoiceNumber(req,res) { 
	expensesService.getInvoiceNumber(req.body)
	.then(function(expenses) {
		if(expenses) {
			res.send(expenses);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getInvoice(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		expensesService.getInvoice(req.body)
		.then(function(expenses) {
			if(expenses) {
				res.send(expenses);
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

function controller_getJourneyPlanumber(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		expensesService.getJourneyPlanumber(usrObj)
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

function controller_addJourneyPlan(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		expensesService.addJourneyPlan(req.body)
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

function controller_getJourneyPlan(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		expensesService.getJourneyPlan(req.body)
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

function controller_modifyJourneyPlan(req,res) { 
	expensesService.modifyJourneyPlan(req.body)
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

function controller_addHRevent(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		expensesService.addHRevent(req.body)
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
		res.status(503).send(err);
	});
}

function controller_getHRevent(req,res) { 
	expensesService.getHRevent(req.body)
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

function controller_modifyHRevent(req,res) { 
	expensesService.modifyHRevent(req.body)
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

function controller_deleteHRevent(req,res) { 
	expensesService.deleteHRevent(req.body)
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

function controller_addBulkHREvent(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		expensesService.addBulkHREvent(req.body, usrObj)
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
		res.status(503).send(err);
	});
}

function controller_deleteBulkHREvent(req,res){
	expensesService.deleteBulkHREvent(req.body)
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

function controller_readPlanEvents(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		expensesService.readPlanEvents(req.body, usrObj)
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
		res.status(503).send(err);
	});
}