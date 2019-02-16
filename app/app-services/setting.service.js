(function () {
	'use strict';
	angular.module('app').factory('SettingService', settingService);

	function settingService($http,$q,$window) {
		
        var settingService = {};
        
        settingService.readBrandCompanyProfile = readBrandCompanyProfile;
        settingService.updateSetting = updateSetting;
        settingService.readSetting = readSetting;
		
		return settingService;

        function readBrandCompanyProfile() {
			return $http.get('/api/setting/readBrandCompanyProfile').then(handleSuccess, handleError);
        }

        function updateSetting(setObj, fileObj){
            var setForm = new FormData();
			setForm.append('set',JSON.stringify(setObj));
			angular.forEach(fileObj, function(proof,key) {
		        setForm.append(key, proof);
		    });
		    return $http.put('/api/setting/updateSetting', setForm,{
        		transformRequest: angular.identity,
              	headers: {'Content-Type': undefined},
            }).then(handleSuccess, handleError);
        }
        
        function readSetting() {
			return $http.get('/api/setting/readSetting').then(handleSuccess, handleError);
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