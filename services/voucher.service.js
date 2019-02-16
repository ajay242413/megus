var Q=require('q'), moment=require('moment'), schemaObj=require('./custom.schema.js'), userService=require('./user.service'), ObjectId=require('mongodb').ObjectID, voucherService={};

voucherService.getVoucherNumber = service_getVoucherNumber;
voucherService.getLedgerEntry = service_getLedgerEntry;
voucherService.addLedger = service_addLedger;
voucherService.getLedger = service_getLedger;
voucherService.editMainLedger = service_editMainLedger;
voucherService.addReceipt = service_addReceipt;
voucherService.getReceipt = service_getReceipt;
voucherService.getBankReceipt = service_getBankReceipt;
voucherService.editReceiptBankDate = service_editReceiptBankDate;
voucherService.getCheque = service_getCheque;
voucherService.editCheque = service_editCheque;
voucherService.addReferenceJournal = service_addReferenceJournal;
voucherService.getReferenceJournal = service_getReferenceJournal;
voucherService.deleteReferenceJournal = service_deleteReferenceJournal;
voucherService.getReferenceJournalById = service_getReferenceJournalById;
voucherService.getJournal = service_getJournal;
voucherService.addJournal = service_addJournal;
voucherService.deleteJournal = service_deleteJournal;
voucherService.addContra = service_addContra;
voucherService.getContra = service_getContra;
voucherService.deleteContra = service_deleteContra;
voucherService.addPayment = service_addPayment;
voucherService.getPayment = service_getPayment;
voucherService.addDebit = service_addDebit;
voucherService.getDebit = service_getDebit;
voucherService.addCredit = service_addCredit;
voucherService.getCredit = service_getCredit;
voucherService.getAccountStatement = service_getAccountStatement;
voucherService.modifyLedger = service_modifyLedger;
voucherService.deleteLedger = service_deleteLedger;
voucherService.getLedgerId = service_getLedgerId;
voucherService.getRJinvoice = service_getRJinvoice;
voucherService.getReport = service_getReport;

module.exports = voucherService;

