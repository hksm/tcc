(function() {

	'use strict';

	angular.module('tcc').controller('AppController', Controller);

	Controller.$inject = ['$scope', '$mdSidenav', '$timeout', '$rootScope', '$mdMedia'];

	function Controller($scope, $mdSidenav, $timeout, $rootScope, $mdMedia) {
		var vm = this;
		vm.openSearch = openSearch;
		vm.goBack = goBack;

		$scope.toggleLeft = buildDelayedToggler('left');

		vm.openSidenav = buildDelayedToggler('left');

		vm.isLockedOpen = function() {
	    	return $mdMedia('gt-md');
		};

	    function debounce(func, wait) {
	      var timer;

	      return function debounced() {
	        var context = $scope, args = Array.prototype.slice.call(arguments);
	        $timeout.cancel(timer);
	        timer = $timeout(function() {
	          timer = undefined;
	          func.apply(context, args);
	        }, wait || 10);
	      };
	    }

	    function buildDelayedToggler(navID) {
			return debounce(function() {
				$mdSidenav(navID).toggle();
			}, 200);
	    }

	    function openSearch() {
	    	vm.searching = true;
	    }

	    function goBack() {
	    	vm.searching = false;
	    }

	    $rootScope.$on("$locationChangeStart", function(event, next) { 
			var route = next.replace('http://localhost:8000/', '');
			var routes = {
				'profile': 'Perfil',
				'history': 'Histórico',
				'food': 'Alimentos',
				'substance': 'Substâncias',
				'default': 'Início'
			};
			vm.mainTitle = routes[route] || routes['default'];
		});
	}

})();