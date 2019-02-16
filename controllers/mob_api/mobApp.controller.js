var express = require('express');
var router = express.Router();
var request = require('request');
const util = require('util');
var hrService = require('services/hr.service');
var userService = require('services/user.service');

router.get('/', function(req,res) {	

	//employee login: 
	// {"_id":"5a754024885aeb0040d1db7c","name":"emp1","mobNum":1345} - Successful match;
	// {"status":1} - User namemobNum: ret_emp.mobNum ;not match;
	// {"status":2} - Passwoord not match;
	// http://localhost:3000/mobApp?type=login&username=premapandian6@gmail.com&password=p
	console.log('*************** inside mobile app - login *********');

	if (req.query.type === 'login') {
		console.log(req.query);
		// hrService.getEmployee()
		//username - email
		userService.authenticate(req.query.username, req.query.password)
		.then(function(ret_empObj) {
			console.log('mob app return :');
			console.log(ret_empObj);
			if(ret_empObj) {
				var token = ret_empObj.token;
				res.send({status: 0, token});
				// var empObj = {signupMail: req.query.username};
				// hrService.getEmployee(empObj)
				// .then(function(ret_emp) {
				// 	console.log('employee return');
				// 	console.log(ret_emp);
				// 	ret_emp.forEach(function(emp) {
				// 		if(emp.active) {
				// 			resObj = {name: emp.name, email: emp.signupMail, mobNum: emp.mobNum};
				// 			console.log(resObj);
				// 			res.send(resObj);
				// 		}
				// 	})
				// })
				// .catch(function(err) {
				// 	console.log(err.name + ':' + err.message);
				// });
			} else {
				res.status(401).send({status: 1});
			}
		})
		.catch(function(err) {
			res.status(503).send(err);
		});
		// if(req.query.username) {
		// 	hrService.getEmployee()
		// 	.then(function(ret_EmpObj) {
		// 		ret_EmpObj.forEach(function(emp) {
		// 			if(req.query.username === emp.username) {
		// 				if(req.query.password === emp.password) {
		// 					//res.send({'status':0});
		// 					res.send({_id:emp._id, name:emp.name, mobNum:emp.mobNum});
		// 				} else {
		// 					res.send({'status':2});
		// 				}
		// 			} else {
		// 				res.send({'status':1});
		// 			}  
		// 		});
		// 	})
		// 	.catch(function(err) {
		// 		res.status(503).send(err);
		// 	});
		// }
	}
});

module.exports = router;