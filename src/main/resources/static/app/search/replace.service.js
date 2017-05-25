(function() {

	'use strict';

	angular.module('tcc').factory('ReplaceService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            replace: replace
        };

        function replace(food) {
        	return $http.post(BASE_URL + '/replace/', food);
        }

        return service;
	}

})();