var Q = require('q');
var moment = require('moment');
var schemaObj = require('./custom.schema.js');
var userService = require('./user.service');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var expensesService = {};

expensesService.addExpense = service_addExpense;
expensesService.getExpense = service_getExpense;
expensesService.approveExpense = service_approveExpense;
expensesService.getInvoiceNumber = service_getInvoiceNumber;
expensesService.getInvoice = service_getInvoice;
expensesService.getJourneyPlanumber = service_getJourneyPlanumber;
expensesService.addJourneyPlan = service_addJourneyPlan;
expensesService.getJourneyPlan = service_getJourneyPlan;
expensesService.modifyJourneyPlan = service_modifyJourneyPlan;
expensesService.addHRevent = service_addHRevent;
expensesService.getHRevent = service_getHRevent;
expensesService.modifyHRevent = service_modifyHRevent;
expensesService.deleteHRevent = service_deleteHRevent;
expensesService.addBulkHREvent = service_addBulkHREvent;
expensesService.deleteBulkHREvent = service_deleteBulkHREvent;
expensesService.readPlanEvents = service_readPlanEvents;

module.exports = expensesService;

function service_addExpense(img,exp) {
	var deferred = Q.defer();
	expense.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	expense.modifiedTime = moment(new Date()).format('HH:mm:ss');
	var renameImage = [];
	var ri = 0;
	for(key in img){
		var imageName = (img[key].originalname).split('.');
		var fileName = expense.employee + '_' + imageName[0] + '.' + imageName[imageName.length - 1];
		fs.rename(img[key].path,'assets/upload_files/expenses/' + fileName, function(err) {
			if(err) {
				console.log(err);
			}
		});
		renameImage.push(fileName);
	}
	for (var i = 0; i < expense.expenses.length; i++) {
		if(expense.expenses[i].file){
			expense.expenses[i].file = renameImage[ri];
			ri = ri + 1;
		}
	}
	schemaObj.expenseModel.create(expense, function(err, result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
		else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_getExpense(expObj) {
	var deferred = Q.defer();
	schemaObj.expenseModel.find({authorID: expObj.authorID, approve: { $in : expObj.status}, employee: { $in : expObj.employee},invoiceDate: {$gte: expObj.start,$lte: expObj.end},active: true}, function(err, expense) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(expense) {
			deferred.resolve(expense);
		}
		else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

function service_approveExpense(expensesObj,loginUsr) {
	var deferred = Q.defer();
	expensesObj.forEach(function(currentValue){
		currentValue.modifiedBy = loginUsr._id;
		currentValue.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
		currentValue.modifiedTime = moment(new Date()).format('HH:mm:ss');
		schemaObj.expenseModel.findOneAndUpdate({_id: currentValue._id}, currentValue,function(err, expense) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(expense) {
				deferred.resolve(expense);
			}
		});
	});
	return deferred.promise;
}

function service_getInvoiceNumber(staffObj) {
	var deferred = Q.defer();
	schemaObj.expenseModel.find(staffObj, function(err, expense) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(expense) {
			deferred.resolve(expense);
		}
	});
	return deferred.promise;
}

function service_getInvoice(invoiceObj) {
	var deferred = Q.defer();
	schemaObj.expenseModel.find({authorID: invoiceObj.authorID}).sort({$natural:-1}).limit(1).exec(function(err, expense) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(expense) {
			deferred.resolve(expense);
		}
	});
	return deferred.promise;
}

function service_getJourneyPlanumber(loginUser){
	var deferred=Q.defer();
	schemaObj.journeyPlanModel.find({authorID: loginUser.authorID}).sort({$natural:-1}).limit(1).exec(function(err, result){
	    if(err){
			deferred.reject(err.name + ': ' + err.message);
		}
		if(result){
			var invoice='', seqNum=1;
			if(result.length){
				var splitInvoice = result[0].invoiceNumber.split('/');
				seqNum = parseInt(splitInvoice[splitInvoice.length - 1]) + 1;
			}
			invoice = 'PRN/' + seqNum;
			deferred.resolve({planumber: invoice});
		}
	});
	return deferred.promise;
}

function service_addJourneyPlan(obj){
	var deferred = Q.defer();
	// obj.modifiedBy = loginUser._id;
	// obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	// obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.journeyPlanModel.create(obj,function(err, resObj){
		if(err){
			deferred.reject(err.name + ': ' + err.message);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_getJourneyPlan(obj){
	var deferred = Q.defer();
	schemaObj.journeyPlanModel.find(obj, function(err, resObj){
		if(err){
			deferred.reject(err.name + ': ' + err.message);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_modifyJourneyPlan(obj){
	var deferred = Q.defer();
	// var loginUser = userService.loginUser();
	// obj.authorID = loginUser.authorID;
	// obj.active = true;
	// obj.modifiedBy = loginUser._id;
	// obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	// obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.journeyPlanModel.findByIdAndUpdate(obj._id, obj, function(err, resObj){
		if(err){
			deferred.reject(err.name + ': ' + err.message);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_addHRevent(obj){
	var deferred = Q.defer();
	obj.active = true;
	obj.start = moment(new Date(obj.start)).format('YYYY-MM-DD');
	obj.end = moment(new Date(obj.end)).format('YYYY-MM-DD');
	// schemaObj.hrEventModel.findOneAndUpdate({hr: obj.hr, authorID: loginUser.authorID},{$push:{'event': obj.event}, modifiedBy: loginUser._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss'), authorID: loginUser.authorID}, {upsert: true, new: true}, function(err, resObj){
	schemaObj.hrEventModel.create(obj, function(err, resObj){
		if(err){
			console.log("ERROR: Add HR Event : " + err);
			deferred.reject("ERROR: Add HR Event : " + err);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_getHRevent(obj){
	var deferred = Q.defer();
	// schemaObj.hrEventModel.aggregate([
	// 	{ $match: {hr: ObjectId(obj.hr)} },
	// 	{
	// 		$unwind: '$event'
	// 	},
	// 	{
	// 		$match: {'event.active': true}
	// 	},
	// 	{
	// 		$lookup: {
	// 			from: "journeyPlan",
	// 			localField: "event.plan",
	// 			foreignField: "_id",
	// 			as: "plans"
	// 		}
	// 	},
	// 	{
	// 		$unwind: '$plans'
	// 	},
	// 	{
	// 		$group: {
	// 			_id: "$_id",
	// 			events: {$push: {id: "$event._id",title: "$plans.name",description: "$plans._id",start: "$event.start",end: "$event.end"}}
	// 		}
	// 	}
	schemaObj.hrEventModel.aggregate([
		{ $match: {hr: ObjectId(obj.hr), active: true} },
		{
			$lookup: {
				from: "journeyPlan",
				localField: "plan",
				foreignField: "_id",
				as: "plans"
			}
		},
		{
			$unwind: '$plans'
		},
		{
			$group: {
				_id: "$hr",
				events: {$push: {id: "$_id",title: "$plans.name",description: "$plans._id",start: "$start",end: "$end"}}
			}
		}
	],function(err, resObj){
		if(err){
			console.log("ERROR: HR Event Read : " + err);
			deferred.reject(err);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_modifyHRevent(obj){
	var deferred = Q.defer();
	// var loginUser = userService.loginUser();
	obj.start = moment(new Date(obj.start)).format('YYYY-MM-DD');
	obj.end = moment(new Date(obj.end)).format('YYYY-MM-DD');
	schemaObj.hrEventModel.findOneAndUpdate({_id:obj.eventID},{plan:obj.plan, start:obj.start, end:obj.end}, function(err, resObj){
		if(err){
			console.log("ERROR: HR Event Modify : " + err);
			deferred.reject("ERROR: HR Event Modify : " + err);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_deleteHRevent(obj){
	var deferred = Q.defer();
	schemaObj.hrEventModel.findOneAndUpdate({_id:obj.eventID}, {active:false}, function(err, resObj){
		if(err){
			console.log("ERROR: HR Event Delete : " + err);
			deferred.reject(err.name + ': ' + err.message);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_addBulkHREvent(obj, loginUser){
	var deferred = Q.defer();
	obj.map((obj) => {
		obj.authorID = loginUser.authorID;
		obj.active = true;
		return obj;
	})
	schemaObj.hrEventModel.insertMany(obj, function(err, resObj){
		if(err){
			console.log("ERROR: Add HR Event : " + err);
			deferred.reject("ERROR: Add HR Event : " + err);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_deleteBulkHREvent(obj){
	var deferred = Q.defer();
	schemaObj.hrEventModel.update({hr:obj.hr, start:{$gte:obj.from, $lte:obj.to}}, {active:false}, {multi:true}, function(err, resObj){
		if(err){
			console.log("ERROR: Add HR Event : " + err);
			deferred.reject("ERROR: Add HR Event : " + err);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}

function service_readPlanEvents(obj, loginUser){
	var deferred = Q.defer();
	var condition = {
		authorID: loginUser.authorID,
		hr: {$in:obj.hr},
		start : {
			$gte: obj.fromDate,
			$lte: obj.toDate
		}
	};
	if(obj.plan.length){
		condition.plan = {$in:obj.plan}
	};
	schemaObj.hrEventModel.find(condition, function(err, resObj){
		if(err){
			console.log("ERROR: Add HR Event : " + err);
			deferred.reject("ERROR: Add HR Event : " + err);
		}
		if(resObj){
			deferred.resolve(resObj);
		}
	});
	return deferred.promise;
}