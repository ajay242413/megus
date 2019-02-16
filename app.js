require('rootpath')();
var express = require('express');
var config = require('config.json');
const url = require('url');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
// var connObj = require('services/conn.service').createConnectionDB();

//TODO - Implement session file store

// support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
// app.use(bodyParser.json());
// PayloadTooLargeError: request entity too large
app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true})) 

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//render html files
///app.engine('html', require('ejs').renderFile);

//create session 
//app.use(session({secret: config.secret, resave: false, saveUninitialized: true, cookie: { secure: false } }));
app.use(session({secret: config.secret, name: 'sessionID', resave: true, saveUninitialized: true, rolling: true, cookie: { secure: false, maxAge: 100*100*100*18 } }));

//use JWT auth to secure the api except '/api/users/authenticate' and '/api/users/register''
//******** '/api/client/readClientTemp' '/api/client/saveClientPosition' - have to be removed once we complete mobile logon ***************************//
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/createPassword','/api/users/register', '/api/client/readClientTemp', '/api/client/saveClientPosition']}));

//used in .html file to load node_modules library statically
app.use(express.static(path.join(__dirname, 'node_modules'))); 
app.use(express.static(path.join(__dirname, 'assets')));

//Enabling CORS to support inter domain communication.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//routes
app.use('/login', require('./controllers/login.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/mobApp', require('./controllers/mob_api/mobApp.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
//*******8Start - This has to be removed once mob api logon is complete
app.use('/api/client/', require('./controllers/api/client.controller'));
//*******End - This has to be removed once mob api logon is complete
app.use('/api', require('./controllers/genericAPI.controller'));

//Redirect to app controller
app.get('/',function(req,res) {
	return res.redirect('/app');
});

app.all('/mobApp', function(req,res) {
	console.log('inside app login');
	return res.redirect(url.format({
		pathname: '/app/mobApp',
		query: req.query 
	}));
});

app.all('/createpassword', function(req,res) {
	return res.redirect(url.format({
		pathname: "/app/createpassword",
		query: req.query
	}));
});

//start web sserver
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Unosales server listening at http://' + server.address().address + ':' + server.address().port);
});