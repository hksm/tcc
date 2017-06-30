(function() {

	'use strict';

	angular.module('tcc').controller('SignUpController', Controller);

	Controller.$inject = ['$location', '$mdToast', 'AuthService'];

	function Controller($location, $mdToast, AuthService) {
		var vm = this;

		vm.register = register;

		vm.credentials = {};

		function register(user) {
			if (vm.credentials.password !== vm.credentials.passwordConfirm) {
				$mdToast.show($mdToast.simple().textContent("As senhas inseridas não são iguais").position('top right'));
				window.scroll(0,0);
			} else {
				AuthService.signup({ username: user.username, password: user.password }).then(function() {
					$mdToast.show($mdToast.simple().textContent("Sua conta foi registrada com sucesso").position('top right'));
					window.scroll(0,0);
					$location.path('/login');
				}, function() {
					$mdToast.show($mdToast.simple().textContent("Erro ao registrar sua conta").position('top right'));
					window.scroll(0,0);
				});
			}
		}

	}

})();