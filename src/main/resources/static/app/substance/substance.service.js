(function() {

	'use strict';

	angular.module('tcc').factory('SubstanceService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            save: save,
            remove: remove,
            get: get,
            getPage: getPage
        };

        function save(substance) {
        	return $http.post(BASE_URL + '/substance', substance);
        }

        function remove(id) {
            if (!id) {
                return;
            }
            return $http.delete(BASE_URL + '/substance/' + id);
        }

        function get(id) {
            if (!id) {
                return;
            }
            return $http.get(BASE_URL + '/substance/' + id);   
        }

        function getPage(query) {
            var arr = [];
            if (query && query.filter) {
                arr.push('filter=' + query.filter);
            }
            if (query && query.page) {
                arr.push('page=' + query.page);
            }
            if (query && query.size) {
                arr.push('size=' + query.size);
            }
            if (query && query.sort) {
                arr.push('sort=' + query.sort);
            }
            var params = arr.length > 0 ? ('?' + arr.join('&')) : '';
        	return $http.get(BASE_URL + '/substance' + params);
        }

        return service;
	}

})();