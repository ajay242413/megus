(function () {
	'use strict';
	angular.module('app').factory('ExpensesService', ExpensesService);

	function ExpensesService($http,$q,$window) {
		
		var expensesService = {};

		expensesService.saveExpense = saveExpense;
		expensesService.readExpense = readExpense;
		expensesService.approveExpense = approveExpense;
		expensesService.readInvoiceNumber = readInvoiceNumber;
		expensesService.readInvoice = readInvoice;
		expensesService.readJourneyPlanumber = readJourneyPlanumber;
		expensesService.createJourneyPlan = createJourneyPlan;
		expensesService.readJourneyPlan = readJourneyPlan;
		expensesService.updateJourneyPlan = updateJourneyPlan;
		expensesService.createHRevent = createHRevent;
		expensesService.readHRevent = readHRevent;
		expensesService.updateHRevent = updateHRevent;
		expensesService.removeHRevent = removeHRevent;
		expensesService.createBulkHREvent = createBulkHREvent;
		expensesService.removeBulkHREvent = removeBulkHREvent;
		expensesService.getPlanEvents = getPlanEvents;

		return expensesService;

		function saveExpense(expenses,files) {
			var fd = new FormData();
		    fd.append('expenses',JSON.stringify(expenses));
			angular.forEach(files, function(file,key) {
		        fd.append(key, file);
		    });
			return $http.post('/api/expenses/saveExpense', fd,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function readExpense(expObj){
			return $http.post('/api/expenses/readExpense', expObj).then(handleSuccess, handleError);
		}

		function approveExpense(expensesObj) {
			return $http.post('/api/expenses/approveExpense', expensesObj).then(handleSuccess, handleError);
		}

		function readInvoiceNumber(staffDetails) {
			return $http.post('/api/expenses/readInvoiceNumber', staffDetails).then(handleSuccess, handleError);
		}

		function readInvoice() {
			return $http.get('/api/expenses/readInvoice').then(handleSuccess, handleError);
		}

		function readJourneyPlanumber(obj) {
			return $http.get('/api/expenses/readJourneyPlanumber', obj).then(handleSuccess, handleError);
		}

		function createJourneyPlan(obj) {
			return $http.post('/api/expenses/createJourneyPlan', obj).then(handleSuccess, handleError);
		}

		function readJourneyPlan(obj) {
			return $http.post('/api/expenses/readJourneyPlan', obj).then(handleSuccess, handleError);
		}

		function updateJourneyPlan(obj) {
			return $http.post('/api/expenses/updateJourneyPlan', obj).then(handleSuccess, handleError);
		}

		function createHRevent(obj) {
			return $http.post('/api/expenses/createHRevent', obj).then(handleSuccess, handleError);
		}

		function readHRevent(obj) {
			return $http.post('/api/expenses/readHRevent', obj).then(handleSuccess, handleError);
		}

		function updateHRevent(obj) {
			return $http.post('/api/expenses/updateHRevent', obj).then(handleSuccess, handleError);
		}

		function removeHRevent(obj) {
			return $http.post('/api/expenses/removeHRevent', obj).then(handleSuccess, handleError);
		}

		function createBulkHREvent(obj) {
			return $http.post('/api/expenses/createBulkHREvent', obj).then(handleSuccess, handleError);
		}

		function removeBulkHREvent(obj) {
			return $http.post('/api/expenses/removeBulkHREvent', obj).then(handleSuccess, handleError);
		}

		function getPlanEvents(obj) {
			return $http.post('/api/expenses/getPlanEvents', obj).then(handleSuccess, handleError);
		}
		
		// private functions
        function handleSuccess(res) {
        	return res;
        }

        function handleError(res) {
        	if(!res.data.redirect) {
        		return $q.reject(res);
        	} else {
        		console.log('INFO: Explicit redirection from server to: ' + res.data.redirect);
        		$window.location = res.data.redirect;	
        	}
        }
	}
})();