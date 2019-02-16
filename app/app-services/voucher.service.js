(function () {
	'use strict';
	angular.module('app').factory('VouchersService', VouchersService);

	function VouchersService($http,$q,$window) {
		
		var vouchersService = {};

		vouchersService.readVoucherNumber = readVoucherNumber;
		vouchersService.readLedgerEntry = readLedgerEntry;
		vouchersService.saveLedger = saveLedger;
		vouchersService.readLedger = readLedger;
		vouchersService.updateMainLedger = updateMainLedger;
		vouchersService.saveReceipt = saveReceipt;
		vouchersService.readReceipt = readReceipt;
		vouchersService.readBankReceipt = readBankReceipt;
		vouchersService.updateReceiptBankDate = updateReceiptBankDate;
		vouchersService.readCheque = readCheque;
		vouchersService.updateCheque = updateCheque;
		vouchersService.saveReferenceJournal = saveReferenceJournal;
		vouchersService.readReferenceJournal = readReferenceJournal;
		vouchersService.removeReferenceJournal = removeReferenceJournal;
		vouchersService.readReferenceJournalById = readReferenceJournalById;
		vouchersService.saveJournal = saveJournal;
		vouchersService.readJournal = readJournal;
		vouchersService.removeJournal = removeJournal;
		vouchersService.saveContra = saveContra;
		vouchersService.readContra = readContra;
		vouchersService.removeContra = removeContra;
		vouchersService.readPayment = readPayment;
		vouchersService.savePayment = savePayment;
		vouchersService.saveDebit = saveDebit;
		vouchersService.readDebit = readDebit;
		vouchersService.saveCredit = saveCredit;
		vouchersService.readCredit = readCredit;
		vouchersService.readAccountStatement = readAccountStatement;
		vouchersService.updateLedger = updateLedger;
		vouchersService.removeLedger = removeLedger;
		vouchersService.readLedgerId = readLedgerId;
		vouchersService.readRJinvoice = readRJinvoice;
		vouchersService.readReport = readReport;
		
		return vouchersService;

		function readVoucherNumber(obj) {
			return $http.post('/api/voucher/readVoucherNumber', obj).then(handleSuccess, handleError);
		}

		function readLedgerEntry(obj){
			return $http.post('/api/voucher/readLedgerEntry', obj).then(handleSuccess, handleError);
		}

		function saveLedger(obj) {
			return $http.post('/api/voucher/saveLedger', obj).then(handleSuccess, handleError);
		}

		function readLedger(obj) {
			return $http.post('/api/voucher/readLedger', obj).then(handleSuccess, handleError);
		}

		function updateMainLedger(obj){
			return $http.post('/api/voucher/updateMainLedger', obj).then(handleSuccess, handleError);
		}

		function saveReceipt(obj) {
			return $http.post('/api/voucher/saveReceipt', obj).then(handleSuccess, handleError);
		}
		
		function readReceipt() {
			return $http.get('/api/voucher/readReceipt').then(handleSuccess, handleError);
		}

		function readBankReceipt(obj) {
			return $http.post('/api/voucher/readBankReceipt', obj).then(handleSuccess, handleError);
		}

		function updateReceiptBankDate(obj) {
			return $http.post('/api/voucher/updateReceiptBankDate', obj).then(handleSuccess, handleError);
		}

		function readCheque(obj) {
			return $http.post('/api/voucher/readCheque', obj).then(handleSuccess, handleError);
		}

		function updateCheque(obj) {
			return $http.post('/api/voucher/updateCheque', obj).then(handleSuccess, handleError);
		}

		function saveReferenceJournal(obj){
			return $http.post('/api/voucher/saveReferenceJournal', obj).then(handleSuccess, handleError);
		}

		function readReferenceJournal(obj){
			return $http.post('/api/voucher/readReferenceJournal', obj).then(handleSuccess, handleError);
		}

		function removeReferenceJournal(obj){
			return $http.post('/api/voucher/removeReferenceJournal', obj).then(handleSuccess, handleError);
		}

		function readReferenceJournalById(obj){
			return $http.post('/api/voucher/readReferenceJournalById', obj).then(handleSuccess, handleError);
		}

		function saveJournal(obj){
			return $http.post('/api/voucher/saveJournal', obj).then(handleSuccess, handleError);
		}

		function readJournal(){
			return $http.get('/api/voucher/readJournal').then(handleSuccess, handleError);
		}

		function removeJournal(obj){
			return $http.post('/api/voucher/removeJournal', obj).then(handleSuccess, handleError);
		}

		function saveContra(obj){
			return $http.post('/api/voucher/saveContra', obj).then(handleSuccess, handleError);
		}

		function readContra(){
			return $http.get('/api/voucher/readContra').then(handleSuccess, handleError);
		}

		function removeContra(obj){
			return $http.post('/api/voucher/removeContra', obj).then(handleSuccess, handleError);
		}

		function savePayment(obj){
			return $http.post('/api/voucher/savePayment', obj).then(handleSuccess, handleError);
		}

		function readPayment(){
			return $http.get('/api/voucher/readPayment').then(handleSuccess, handleError);
		}

		function saveDebit(obj){
			return $http.post('/api/voucher/saveDebit', obj).then(handleSuccess, handleError);
		}

		function readDebit(){
			return $http.get('/api/voucher/readDebit').then(handleSuccess, handleError);
		}

		function saveCredit(obj){
			return $http.post('/api/voucher/saveCredit', obj).then(handleSuccess, handleError);
		}

		function readCredit(){
			return $http.get('/api/voucher/readCredit').then(handleSuccess, handleError);
		}

		function readAccountStatement(obj){
			return $http.post('/api/voucher/readAccountStatement', obj).then(handleSuccess, handleError);
		}

		function updateLedger(obj){
			return $http.post('/api/voucher/updateLedger', obj).then(handleSuccess, handleError);
		}

		function removeLedger(obj){
			return $http.post('/api/voucher/removeLedger', obj).then(handleSuccess, handleError);
		}

		function readLedgerId(obj){
			return $http.post('/api/voucher/readLedgerId', obj).then(handleSuccess, handleError);
		}

		function readRJinvoice(obj){
			return $http.post('/api/voucher/readRJinvoice', obj).then(handleSuccess, handleError);
		}

		function readReport(obj){
			return $http.post('/api/voucher/readReport', obj).then(handleSuccess, handleError);
		}

		// private functions
        function handleSuccess(res) {
        	return res;
        }

        function handleError(res) {
        	if(!res.data.redirect) {
        	 	swal({
	                title: 'Error',
	                text: 'handleSuccess error',
	                type: 'warning',
	                showCancelButton: false,
	                confirmButtonColor: '#3085d6',
	                cancelButtonColor: '#d33',
	                confirmButtonText: 'Ok!',
	                confirmButtonClass: 'btn btn-warning',
	                buttonsStyling: false
	            });
	            return $q.reject(res);
	        } else {
	        	console.log('INFO: Explicit redirection from server to: ' + res.data.redirect);
                $window.location = res.data.redirect;
	        }
        }	
	}
})();