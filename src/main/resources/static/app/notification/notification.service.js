(function() {

	'use strict';

	angular.module('tcc').factory('NotificationService', Factory);

	Factory.$inject = ['BASE_URL', '$http'];

	function Factory(BASE_URL, $http) {
		var service = {
            notificate: notificate,
            findByUser: findByUser,
            countByUser: countByUser,
            dispense: dispense
        };

        function notificate(message) {
        	return $http.post(BASE_URL + '/notifications', message);
        }

        function findByUser() {
        	return $http.get(BASE_URL + '/notifications');
        }

        function countByUser() {
            return $http.get(BASE_URL + '/notifications/count');
        }

        function dispense(id) {
            return $http.delete(BASE_URL + '/notifications/' + id);
        }

        return service;
	}

})();