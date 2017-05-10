(function() {

	'use strict';

	angular.module('tcc').controller('AppController', Controller);

	Controller.$inject = ['$scope', '$mdSidenav', '$timeout', '$rootScope', '$mdMedia', '$focus', '$location', 'FoodService'];

	function Controller($scope, $mdSidenav, $timeout, $rootScope, $mdMedia, $focus, $location, FoodService) {
		var vm = this;
		vm.openSearch = openSearch;
		vm.goBack = goBack;
		vm.isRoute = isRoute;
		vm.searchFoodByTerm = searchFoodByTerm;

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
	    	$focus('searchInput');
	    }

	    function goBack() {
	    	vm.searching = false;
	    }

	    function isRoute(route) {
	    	return $location.path().indexOf(route) > 0;
	    }

	    function searchFoodByTerm(term) {
	    	return FoodService.search(term).then(function(response) {
		    	$location.path("/search");
	    		FoodService.searchResult = response.data;
	    	});
	    }

	    $rootScope.$on("$locationChangeStart", function(event, next) {
	    	if (!vm.isLockedOpen()) {
	    		$mdSidenav('left').close();
	    	}
	    	if (next.indexOf('form') > 0) {
	    		if (isRoute('food')) {
	    			vm.navItem = 'foodForm';
	    		} else if (isRoute('substance')) {
	    			vm.navItem = 'subsForm';
	    		}
	    	} else if (next.indexOf('list') > 0) {
	    		if (isRoute('food')) {
	    			vm.navItem = 'foodList';
	    		} else if (isRoute('substance')) {
	    			vm.navItem = 'subsList';
	    		}
	    	}
	    	if (!isRoute('search')) {
	    		goBack();
	    	}
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