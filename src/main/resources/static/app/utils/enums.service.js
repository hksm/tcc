(function() {

	'use strict';

	angular.module('tcc').factory('EnumsService', Factory);

	Factory.$inject = ['BASE_URL', '$http', '$q'];

	function Factory(BASE_URL, $http, $q) {
		var service = {
            options: options
        };

        var loadedOptions = [];

        function options() {
        	if (loadedOptions.length === 0) {
            	return $http({method: 'OPTIONS', url: BASE_URL + '/enums'}).then(function(response) {
            		loadedOptions = response.data;
            		return loadedOptions;
            	});
        	}
        	return $q.when(loadedOptions);
        }

        return service;
	}

})();