(function() {

	'use strict';

	angular.module('tcc').factory('ProfileService', Factory);

	Factory.$inject = ['BASE_URL', '$http', 'AuthService'];

	function Factory(BASE_URL, $http, AuthService) {
		var service = {
            save: save,
            get: get
        };

        function save(profile) {
        	return $http.post(BASE_URL + '/profile', profile);
        }

        function get() {
            return AuthService.getUserId().then(resp => $http.get(BASE_URL + '/profile/' + resp));
        }

        return service;
	}

})();