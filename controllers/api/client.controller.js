var express = require('express');
var router = express.Router();
var multer = require('multer');
const querystring = require('querystring');
var upload = multer({dest:'assets/upload_files/uploaded_files/'});
var clientService = require('services/client.service');
var genericService = require('services/generic.service');

const util = require('util');

router.post('/saveClient', upload.any(), controller_addClient);
router.get('/readClient', controller_getClient);
router.get('/readClientCode', controller_getClientCode);
router.put('/updateClient', upload.any(), controller_modifyClient);
router.put('/removeClient', controller_deleteClient);
router.post('/saveDealer', controller_addDealer);
router.put('/updateDealer', controller_modifyDealer);
router.put('/removeDealer', controller_deleteDealer);
router.post('/readDealer', controller_getDealer);
router.get('/exportDealer', controller_exportDealer);
router.get('/exportClient', controller_exportClient);
router.post('/importDealer', controller_importDealer);

//To be removed after mobile API logon complete
router.get('/readClientTemp', controller_getClientTemp);
router.get('/saveClientPosition', controller_addClientPosition);

module.exports = router;

function controller_addClient(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		var clientData = JSON.parse(req.body.client);
		clientData.authorID = usrObj.authorID;
		clientData.createdBy = usrObj._id;
		clientData.active = true;
		clientService.addClient(req.files,clientData)
		.then(function(ret_cli) {
			if(ret_cli) {
				res.send(ret_cli);
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

function controller_getClient(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.userType = usrObj.userType;
		req.body.active = true;
		// console.log(req.params.active);
		// if(req.params.active) {
		// 	req.body.active = req.params.active;
		// }
		// console.log(req.query.active);
		// if(req.query.active) {
		// 	req.body.active = req.query.active;
		// }
		clientService.getClient(req.body)
		.then(function(ret_cli) {
			if(ret_cli) {
				res.send(ret_cli);
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

function controller_getClientTemp(req,res) {
	clientService.getClientTemp()
	.then(function(ret_cli) {
		if(ret_cli) {
			res.send(ret_cli);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getClientCode(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.userType = usrObj.userType;
		req.body.active = true;
		clientService.getClientCode(req.body)
		.then(function(ret_cli) {
			if(ret_cli) {
				res.send(ret_cli);
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

function controller_modifyClient(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		var clientData = JSON.parse(req.body.client);
		clientData.modifiedBy = usrObj._id;
		clientService.modifyClient(req.files,clientData)
		.then(function(ret_cli) {
			if(ret_cli) {
				res.send(ret_cli);
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

function controller_deleteClient(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		clientService.deleteClient(req.body,usrObj)
		.then(function(ret_cli) {
			if(ret_cli) {
				res.send(ret_cli);
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

function controller_addDealer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.createdBy = usrObj._id;
		req.body.active = true;
		clientService.addDealer(req.body,usrObj)
		.then(function(ret_dealer) {
			if(ret_dealer) {
				res.send(ret_dealer);
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

function controller_getDealer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.active = true;
		clientService.getDealer(req.body)
		.then(function(ret_dealer) {
			if(ret_dealer) {
				res.send(ret_dealer);
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

function controller_modifyDealer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.modifiedBy = usrObj._id;
		clientService.modifyDealer(req.body)
		.then(function(ret_dealer) {
			if(ret_dealer) {
				res.send(ret_dealer);
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

function controller_deleteDealer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		clientService.deleteDealer(req.body,usrObj)
		.then(function(ret_dealer) {
			if(ret_dealer) {
				res.send(ret_dealer);
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

function controller_addClientPosition(req,res) {
	clientService.addClientPosition(req.query)
	.then(function(ret_cli) {
		if(ret_cli) {
			res.send(ret_cli);
		} else {
			res.sendStatus(404);
		}
	}) 
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_exportDealer(req,res) {
	clientService.exportDealer()
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

function controller_exportClient(req,res) {
	clientService.exportClient()
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

function controller_importDealer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		clientService.importDealer(req.body,usrObj)
		.then(function(ret_dealer) {
			if(ret_dealer) {
				res.send(ret_dealer);
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