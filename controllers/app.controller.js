var express = require('express');
var router = express.Router();

/* redirect to login controller
 *  use session auth to secure angular app files
*/
router.use('/', function(req,res,next) {

	//do not interchange the order.  /createpassword check has to be the first call
	if(req.path === '/createpassword') {
		console.log("inside app.controller - req.path === createpassword && !req.session.token");
		return res.redirect('/login/createpassword?tagID=' + encodeURIComponent(req.query.tagID));
	}
	if(req.path === '/mobApp') {
		console.log('Mobile app request');
		return res.redirect('/mobApp');
	}
	if(req.path !== '/login' && !req.session.token) {
		console.log('inside app.controller: ' + req.path);
		// return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path)); 
		return res.redirect('/login'); 
	} 
	
	next();
});

//make JWT token available to angular app
router.get('/token', function(req, res) {
	console.log('Inside /token - app controller: ' + req.session.token);
	res.send(req.session.token);
});

//serve angular app folder files from the '/app/' route
router.use('/', express.static('app'));
 
module.exports = router;
