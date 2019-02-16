(function () {
    'use strict';
    angular.module('app').factory('UserService', UserService);

    function UserService($http,$q,$window) {

        var userService = {};

        userService.getCurrentUser = getCurrentUser;
        userService.getParentUsers = getParentUsers;
        userService.updatePasswd = updatePasswd
        userService.getBrandID = getBrandID;
        userService.getDealerAuthorID = getDealerAuthorID;
        userService.readClient = readClient;
        userService.readDealer = readDealer;
        userService.readAuthorDealer = readAuthorDealer;

        return userService;

        function getCurrentUser() {
            return $http.get('/api/users/getCurrentUser').then(handleSuccess, handleError);
        }

        function getParentUsers() {
            return $http.get('/api/users/getParentUsers').then(handleSuccess, handleError);
        }

        function getBrandID() {
            return $http.get('/api/users/getBrandID').then(handleSuccess, handleError);
        }

        function getDealerAuthorID(obj) {
            return $http.post('/api/users/getDealerAuthorID',obj).then(handleSuccess, handleError);
        }

        function readClient() {
            return $http.get('/api/users/readClient').then(handleSuccess, handleError);
        }

        function readDealer() {
            return $http.get('/api/users/readDealer').then(handleSuccess, handleError);
        }

        function updatePasswd(obj) {
            return $http.post('/api/users/createPassword', obj).then(handleSuccess, handleError);
        }

        function readAuthorDealer() {
            return $http.get('/api/users/readAuthorDealer').then(handleSuccess, handleError);
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
