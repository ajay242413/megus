// var schemaObj = require('./custom.schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var bcrypt = require('bcryptjs');
// mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://127.0.0.1:27017/distiHub', {useNewUrlParser: true});

/*USER SCHEMAS*/
var userSchema = new Schema({
  email: {type: String},
  password: {type: String},
  userType: {type: String},
  active: {type: Boolean},
  refName: {type: String},
  refID: {type: Schema.Types.ObjectId,refPath: 'refName',autopopulate: true},
  authorID: {type: Schema.Types.ObjectId},
  parentID: {type: Schema.Types.ObjectId}
},{versionKey: false});

var masterLedgerSchema = new Schema({
  name: {type: String,required: true},
  authorID: [{type: Schema.Types.ObjectId}],
  modifiedBy: {type: Schema.Types.ObjectId},
  modifiedTime: {type: String},
  modifiedDate: {type: String},
  active: {type: Boolean,required: true}
},{ versionKey: false });
masterLedgerSchema.add({subName: [masterLedgerSchema]});

var permissionGeneralSchema = new Schema({
  view: {type: Boolean},
  new: {type: Boolean},
  edit: {type: Boolean},
  delete: {type: Boolean}
},{_id: false},{versionKey: false});

var permissionMasterSchema = new Schema({
  master: permissionGeneralSchema,
  client: permissionGeneralSchema,
  product: permissionGeneralSchema,
  supplier: permissionGeneralSchema,
  accounts: permissionGeneralSchema,
  hr: permissionGeneralSchema,
  generalMaster: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionHrSchema = new Schema({
  hr: permissionGeneralSchema,
  employee: permissionGeneralSchema,
  expense: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionIventorySchema = new Schema({
  inventory: permissionGeneralSchema,
  purchaseOrder: permissionGeneralSchema,
  purchaseOrderManagement: permissionGeneralSchema,
  purchaseAck: permissionGeneralSchema,
  sales: permissionGeneralSchema,
  salesOrder: permissionGeneralSchema,
  salesOrderManagement: permissionGeneralSchema,
  stockTransfer: permissionGeneralSchema,
  stockStatus: permissionGeneralSchema,
  stockRegister: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionAccountsSchema = new Schema({
  accounts: permissionGeneralSchema,
  ledger: permissionGeneralSchema,
  accountStatement: permissionGeneralSchema,
  receiptVoucher: permissionGeneralSchema,
  paymentVoucher: permissionGeneralSchema,
  journal: permissionGeneralSchema,
  contra: permissionGeneralSchema,
  debitNote: permissionGeneralSchema,
  creditNote: permissionGeneralSchema
},{_id: false},{versionKey: false});

var permissionSchema = new Schema({
  master: permissionMasterSchema,
  hr: permissionHrSchema,
  inventory: permissionIventorySchema,
  accounts: permissionAccountsSchema,
  authorID: {type: Schema.Types.ObjectId}
},{_id: false},{versionKey: false});

var employeeSchema = new Schema({
	signupMail: {type: String},
	active: {type: String},
	permission : permissionSchema,
	authorID: {type: Schema.Types.ObjectId},
	modifiedBy: {type: Schema.Types.ObjectId}
}, { versionKey: false});

var permissionMappingSchema = new Schema({
  permission: {type: Object }
},{_id: true}, {versionKey: false});

var userModel = mongoose.model('user',userSchema,'user');
var employeeModel = mongoose.model('employee',employeeSchema,'employee');
var masterLedgerModel = mongoose.model('master_ledger', masterLedgerSchema, 'master_ledger');
var permissionModel = mongoose.model('permission_map', permissionMappingSchema, 'permission_map');

var brandAdmin = {
	"email": "ajay@gmail.com",
	"password": "a",
	"userType": "b",
	"active": true,
	"refName": "employee"
}

var ledgerObj = [{
	"name": "Current Assets",
	"subName": [{
		"name": "Sundry Debtors",
		"active": true
	}, {
		"name": "Bank Accounts",
		"active": true
	}, {
		"name": "Cash-in-hand",
		"active": true
	}, {
		"name": "Deposits(Asset)",
		"active": true
	}, {
		"name": "Loans & Advances(Asset)",
		"active": true
	}, {
		"name": "Stock-in-hand",
		"active": true
	}],
	"active": true
}, {
	"name": "Loans(Liability)",
	"subName": [{
		"name": "Bank OD A/c",
		"active": true
	}, {
		"name": "Secured Loans",
		"active": true
	}, {
		"name": "Unsecured Loans",
		"active": true
	}],
	"active": true
}, {
	"name": "Current Liabilities",
	"subName": [{
		"name": "Duties & Taxes",
		"active": true
	}, {
		"name": "Provisions",
		"active": true
	}, {
		"name": "Sundry Creditors",
		"active": true
	}],
	"active": true
}, {
	"name": "Capital Account",
	"subName": [{
		"name": "Reserves & Surplus",
		"active": true
	}],
	"active": true
}, {
	"name": "Direct Expenses",
	"subName": [{
		"name": "Purchase Account",
		"active": true
	}],
	"active": true
},{
	"name": "Indirect Expenses",
	"subName": [{
		"name": "Salary",
		"active": true
	}],
	"active": true
}, {
	"name": "Direct Income",
	"subName": [{
		"name": "Sales Account",
		"active": true
	}],
	"active": true
}];

var adminPermission = {
	"master" : {
		"client" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"accounts" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"generalMaster" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"hr" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"product" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"supplier" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"master" : { "view" : true, "new" : true, "edit" : true, "delete" : true }
	},
	"inventory" : {
		"purchaseAck" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"purchaseOrder" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"purchaseOrderManagement" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"sales" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"salesOrder" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"salesOrderManagement" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"stockRegister" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"stockStatus" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"stockTransfer" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"inventory" : { "view" : true, "new" : true, "edit" : true, "delete" : true }
	},
	"hr" : {
		"employee" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"expense" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"hr" : { "view" : true, "new" : true, "edit" : true, "delete" : true }
	},
	"accounts" : {
		"accountStatement" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"contra" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"creditNote" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"debitNote" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"journal" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"ledger" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"paymentVoucher" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"receiptVoucher" : { "view" : true, "new" : true, "edit" : true, "delete" : true },
		"accounts" : { "view" : true, "new" : true, "edit" : true, "delete" : true }
	}
};

var permissionObj = {
	"permission": {
		"master": "master",
		"client":"client",
		"accounts": "accounts",
 		"generalmaster":"generalMaster",
 		"hr": "hr",
 		"product": "product",
 		"supplier": "supplier",
		"employee": "employee",
		"expense": "expense",
		"journey": "journey"
	}
}

function createMasterLedger(bAdmin) {
	var deferred = Q.defer();
	var ledgerPromises = ledgerObj.map(function(ledgerItem) {
		ledgerItem.authorID = bAdmin._id;
		masterLedgerModel.create(ledgerItem, function(err, ledger_ret) {
			if(ledger_ret) {
				deferred.resolve(ledgerObj);
			}
			if(err){
				deferred.reject(err);
			}
		});
		return deferred.promise;
	});
	Promise.all(ledgerPromises)
	.then(function(res) {
		console.log('INFO: Ledger group successfully created');
		deferred.resolve(res);
	})
	.catch(function(err) {
		console.log('ERROR: Failed to create ledger group');
		deferred.reject(err);
	});
}

function createBrandUser() {
	var deferred = Q.defer();
	var BCRYPT_SALT_ROUNDS = 12;
	bcrypt.hash(brandAdmin.password, BCRYPT_SALT_ROUNDS)
	.then(function(hashedPassword) {
		brandAdmin.password = hashedPassword;
		userModel.create(brandAdmin, function(bAdminErr, bAdmin) {
			if(bAdminErr) {
				console.log('ERROR: Failed to create brand admin account');
				deferred.reject(bAdminErr);
			}
			if(bAdmin) {
				var hrData = {signupMail:bAdmin.email, permission:adminPermission, active:true, authorID: bAdmin._id, modifiedBy: bAdmin._id};
				employeeModel.create(hrData, function(aEmployeeErr, aEmployee) {
					if(aEmployee) {
						userModel.findByIdAndUpdate(bAdmin._id, {$set: {refID: aEmployee._id, authorID: bAdmin._id, parentID: bAdmin._id}}, {new: true}, function(usrUpdateErr, usrUpdate) {
							if(usrUpdate) {
								console.log("INFO: User successfully updated");
								deferred.resolve(bAdmin); //return user details so we can use the authorID to ledger creation
							}
							if(usrUpdateErr) {
								console.log('ERROR: Failed to update brand admin account');
								deferred.reject(usrUpdateErr);
							}
						});
					}
					if(aEmployeeErr) {
						console.log('ERROR: Failed to create employee account to brand admin');
						deferred.reject(aEmployeeErr);
					}
				});
			}
		});
	})
	.catch(function(err) {
		deferred.reject(err);
	});
	return deferred.promise;
}

function createPermissionMap() {
	var deferred = Q.defer();
	permissionModel.create(permissionObj, function(err, resp) {
		if(resp) {
			console.log(resp);
			deferred.resolve(resp);
		}
		if(err){
			deferred.reject(err);
			console.log(err);
		}
	});
	return deferred.promise;

	Promise.all(permissionPromises)
	.then(function(res) {
		console.log(">>>>>>>");
		console.log(res[0]);
		console.log('INFO: permission mapping successfully created');
	})
	.catch(function(err) {
		console.log('ERROR: Failed to create permission mapping');
	});
}

createBrandUser()
.then(function(bAdmin) {
	console.log('INFO: Brand admin successfully created');
	createMasterLedger(bAdmin);
})
.catch(function(err) {
	console.log('ERROR: Failed to update the user');
});

createPermissionMap();
