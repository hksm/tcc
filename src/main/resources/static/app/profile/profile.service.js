(function() {

	'use strict';

	angular.module('tcc').factory('ProfileService', Factory);

	Factory.$inject = ['BASE_URL', '$http', 'AuthService', '$rootScope', '$q'];

	function Factory(BASE_URL, $http, AuthService, $rootScope, $q) {
		var service = {
            save: save,
            get: get
        };

        function save(profile) {
        	return $http.post(BASE_URL + '/profile/' + $rootScope.user.username, profile);
        }

        function get() {
            if (!$rootScope.user.username || !$rootScope.user.username) {
                return $q.when({});
            } 
            return $http.get(BASE_URL + '/profile/' + $rootScope.user.username);
        }

        return service;
	}

})();