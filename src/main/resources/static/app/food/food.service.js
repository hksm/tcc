(function() {

	'use strict';

	angular.module('tcc').factory('FoodService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var searchResult = [];
        var searchValue = '';
        var service = {
            save: save,
            remove: remove,
            get: get,
            getPage: getPage,
            search: search,
            searchResult: searchResult,
            searchValue: searchValue
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

        function get(id) {
            if (!id) {
                return;
            }
            return $http.get(BASE_URL + '/food/' + id);
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
        	return $http.get(BASE_URL + '/food' + params);
        }

        function search(term) {
            return $http.get(BASE_URL + '/food/search?term=' + term);   
        }

        return service;
	}

})();