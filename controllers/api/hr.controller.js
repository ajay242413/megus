var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'assets/upload_files/uploaded_files/'});
var hrService = require('services/hr.service');
var genericService = require('services/generic.service');

router.post('/saveEmployee', upload.any(), controller_addEmployee);
router.post('/readEmployee', controller_getEmployee);
router.put('/updateEmployee', upload.any(), controller_modifyEmployee);
router.put('/removeEmployee', controller_deleteEmployee);
router.post('/readCurrentEmployee', controller_getCurrentEmployee);
router.put('/updateProfile', upload.any(), controller_editProfile);
router.get('/readProfile', controller_getProfile);

module.exports = router;

function controller_addEmployee(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		var hrData = JSON.parse(req.body.hr);
		hrData.authorID = usrObj.authorID;
		hrData.active = true;
		hrData.modifiedBy = usrObj._id;
		hrService.addEmployee(req.files,hrData,usrObj)
		.then(function(hrEmployee) {
			if(hrEmployee) {
				res.send(hrEmployee);
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

function controller_modifyEmployee(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		var hrData = JSON.parse(req.body.hr);
		hrData.modifiedBy = usrObj._id;
		hrService.modifyEmployee(req.files,hrData)
		.then(function(hrEmployee) {
			if(hrEmployee) {
				res.send(hrEmployee);
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

function controller_getEmployee(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		req.body.active = true;
		hrService.getEmployee(req.body)
		.then(function(ret_EmpObj) {
			if(ret_EmpObj) {
				res.send(ret_EmpObj);
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

function controller_deleteEmployee(req,res) { 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		hrService.deleteEmployee(req.body,usrObj._id)
		.then(function(hrEmployee) {
			if(hrEmployee) {
				res.send(hrEmployee);
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

function controller_getCurrentEmployee(req,res) { 
	hrService.getCurrentEmployee(req.body)
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

function controller_editProfile(req, res){
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		hrService.editProfile(req.files, req.body, usrObj)
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

function controller_getProfile(req, res){ 
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		hrService.getProfile(usrObj)
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