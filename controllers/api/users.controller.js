var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var genericService = require('services/generic.service');

router.post('/authenticate', controller_authenticateUser);
router.post('/createPassword', controller_createPassword);
router.get('/getCurrentUser', controller_readCurrentUser);
router.get('/getParentUsers', controller_getParentUsers);
router.get('/getBrandID', controller_readBrandID);
router.post('/getDealerAuthorID', controller_readDealerAuthorID);
router.get('/readClient', controller_getClient);
router.get('/readDealer', controller_getDealer);
router.get('/readAuthorDealer', controller_getAuthorDealer);

module.exports = router;

function controller_authenticateUser(req,res) {
	userService.authenticate(req.body.email,req.body.password)
	.then(function(data) {
		if(data) {
			res.send({ user_data: data });
		} else {
			res.status(401).send('Username or password is incorrect');
		}
	})
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_createPassword(req, res) {
	userService.createPassword(req.body.email, req.body.password)
	.then(function(token) {
		if(token) {
			res.send({token: token});
		} else {
			res.status(401).send('User account not created');
		}
	})
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_readCurrentUser(req,res) {
	userService.readCurrentUser(req.user.sub)
	.then(function(usr) {
		if(usr) {
			res.send(usr);
		} else {
			res.sendStatus(404);
		}
	})
	.catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getParentUsers(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		userService.getParentUsers(usrObj)
		.then(function(usr) {
			if(usr) {
				res.send(usr);
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

function controller_readBrandID(req,res) {
	userService.readBrandID()
	.then(function(usr) {
		if(usr) {
			res.send(usr);
		} else {
			res.sendStatus(404);
		}
	})
	.catch(function(err) {
		res.status(400).send(err);
	});
}

function controller_readDealerAuthorID(req,res) {
	userService.readDealerAuthorID(req.body)
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

function controller_getClient(req,res) {
	userService.getClient()
	.then(function(retObj) {
		if(retObj) {
			res.send(retObj);
		} else {
			res.sendStatus(404);
		}
	}).catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getDealer(req,res) {
	userService.getDealer().then(function(retObj) {
		if(retObj) {
			res.send(retObj);
		} else {
			res.sendStatus(404);
		}
	}).catch(function(err) {
		res.status(503).send(err);
	});
}

function controller_getAuthorDealer(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		userService.getAuthorDealer(usrObj)
		.then(function(usr) {
			if(usr) {
				res.send(usr);
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