(function () {
	'use strict';
	angular.module('app').factory('HRService', HRService);

	function HRService($http,$q,$window) {
		
		var hrService = {};

		hrService.saveEmployee = saveEmployee;
		hrService.readEmployee = readEmployee;
		hrService.updateEmployee = updateEmployee;
		hrService.removeEmployee = removeEmployee;
		hrService.readCurrentEmployee = readCurrentEmployee;
		hrService.updateProfile = updateProfile;
		hrService.readProfile = readProfile;

		return hrService;

		function saveEmployee(empObj,fileObj) {
			var hrForm = new FormData();
			hrForm.append('hr',JSON.stringify(empObj));
			angular.forEach(fileObj, function(proof,key) {
		        hrForm.append(key, proof);
		    });
		    return $http.post('/api/HR/saveEmployee', hrForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function readEmployee(obj) {
			return $http.post('/api/HR/readEmployee', obj).then(handleSuccess, handleError);
		}

		function updateEmployee(empObj,fileObj) {
			var hrForm = new FormData();
			hrForm.append('hr',JSON.stringify(empObj));
			angular.forEach(fileObj, function(proof,key) {
		        hrForm.append(key, proof);
		    });
		    return $http.put('/api/HR/updateEmployee', hrForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function removeEmployee(obj) {
			return $http.put('/api/HR/removeEmployee',obj).then(handleSuccess, handleError);
		}

		function readCurrentEmployee(obj) {
			return $http.post('/api/HR/readCurrentEmployee',obj).then(handleSuccess, handleError);
		}

		function updateEmployee(empObj,fileObj) {
			var hrForm = new FormData();
			hrForm.append('hr',JSON.stringify(empObj));
			angular.forEach(fileObj, function(proof,key) {
		        hrForm.append(key, proof);
		    });
		    return $http.put('/api/HR/updateEmployee', hrForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function updateProfile(profObj, fileObj){
			var profForm = new FormData();
			profForm.append('prof',JSON.stringify(profObj));
			angular.forEach(fileObj, function(proof,key) {
		        profForm.append(key, proof);
		    });
		    return $http.put('/api/HR/updateProfile', profForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
        	}).then(handleSuccess, handleError);
		}

		function readProfile(){
			return $http.get('/api/HR/readProfile').then(handleSuccess, handleError);
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