function service_getVoucherNumber(obj,loginUsr) {
	var deferred=Q.defer(), settingRes=[];
	var settingPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.settingModel.find({authorID:loginUsr.authorID},function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var voucherPromise = function() {
		return Q.Promise(function(resolve,reject) {
			if(obj.type == "receipt") {
				schemaObj.receiptModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			} else if(obj.type == "refJournal") {
				schemaObj.referenceJournalModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			} else if(obj.type == "journal") {
				schemaObj.journalModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			} else if(obj.type == "contra") {
				schemaObj.contraModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			} else if(obj.type == "payment") {
				schemaObj.paymentModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			} else if(obj.type == "credit") {
				schemaObj.creditModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			} else if(obj.type == "debit") {
				schemaObj.debitModel.find({authorID:loginUsr.authorID}).sort({$natural:-1}).limit(1).exec(function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			}
		});
	}
	settingPromise()
	.then(function(res_obj) {
		settingRes = JSON.parse(JSON.stringify(res_obj));
		return voucherPromise();
	}).then(function(vou_obj) {
		var voucherNo="", seqNum=1;
		if(vou_obj.length) {
			var splitVoucher = vou_obj[0].invoiceNumber.split('/');
			seqNum = parseInt(splitVoucher[splitVoucher.length - 1]) + 1;
		}
		if(settingRes.length) {
			if(settingRes[0].invoice) {
				if(obj.type == 'receipt') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'RV/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				} else if(obj.type == 'refJournal') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'RJ/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				} else if(obj.type == 'journal') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'JV/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				} else if(obj.type == 'contra') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'CV/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				} else if(obj.type == 'payment') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'PV/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				} else if(obj.type == 'credit') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'CN/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				} else if(obj.type == 'debit') {
					if(settingRes[0].invoice[obj.type]) {
						voucherNo = 'DN/' + settingRes[0].invoice[obj.type] + '/' + seqNum;
					}
				}
			}
		}
		if(voucherNo == "") {
			voucherNo = "empty";
		}
		deferred.resolve({number: voucherNo});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getLedgerEntry(obj,loginUsr) {
	var deferred=Q.defer();
	var condition={ledgerId:obj.id, authorID:loginUsr.authorID, active:true};
	if(obj.type) {
		condition.type = {$in:obj.type};
	}
	if(obj.credit) {
		condition.debit = {$exists:false};
	} else if(obj.debit) {
		condition.credit = {$exists:false};
	}
	var options = {active:0, authorID:0, finYear:0, ledgerId:0};
	if(!obj.pending) {
		options.pending = 0;
		options.received = 0;
	} else {
		condition.pending = obj.pending;
	}
	schemaObj.ledgerEntryCloneModel.find(condition, options, function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_addLedger(ledgerObj,loginUsr) {
	var deferred=Q.defer();
	ledgerObj.authorID = loginUsr.authorID;
	ledgerObj.active = true;
	ledgerObj.createdBy = loginUsr._id;
	ledgerObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	var ledgerClone=JSON.parse(JSON.stringify(ledgerObj)), ledRes={};
	var ledgerIndividualPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerIndividualModel.create(ledgerObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.create({ledgerGroup:ledgerClone.ledgerGroup, finYear:ledgerClone.finYear, credit:ledgerClone.credit, debit:ledgerClone.debit, refId:ledRes._id, refType:'ledgerIndividual', authorID:loginUsr.authorID, createdBy:loginUsr._id, creationTime:moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss'), active:true}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerEntryPromise = function(retledObj) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerEntryModel.create({ledgerId:retledObj._id, type:'o', credit:ledgerClone.credit, debit:ledgerClone.debit, finYear:ledgerClone.finYear, active:true, refDate:moment(new Date()).format('YYYY-MM-DD'), authorID:loginUsr.authorID}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	ledgerIndividualPromise()
	.then(function(ret_ledInd) {
		ledRes = JSON.parse(JSON.stringify(ret_ledInd));
		return ledgerPromise();
	}).then(function(retledObj) {
		return ledgerEntryPromise(retledObj);
	}).then(function(data) {
		deferred.resolve(ledRes);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getLedger(ledgerObj,loginUsr) {
	var deferred=Q.defer();
	var condition={authorID:loginUsr.authorID};
	var options={code:0, active:0, authorID:0, createdBy:0, creationTime:0, modifiedBy:0, modifiedTime:0, modifiedDate:0};
	if(ledgerObj.active) {
		condition.active = ledgerObj.active;
	}
	if(ledgerObj.group) {
		condition.ledgerGroup = {'$in': ledgerObj.group};
	} else {
		options.credit = 0;
		options.debit = 0;
	}
	schemaObj.ledgerModel.find(condition, options, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_editMainLedger(obj,loginUsr) {
	var deferred=Q.defer();
	obj.modifiedBy = loginUsr._id;
	obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	schemaObj.ledgerModel.findByIdAndUpdate(obj._id, {$set: obj}, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_addReceipt(receiptObj,loginUsr) {
	var deferred=Q.defer();
	receiptObj.active = true;
	receiptObj.authorID = loginUsr.authorID;
	receiptObj.modifiedBy = loginUsr._id;
	receiptObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	receiptObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	var recClone=JSON.parse(JSON.stringify(receiptObj)), recRes={}, ledgerEntriesRes=[];
	var receiptPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.receiptModel.create(receiptObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(recClone.type == 'bank') {
					if(recClone.mode == 'cheque') {
						schemaObj.chequeModel.create({chequeno:recClone.bank.number, refId:res._id}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							resolve(res);
						});
					} else {
						resolve(res);
					}
				} else {
					resolve(res);
				}
			});
		});
	}
	var ledgerEntryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			var ledgerEntries=[], penAmt=recClone.amount, recAmt=0;
			if(recClone.agst == 'agst') {
				penAmt = 0;
				recAmt = recClone.amount;
			}
			ledgerEntries.push({ledgerId:recClone.ledgerFrom, credit:recClone.amount, refIdType:'receipt', refDate:recClone.invoiceDate, refId:recRes._id, finYear:recClone.finYear, type:'r', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:penAmt, received:recAmt, active:true});
			ledgerEntries.push({ledgerId:recClone.ledgerTo, debit:recClone.amount, refIdType:'receipt', refDate:recClone.invoiceDate, refId:recRes._id, finYear:recClone.finYear, type:'r', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, active:true});
			schemaObj.ledgerEntryModel.create(ledgerEntries, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				ledgerEntriesRes = res;
				resolve(res);
			});
		});
	}
	var receiptCreditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:recClone.ledgerFrom}, {$inc:{credit:+recClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var receiptDebitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:recClone.ledgerTo}, {$inc:{'debit':+recClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	receiptPromise()
	.then(function(ret_rec) {
		recRes = JSON.parse(JSON.stringify(ret_rec));
		return ledgerEntryPromise();
	}).then(function() {
		return receiptCreditPromise();
	}).then(function() {
		return receiptDebitPromise();
	}).then(function() {
		if(recClone.agst == 'agst') {
			recClone.refJournal.vouchers = [];
			for(var i=0; i<ledgerEntriesRes.length; i++) {
				if(ledgerEntriesRes[i].credit) {
					recClone.refJournal.vouchers.push({id:ledgerEntriesRes[i]._id, amount:ledgerEntriesRes[i].credit});
				}
			}
			return service_addReferenceJournal(recClone.refJournal);
		} else {
			return ledgerEntriesRes;
		}
	}).then(function() {
		deferred.resolve(recRes);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getReceipt(loginUsr) {
	var deferred=Q.defer();
	schemaObj.receiptModel.find({authorID:loginUsr.authorID, active:true}, function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getBankReceipt(obj,loginUsr) {
	var deferred=Q.defer();
	schemaObj.receiptModel.find({authorID:loginUsr.authorID, active:true, mode:obj.mode, ledgerTo:obj.ledger, 'bank.transDate':{$lte:obj.present}, 'bank.brsDate':{$exists:false}}, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_editReceiptBankDate(obj,loginUsr) {
	var deferred=Q.defer();
	var promisePool = function(id) {
		return Q.Promise(function(resolve,reject) {
			schemaObj.receiptModel.findOneAndUpdate({authorID:loginUsr.authorID, _id:id}, {'bank.brsDate':obj.date, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	Q.Promise(function(resolve,reject) {
		Promise.all(obj.ids.map(promisePool))
		.then(function(data) {
			deferred.resolve(data);
		})
		.catch(function(err) {
			console.log(err);
			deferred.reject(err);
		});
	});
	return deferred.promise;
}

function service_getCheque(obj,loginUsr){
	var deferred=Q.defer();
	var condition = {authorID:loginUsr.authorID, mode:'cheque', 'bank.brsDate':{$exists:true}, 'bank.number': {$regex:".*"+obj.num+".*"}};
	schemaObj.receiptModel.find(condition, function(err,res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(res) {
			deferred.resolve(res);
		}
	});
	return deferred.promise;
}

function service_editCheque(obj,loginUsr) {
	var deferred=Q.defer();
	var receiptPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.receiptModel.findOneAndUpdate({authorID:loginUsr.authorID, _id:obj.id},{$inc:{'bank.count':+1}, $unset:{'bank.brsDate':""}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var chequePromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.chequeModel.findOneAndUpdate({"authorID":loginUsr.authorID, "refId":obj.id, "chequeno":obj.no},{"$push": {"bounce": {remark:obj.remark, "modifiedBy":loginUsr._id, "modifiedDate":moment(new Date()).format('YYYY-MM-DD'), "modifiedTime":moment(new Date()).format('HH:mm:ss')}}}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	receiptPromise().then(function() {
		return chequePromise();
	}).then(function() {
		deferred.resolve(obj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_addReferenceJournal(obj,loginUsr) {
	var deferred=Q.defer();
	obj.active = true;
	obj.authorID = loginUsr.authorID;
	obj.modifiedBy = loginUsr._id;
	obj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	obj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	var refJouClone=JSON.parse(JSON.stringify(obj)), refJouRes={};
	var referenceJournalPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.referenceJournalModel.create(obj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var vouchersPromise = function() {
		var promisePool = function(vouRes) {
			return Q.Promise(function(resolve,reject) {
				schemaObj.ledgerEntryModel.findOneAndUpdate({_id:vouRes.id}, {$inc:{received:+vouRes.amount,pending:-vouRes.amount}, $push:{refJournal:refJouRes._id}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(refJouClone.vouchers.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var invoicesPromise = function() {
		var promisePool = function(invRes) {
			return Q.Promise(function(resolve,reject) {
				schemaObj.ledgerEntryModel.findOneAndUpdate({_id:invRes.id}, {$inc:{received:+invRes.amount,pending:-invRes.amount}, $push:{refJournal:refJouRes._id}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(refJouClone.invoices.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	referenceJournalPromise()
	.then(function(ret_refJouRes) {
		refJouRes = JSON.parse(JSON.stringify(ret_refJouRes));
		return vouchersPromise();
	}).then(function() {
		return invoicesPromise();
	}).then(function() {
		deferred.resolve(refJouRes);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getReferenceJournal(obj,loginUsr) {
	var deferred=Q.defer();
	obj.authorID = loginUsr.authorID;
	schemaObj.referenceJournalCloneModel.find(obj, {authorID:0, modifiedBy:0, modifiedTime:0, modifiedDate:0}, function(err,res) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(res) {
			deferred.resolve(res);
		}
	});
	return deferred.promise;
}

function service_deleteReferenceJournal(obj,loginUsr) {
	var deferred = Q.defer();
	var rjPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.referenceJournalCloneModel.findByIdAndUpdate(obj._id, {active:false, modifiedBy:loginUsr._id, modifiedTime:moment(new Date()).format('HH:mm:ss'), modifiedDate:moment(new Date()).format('YYYY-MM-DD')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var invoicesPromise = function() {
		var promisePool = function(invRes) {
			return Q.Promise(function(resolve,reject) {
				schemaObj.ledgerEntryModel.findOneAndUpdate({_id:invRes.id}, {$inc:{received:-invRes.amount,pending:+invRes.amount}, $pull:{refJournal:{$in:[obj._id]}}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(obj.invoices.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var vouchersPromise = function() {
		var promisePool = function(vouRes) {
			return Q.Promise(function(resolve,reject) {
				schemaObj.ledgerEntryModel.findOneAndUpdate({_id:vouRes.id}, {$inc:{received:-vouRes.amount,pending:+vouRes.amount}, $pull:{refJournal:{$in:obj._id}}}, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						resolve(res);
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(obj.vouchers.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	rjPromise().then(function() {
		return invoicesPromise();
	}).then(function() {
		return vouchersPromise();
	}).then(function() {
		deferred.resolve(obj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getReferenceJournalById(cond){
	var deferred = Q.defer();
	schemaObj.referenceJournalModel.findById(cond.id, function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_addJournal(journalObj,loginUsr) {
	var deferred=Q.defer();
	journalObj.authorID = loginUsr.authorID;
	journalObj.modifiedBy = loginUsr._id;
	journalObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	journalObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	journalObj.active = true;
	var journalClone=JSON.parse(JSON.stringify(journalObj)), jouRes={};
	var journalPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.journalModel.create(journalObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerEntryPromise = function() {
		var ledgerEntries = [];
		return Q.Promise(function(resolve,reject) {
			ledgerEntries.push({ledgerId:journalClone.ledgerFrom, debit:journalClone.amount, refIdType:'journal', refDate:journalClone.invoiceDate, refId:jouRes._id, finYear:journalClone.finYear, type:'j', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:journalClone.amount, received:0, active:true});
			ledgerEntries.push({ledgerId:journalClone.ledgerTo, credit:journalClone.amount, refIdType:'journal', refDate:journalClone.invoiceDate, refId:jouRes._id, finYear:journalClone.finYear, type:'j', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:journalClone.amount, received:0, active:true});
			schemaObj.ledgerEntryModel.create(ledgerEntries, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				ledgerEntriesRes = res;
				resolve(res);
			});
		});
	}
	var journalCreditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:journalClone.ledgerTo}, {$inc:{credit:+journalClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var journalDebitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:journalClone.ledgerFrom}, {$inc:{'debit':+journalClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	journalPromise().then(function(ret_jou) {
		jouRes = JSON.parse(JSON.stringify(ret_jou));
		return ledgerEntryPromise();
	}).then(function() {
		return journalCreditPromise();
	}).then(function() {
		return journalDebitPromise();
	}).then(function() {
		deferred.resolve(jouRes);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getJournal(loginUsr) {
	var deferred=Q.defer();
	schemaObj.journalModel.find({authorID: loginUsr.authorID, active:true},function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_deleteJournal(obj,loginUsr) {
	var deferred=Q.defer(), ledgerEntryObj=[];
	var checkRfPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerEntryModel.find({authorID:loginUsr.authorID, active:true, refId:obj._id}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					ledgerEntryObj = res;
					resolve(res);
				}
			});
		});
	}
	var deleteLedgerEntryPromise = function() {
		var promisePool = function(vouRes) {
			return Q.Promise(function(resolve,reject) {
				var updateObj = {$inc:{}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')};
				if(vouRes.credit) {
					updateObj.$inc.credit = '-' + vouRes.credit
				} else {
					updateObj.$inc.debit = '-' + vouRes.debit
				}
				schemaObj.ledgerModel.findOneAndUpdate({_id:vouRes.ledgerId._id}, updateObj, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({_id:vouRes._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(ledgerEntryObj.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var deleteJournalPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.journalModel.findOneAndUpdate({_id:obj._id}, {active:false}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					ledgerEntryObj = res;
					resolve(res);
				}
			});
		});
	}
	checkRfPromise().then(function(ret_ledEnt) {
		if((ret_ledEnt[0].refJournal.length) || ((ret_ledEnt[1].refJournal.length))) {
			return {status: 'Not Deleted'};
		} else {
			return deleteLedgerEntryPromise();
		}
	}).then(function(ret_ledent) {
		if(ret_ledent.status) {
			return ret_ledent;
		} else {
			return deleteJournalPromise();
		}
	}).then(function(resultObj) {
		if(resultObj.status) {
			deferred.resolve(ledgerEntryObj);
		} else {
			deferred.resolve({status: 'Deleted'});
		}
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_addContra(contraObj,loginUsr) {
	var deferred=Q.defer();
	contraObj.authorID = loginUsr.authorID;
	contraObj.modifiedBy = loginUsr._id;
	contraObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	contraObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	contraObj.active = true;
	var contraClone=JSON.parse(JSON.stringify(contraObj)), conRes={};
	var contraPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.contraModel.create(contraObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerEntryPromise = function() {
		var ledgerEntries = [];
		return Q.Promise(function(resolve,reject) {
			ledgerEntries.push({ledgerId:contraClone.ledgerFrom, debit:contraClone.amount, refIdType:'contra', refDate:contraClone.invoiceDate, refId:conRes._id, finYear:contraClone.finYear, type:'c', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:contraClone.amount, received:0, active:true});
			ledgerEntries.push({ledgerId:contraClone.ledgerTo, credit:contraClone.amount, refIdType:'contra', refDate:contraClone.invoiceDate, refId:conRes._id, finYear:contraClone.finYear, type:'c', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:contraClone.amount, received:0, active:true});
			schemaObj.ledgerEntryModel.create(ledgerEntries, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				ledgerEntriesRes = res;
				resolve(res);
			});
		});
	}
	var contraCreditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:contraClone.ledgerTo}, {$inc:{credit:+contraClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var contraDebitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:contraClone.ledgerFrom}, {$inc:{'debit':+contraClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	contraPromise().then(function(ret_con) {
		conRes = JSON.parse(JSON.stringify(ret_con));
		return ledgerEntryPromise();
	}).then(function() {
		return contraCreditPromise();
	}).then(function() {
		return contraDebitPromise();
	}).then(function() {
		deferred.resolve(conRes);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getContra(loginUsr) {
	var deferred=Q.defer();
	schemaObj.contraModel.find({authorID:loginUsr.authorID, active:true},function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_deleteContra(obj,loginUsr) {
	var deferred=Q.defer(), ledgerEntryObj=[];
	var getLedgerEntryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerEntryModel.find({authorID:loginUsr.authorID, active:true, refId:obj._id}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					ledgerEntryObj = res;
					resolve(res);
				}
			});
		});
	}
	var deleteLedgerEntryPromise = function() {
		var promisePool = function(vouRes) {
			return Q.Promise(function(resolve,reject) {
				var updateObj = {$inc:{}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')};
				if(vouRes.credit) {
					updateObj.$inc.credit = '-' + vouRes.credit
				} else {
					updateObj.$inc.debit = '-' + vouRes.debit
				}
				schemaObj.ledgerModel.findOneAndUpdate({_id:vouRes.ledgerId._id}, updateObj, function(err,res) {
					if(err) {
						console.log(err);
						reject(err);
					}
					if(res) {
						schemaObj.ledgerEntryModel.findOneAndUpdate({_id:vouRes._id}, {active:false}, function(err1,res1) {
							if(err1) {
								console.log(err1);
								reject(err1);
							}
							if(res1) {
								resolve(res1);
							}
						});
					}
				});
			});
		}
		return Q.Promise(function(resolve,reject) {
			Promise.all(ledgerEntryObj.map(promisePool))
			.then(function(data) {
				resolve(data);
			}).catch(function(err) {
				console.log(err);
				reject(err);
			});
		});
	}
	var deleteContraPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.contraModel.findOneAndUpdate({_id:obj._id}, {active:false}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					ledgerEntryObj = res;
					resolve(res);
				}
			});
		});
	}
	getLedgerEntryPromise().then(function() {
		return deleteLedgerEntryPromise();
	}).then(function() {
		return deleteContraPromise();
	}).then(function() {
		deferred.resolve({status: 'Deleted'});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_addPayment(paymentObj,loginUsr) {
	var deferred=Q.defer();
	paymentObj.active = true;
	paymentObj.authorID = loginUsr.authorID;
	paymentObj.modifiedBy = loginUsr._id;
	paymentObj.modifiedDate = moment(new Date()).format('YYYY-MM-DD');
	paymentObj.modifiedTime = moment(new Date()).format('HH:mm:ss');
	var payRes={},ledgerEntriesRes=[], payClone=JSON.parse(JSON.stringify(paymentObj));
	var paymentPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.paymentModel.create(paymentObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerEntryPromise = function() {
		return Q.Promise(function(resolve,reject) {
			var ledgerEntries=[], penAmt=payClone.amount, recAmt=0;
			if(payClone.agst == 'agst') {
				penAmt = 0;
				recAmt = payClone.amount;
			}
			ledgerEntries.push({ledgerId:payClone.ledgerFrom, debit:payClone.amount, refIdType:'payment', refDate:payClone.invoiceDate, refId:payRes._id, finYear:payClone.finYear, type:'y', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:penAmt, received:recAmt, active:true});
			ledgerEntries.push({ledgerId:payClone.ledgerTo, credit:payClone.amount, refIdType:'payment', refDate:payClone.invoiceDate, refId:payRes._id, finYear:payClone.finYear, type:'y', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, active:true});
			schemaObj.ledgerEntryModel.create(ledgerEntries, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				ledgerEntriesRes = res;
				resolve(res);
			});
		});
	}
	var paymentCreditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:payClone.ledgerTo}, {$inc:{credit:+payClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var paymentDebitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:payClone.ledgerFrom}, {$inc:{'debit':+payClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}	
	paymentPromise().then(function(ret_pay) {
		payRes = JSON.parse(JSON.stringify(ret_pay));
		return ledgerEntryPromise();
	}).then(function() {
		return paymentCreditPromise();
	}).then(function() {
		return paymentDebitPromise();
	}).then(function() {
		if(payClone.agst == 'agst') {
			payClone.refJournal.vouchers = [];
			for(var i=0; i<ledgerEntriesRes.length; i++) {
				if(ledgerEntriesRes[i].debit) {
					payClone.refJournal.vouchers.push({id:ledgerEntriesRes[i]._id, amount:ledgerEntriesRes[i].debit});
				}
			}
			return service_addReferenceJournal(payClone.refJournal);
		} else {
			return ledgerEntriesRes;
		}
	}).then(function() {
		deferred.resolve(payRes);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getPayment(loginUsr) {
	var deferred=Q.defer();
	schemaObj.paymentModel.find({authorID:loginUsr.authorID, active:true}, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_addDebit(debitObj,loginUsr) {
	var deferred=Q.defer();
	debitObj.active = true;
	debitObj.authorID = loginUsr.authorID;
	debitObj.createdBy = loginUsr._id;
	debitObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	var debClone = JSON.parse(JSON.stringify(debitObj));
	
	var debitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.debitModel.create(debitObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}

	var ledgerEntryPromise = function(retdebObj) {
		var ledgerEntries=[];
		return Q.Promise(function(resolve,reject) {
			ledgerEntries.push({ledgerId:debClone.ledgerFrom, debit:debClone.amount, refIdType:'debit', refDate:debClone.invoiceDate, refId:retdebObj._id, finYear:debClone.finYear, type:'d', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:debClone.amount, received:0, active:true});
			ledgerEntries.push({ledgerId:debClone.ledgerTo, credit:debClone.amount, refIdType:'debit', refDate:debClone.invoiceDate, refId:retdebObj._id, finYear:debClone.finYear, type:'d', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:debClone.amount, received:0, active:true});
			schemaObj.ledgerEntryModel.create(ledgerEntries, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var debitCreditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:debClone.ledgerTo}, {$inc:{credit:+debClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var debitDebitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:debClone.ledgerFrom}, {$inc:{debit:+debClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	debitPromise()
	.then(function(retdebObj) {
		return ledgerEntryPromise(retdebObj);
	}).then(function() {
		return debitCreditPromise();
	}).then(function() {
		return debitDebitPromise();
	}).then(function() {
		deferred.resolve(debitObj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getDebit(loginUsr) {
	var deferred=Q.defer();
	schemaObj.debitModel.find({authorID:loginUsr.authorID, active:true}, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_addCredit(creditObj,loginUsr) {
	var deferred=Q.defer();
	creditObj.active = true;
	creditObj.authorID = loginUsr.authorID;
	creditObj.createdBy = loginUsr._id;
	creditObj.creationTime = moment(new Date()).format('YYYY-MM-DD') + " " + moment(new Date()).format('HH:mm:ss');
	var credClone = JSON.parse(JSON.stringify(creditObj));
	var creditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.creditModel.create(creditObj, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(res);
			});
		});
	}
	var ledgerEntryPromise = function(retcreObj) {
		var ledgerEntries=[];
		return Q.Promise(function(resolve,reject) {
			ledgerEntries.push({ledgerId:credClone.ledgerFrom, debit:credClone.amount, refIdType:'credit', refDate:credClone.invoiceDate, refId:retcreObj._id, finYear:credClone.finYear, type:'e', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:credClone.amount, received:0, active:true});
			ledgerEntries.push({ledgerId:credClone.ledgerTo, credit:credClone.amount, refIdType:'credit', refDate:credClone.invoiceDate, refId:retcreObj._id, finYear:credClone.finYear, type:'e', authorID:loginUsr.authorID, modifiedBy:loginUsr._id, pending:credClone.amount, received:0, active:true});
			schemaObj.ledgerEntryModel.create(ledgerEntries, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var creditCreditPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:credClone.ledgerTo}, {$inc:{credit:+credClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	var creditDebitPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerModel.update({authorID:loginUsr.authorID, _id:credClone.ledgerFrom}, {$inc:{debit:+credClone.amount}, modifiedBy:loginUsr._id, modifiedDate:moment(new Date()).format('YYYY-MM-DD'), modifiedTime:moment(new Date()).format('HH:mm:ss')}, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	creditPromise()
	.then(function(retcreObj) {
		return ledgerEntryPromise(retcreObj);
	}).then(function() {
		return creditCreditPromise();
	}).then(function() {
		return creditDebitPromise();
	}).then(function() {
		deferred.resolve(creditObj);
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_getCredit(loginUsr) {
	var deferred=Q.defer();
	schemaObj.creditModel.find({authorID:loginUsr.authorID, active:true}, function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getAccountStatement(obj,loginUsr) {
	var deferred=Q.defer(), openingBalance={};
	var openingPromise = function() {
		return Q.Promise(function(resolve,reject) {
			schemaObj.ledgerEntryModel.aggregate([
				{$match:{authorID:ObjectId(loginUsr.authorID), active: true, ledgerId:ObjectId(obj.ledger), refDate:{$lt:obj.from}}},
				{$group:{'_id':'$ledgerId', 'credit':{$sum:'$credit'}, 'debit':{$sum:'$debit'}}}
			], function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					openingBalance = res;
					resolve(res);
				}
			});
		});
	}
	var statementPromise = function() {
		return Q.Promise(function(resolve,reject) {
			var options = {active:0, authorID:0, finYear:0, pending:0, received:0};
			schemaObj.ledgerEntryCloneModel.find({authorID:loginUsr.authorID, active:true, ledgerId:obj.ledger, refDate:{$gte:obj.from, $lte:obj.to}}, options, function(err,res) {
				if(err) {
					console.log(err);
					reject(err);
				}
				if(res) {
					resolve(res);
				}
			});
		});
	}
	openingPromise().then(function() {
		return statementPromise();
	}).then(function(result) {
		deferred.resolve({opening:openingBalance, entries:result});
	}).catch(function(err) {
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function service_modifyLedger(ledgerObj,loginUsr) {
	var deferred=Q.defer();
	if(ledgerObj.refType === 'ledgerIndividual') {
		schemaObj.ledgerIndividualModel.findByIdAndUpdate(ledgerObj.refId,{$set:{name: ledgerObj.name,gstin: ledgerObj.gstin,panID: ledgerObj.panID,address: ledgerObj.address,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function(err,res) {
			if(err) {
				console.log(err);
				deferred.reject(err);
			}
			if(res) {
				schemaObj.ledgerModel.findByIdAndUpdate(ledgerObj._id,{$set:{ledgerGroup: ledgerObj.ledgerGroup,finYear: ledgerObj.finYear,credit: ledgerObj.credit,debit: ledgerObj.debit,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}},function(err1,res1) {
					if(err1) {
						console.log(err1);
						deferred.reject(err1);
					}
					if(res) {
						deferred.resolve(res1);
					}
				});
			}
		});
	} else {
		schemaObj.ledgerModel.findByIdAndUpdate(ledgerObj._id,{$set:{ledgerGroup: ledgerObj.ledgerGroup,finYear: ledgerObj.finYear,credit: ledgerObj.credit,debit: ledgerObj.debit,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}},function(err1,res1) {
			if(err1) {
				console.log(err1);
				deferred.reject(err1);
			}
			if(res) {
				deferred.resolve(res1);
			}
		});
	}
	return deferred.promise;
}

function service_deleteLedger(ledgerObj,loginUsr) {
	var deferred=Q.defer();
	schemaObj.ledgerModel.findByIdAndUpdate(ledgerObj._id,{$set: {'active': false,modifiedBy: loginUsr._id,modifiedDate: moment(new Date()).format('YYYY-MM-DD'),modifiedTime: moment(new Date()).format('HH:mm:ss')}}, function(err,result) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getLedgerId(obj,loginUsr) {
	var deferred=Q.defer(), cond={authorID:loginUsr.authorID};
	if(obj.refId) {
		cond.refId = obj.refId;
	} else {
		cond.refType = 'dealer';
	}
	schemaObj.ledgerModel.find(cond,function(err,result) {
	    if(err) {
	    	console.log(err);
			deferred.reject(err);
		}
		if(result) {
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function service_getRJinvoice(obj,loginUsr) {
	var deferred=Q.defer(), condition={authorID:loginUsr.authorID, refId:obj.id};
	if(obj.debit) {
		condition.credit = {$exists:false};
	} else {
		condition.debit = {$exists:false};
	}
	schemaObj.ledgerEntryModel.find(condition, function(err,res) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(res) {
			schemaObj.referenceJournalModel.find({authorID:loginUsr.authorID, active:true, 'invoices.id':res[0].id}, function(err1,res1) {
				if(err1) {
					console.log(err1);
					deferred.reject(err1);
				}
				if(res1) {
					deferred.resolve(res1);
				}
			});
		}
	});
	return deferred.promise;
}

function service_getReport(obj,loginUsr) {
	var deferred=Q.defer();
	schemaObj.ledgerEntryModel.find({authorID:loginUsr.authorID, active:true, ledgerId:obj.id, type:{$ne:'o'}}, function(err,res) {
	    if(err) {
			console.log(err);
			deferred.reject(err);
		}
		if(res) {
			var result=[], amountTotal=0, pendingTotal=0, receivedTotal=0;
			for(var i=0; i<res.length; i++) {
				result.push({date:res[i].refId.invoiceDate, invoice:res[i].refId.invoiceNumber});
				if(res[i].credit) {
					result[result.length - 1].amount = res[i].credit;
					amountTotal = parseFloat(amountTotal) + parseFloat(res[i].credit);
				} else {
					result[result.length - 1].amount = res[i].debit;
					amountTotal = parseFloat(amountTotal) + parseFloat(res[i].debit);
				}
				if((res[i].pending) || (res[i].pending == 0)) {
					result[result.length - 1].pending = res[i].pending;
					pendingTotal = parseFloat(pendingTotal) + parseFloat(res[i].pending);
				}
				if((res[i].received) || (res[i].received == 0)) {
					result[result.length - 1].received = res[i].received;
					receivedTotal = parseFloat(receivedTotal) + parseFloat(res[i].received);
				}
				if(res[i].refId.category) {
					result[result.length - 1].category = [];
					for(var j=0; j<res[i].refId.category.length; j++) {
						result[result.length - 1].category.push(res[i].refId.category[j].name);
					}
				}
				if(res[i].refId.creditDays) {
					var dueDate = moment(new Date(res[i].refId.invoiceDate), "YYYY-MM-DD").add(res[i].refId.creditDays, 'days');
					result[result.length - 1].due = moment(new Date(dueDate)).format('YYYY-MM-DD');
					result[result.length - 1].period = res[i].refId.creditDays;
					var startDate=moment(new Date(res[i].refId.invoiceDate), "YYYY-MM-DD"), endDate=moment(new Date(), "YYYY-MM-DD");
					result[result.length - 1].age = endDate.diff(startDate, 'days');
					var startDate = moment(new Date(result[result.length - 1].due), "YYYY-MM-DD");
					result[result.length - 1].age = result[result.length - 1].age + " / " + startDate.diff(endDate, 'days');
				}
			}
			if(result.length) {
				result.push({invoice:''});
				result.push({invoice:'Total', amount:amountTotal, pending:pendingTotal, received:receivedTotal});
			}
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}