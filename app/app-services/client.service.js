(function () {
	'use strict';
	angular.module('app').factory('ClientService', ClientService);

	function ClientService($http,$q,$window) {
		
		var clientService = {};
		
		clientService.saveClient = saveClient;
		clientService.readClient = readClient;
		clientService.readClientCode = readClientCode;
		clientService.updateClient = updateClient;
		clientService.removeClient = removeClient;
		clientService.saveDealer = saveDealer;
		clientService.updateDealer = updateDealer;
		clientService.removeDealer = removeDealer;
		clientService.readDealer = readDealer;
		clientService.exportDealer = exportDealer;
		clientService.exportClient = exportClient;
		clientService.importDealer = importDealer;
		
		return clientService;
		
		function saveClient(clientObj,proofObj) {
			var clientForm = new FormData();
			clientForm.append('client',JSON.stringify(clientObj));
			angular.forEach(proofObj, function(proof,key) {
		        clientForm.append(key, proof);
		    });
		    return $http.post('/api/client/saveClient', clientForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function readClient() {
			// return $http.get('/api/client/readClient?active=true').then(handleSuccess, handleError);
			return $http.get('/api/client/readClient').then(handleSuccess, handleError);
		}

		function readClientCode() {
			return $http.get('/api/client/readClientCode').then(handleSuccess, handleError);
		}

		function readDealer(){
			return $http.post('/api/client/readDealer').then(handleSuccess, handleError);
		}

		function updateClient(clientObj,proofObj) {
			var clientForm = new FormData();
			clientForm.append('client',JSON.stringify(clientObj));
			angular.forEach(proofObj, function(proof,key) {
		        clientForm.append(key, proof);
		    });
		    return $http.put('/api/client/updateClient', clientForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function removeClient(obj) {
			return $http.put('/api/client/removeClient',obj).then(handleSuccess, handleError);
		}

		function saveDealer(obj) {
			return $http.post('/api/client/saveDealer',obj).then(handleSuccess, handleError);
		}

		function updateDealer(obj) {
			return $http.put('/api/client/updateDealer',obj).then(handleSuccess, handleError);
		}

		function removeDealer(obj) {
			return $http.put('/api/client/removeDealer',obj).then(handleSuccess, handleError);
		}

		function exportDealer() {
			return $http.get('/api/client/exportDealer').then(handleSuccess, handleError);
		}

		function exportClient() {
			return $http.get('/api/client/exportClient').then(handleSuccess, handleError);
		}

		function importDealer(obj) {
			return $http.post('/api/client/importDealer', obj).then(handleSuccess, handleError);
		}

		// private functions
        function handleSuccess(res) {
           	return res;
        }
        
        function handleError(res) {
        	if(!res.data.redirect) {
        		swal({
	                title: '***Server***',
	                text: 'Inside Handle Success Error',
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