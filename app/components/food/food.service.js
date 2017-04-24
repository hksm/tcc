(function() {

	'use strict';

	angular.module('tcc').factory('FoodService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            save: save,
            remove: remove,
            getPage: getPage
        };

        function save(food) {
        	return $http.post(BASE_URL + '/food', food);
        }

        function remove(id) {
            if (!id) {
                return;
            }
            return $http.delete(BASE_URL + '/food/' + id);
        }

        function getPage(filter, page, size) {
            var arr = [];
            if (filter) {
                arr.push('filter=' + filter);
            }
            if (page) {
                arr.push('page=' + page);
            }
            if (size) {
                arr.push('size=' + size);
            }
            var params = arr.length > 0 ? ('?' + arr.join('&')) : '';
        	return $http.get(BASE_URL + '/food' + params);
        }

        return service;
	}

})();