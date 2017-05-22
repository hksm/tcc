(function() {

	'use strict';

	angular.module('tcc').factory('AuthService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            login: login,
            signup: signup,
            hasRole: hasRole
        };

        function login(credentials) {
			return $http.post(BASE_URL + '/auth/login', credentials).then(function(response) {
				return response.data.token;
			});
        }

        function hasRole(role) {
			return $http.get(BASE_URL + '/auth/role/' + role).then(function(response) {
				return response.data;
			});
		}

		function signup(user) {
			return $http.post(BASE_URL + '/auth/register', user);
		}

        return service;
	}

})();