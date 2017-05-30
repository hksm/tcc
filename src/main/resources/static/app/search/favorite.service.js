(function() {

	'use strict';

	angular.module('tcc').factory('FavoriteService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            add: add,
            remove: remove,
            getOne: getOne,
            getAll: getAll
        };

        function getOne(foodId) {
        	return $http.get(BASE_URL + '/favorite/' + foodId);
        }

        function getAll() {
            return $http.get(BASE_URL + '/favorite');
        }

        function add(favorite) {
        	return $http.post(BASE_URL + '/favorite/', favorite);
        }

        function remove(id) {
        	return $http.delete(BASE_URL + '/favorite/' + id);
        }

        return service;
	}

})();