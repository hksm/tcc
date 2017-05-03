(function() {

	'use strict';

	angular.module('tcc').factory('AuthService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            getUserId: getUserId
        };

        function getUserId() {
            return Promise.resolve(1);
        }

        return service;
	}

})();