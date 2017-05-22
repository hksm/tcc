(function() {

	'use strict';

	angular.module('tcc').service('AuthCookie', function($cookies) {
		
		return {
			getCookie: function() {
				return $cookies.getObject('tcc-token');
			},
			saveCookie: function(user) {
				return $cookies.putObject('tcc-token', user);
			},
			removeCookie: function() {
				return $cookies.remove('tcc-token');
			}
		};

	});

})();