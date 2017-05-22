(function() {

	'use strict';

	angular.module('tcc').service('CheckPermission', function($location, $rootScope) {
		
		return {
			hasRoleUser: function() {
				if (!$rootScope.user.roleUser) {
					$location.path('/login');
				}
			},
			notLogged: function() {
				if ($rootScope.user.roleUser) {
					$location.path('/home');
				}
			}
		};

	});

})();