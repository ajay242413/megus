var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'assets/upload_files/uploaded_files/'});
var settingService = require('services/setting.service');
var genericService = require('services/generic.service');

router.get('/readBrandCompanyProfile', controller_getBrandCompanyProfile);
router.put('/updateSetting', upload.any(), controller_editSetting);
router.get('/readSetting', controller_getSetting);

module.exports = router;

function controller_getBrandCompanyProfile(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {		
		settingService.getBrandCompanyProfile(usrObj)
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

function controller_editSetting(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		var setObj = JSON.parse(req.body.set)
		setObj.authorID = usrObj.authorID;
		setObj.active = true;
		setObj.modifiedBy = usrObj._id;
		settingService.editSetting(req.files, setObj).then(function(ret_obj){
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

function controller_getSetting(req,res) {
	genericService.tokenToUsrObj(req.session.token)
	.then(function(usrObj) {
		req.body.authorID = usrObj.authorID;
		settingService.getSetting(req.body)
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