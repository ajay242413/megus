var express = require('express');
var router = express.Router();

router.use('/', function(req,res,next) {
	if(!req.session.token) {
		console.log('session token undefined - server restarted');
		res.status(303).send({redirect: '/login'});
	} else {
		next();
	}
});

router.use('/HR', require('./api/hr.controller'));
router.use('/client', require('./api/client.controller'));
router.use('/expenses', require('./api/expenses.controller'));
router.use('/inventory', require('./api/inventory.controller'));
router.use('/voucher', require('./api/voucher.controller'));
router.use('/master', require('./api/master.controller'));
router.use('/setting', require('./api/setting.controller'));

module.exports = router;
