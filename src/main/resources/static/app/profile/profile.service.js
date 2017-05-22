(function() {

	'use strict';

	angular.module('tcc').factory('ProfileService', Factory);

	Factory.$inject = ['BASE_URL', '$http', 'AuthService', '$rootScope'];

	function Factory(BASE_URL, $http, AuthService, $rootScope) {
		var service = {
            save: save,
            get: get
        };

        function save(profile) {
        	return $http.post(BASE_URL + '/profile/' + $rootScope.user.username, profile);
        }

        function get() {
            return AuthService.getUserId().then(resp => $http.get(BASE_URL + '/profile/' + resp));
        }

        return service;
	}

})();