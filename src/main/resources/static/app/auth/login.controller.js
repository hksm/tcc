(function() {

	'use strict';

	angular.module('tcc').controller('LoginController', Controller);

	Controller.$inject = ['$rootScope', '$http', '$location', '$mdToast', 'CheckPermission', 'AuthService', 'AuthCookie'];

	function Controller($rootScope, $http, $location, $mdToast, CheckPermission, AuthService, AuthCookie) {
		var vm = this;

		vm.checkRoles = checkRoles;
		vm.login = login;

		vm.credentials = {};

		(function init() {
			CheckPermission.notLogged();
			vm.rememberMe = true;	
		})();

		function checkRoles() {
			return AuthService.hasRole('user').then(function(roleUser) {
				$rootScope.user.roleUser = roleUser;
			}).then(function() {
				return AuthService.hasRole('admin').then(function(roleAdmin) {
					$rootScope.user.roleAdmin = roleAdmin;	
				});
			});
		}
		
		function login(credentials) {
			AuthService.login(credentials).then(function(token) {
				$rootScope.user.username = credentials.username;
				$rootScope.user.token = token;
				$http.defaults.headers.common.Authorization = 'Bearer ' + token;
				checkRoles().then(function() {
					if (vm.rememberMe) {
						AuthCookie.saveCookie($rootScope.user);
					} else {
						AuthCookie.removeCookie();
					}
					$location.path('/');
				});
			}, function() {
				$mdToast.show($mdToast.simple().textContent("Usuário ou senha inválido").position('top right'));
			});
		}

	}

})();