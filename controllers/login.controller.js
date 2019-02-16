var express = require('express');
var router = express.Router();
var request = require('request');
var userService = require('services/user.service');
var config = require('../config.json');

router.get('/', function(req,res) {
	var viewData = {success : req.session.success}; //move success message into local variable so it only appears once (Single read)
	// userService.logOut();
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('Session deleted');
			res.render('Unosales/login', viewData.success);
		}
	});
});

router.get('/createpassword', function(req,res) {
	var viewData = {success : req.session.success};
	// userService.logOut();
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('Session deleted');
			res.render('Unosales/setpassword');
		}
	});
});

router.post('/createpassword', function(req,res) {
	if(req.body.password === req.body.password1){
		req.body.email = req.query.tagID;
		request.post({
			url: config.apiUrl + '/users/createPassword',
			form: req.body,
			json: true
		}, function(err, response, body) {
			if(err) {
				console.log(err);
				return res.render('Unosales/setpassword', {error: 'An error occured'});
			}
			if(body.token) {
				console.log('Password successfully set');
				// return res.render('Unosales/login', {success: 'User password set successfully'});
				res.redirect(302, '/');
			} else {
				console.log('login controller: password set - POST - not of body.token');
				return res.render('Unosales/setpassword', {error: body, email: req.body.email});	
			}
		});
	} else {
		console.log('ERROR: Password and Confirm password do not match');
		return res.render('Unosales/setpassword', {error: 'Password and Confirm password do not match'});
	}
});

router.post('/', function(req, res) {
	console.log("INFO: authentication request");

	//authenticate using api to maintain clean separation between layers
	request.post({
		url: config.apiUrl + '/users/authenticate',
		form: req.body,
		json: true
	}, function(error, response, body) {
		if (error) {
			console.log('login.controller - POST - callback error');
			return res.render('Unosales/login', {error : 'An error occured'});
		}
		if(!body.user_data) {
			console.log('login.controller - POST - not of body.token');
			return res.render('Unosales/login', {error: body, email: req.body.email});
		}

		//Save JWT token in the session to make it available to angular app
		req.session.token = body.user_data.token; 
		req.session.permission = body.user_data.permission;
		console.log('INFO: post authenticatin - session token set');
		var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
		res.redirect(returnUrl);
	});
});

module.exports = router;