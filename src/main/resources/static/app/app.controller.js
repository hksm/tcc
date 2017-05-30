(function() {

	'use strict';

	angular.module('tcc').controller('AppController', Controller);

	Controller.$inject = ['$scope', '$mdSidenav', '$timeout', '$rootScope', '$http', '$mdMedia', '$focus', '$location', 'FoodService', 'BASE_URL_APP', 'AuthCookie', '$mdPanel', 'NotificationService', 'ProfileService'];

	function Controller($scope, $mdSidenav, $timeout, $rootScope, $http, $mdMedia, $focus, $location, FoodService, BASE_URL_APP, AuthCookie, $mdPanel, NotificationService, ProfileService) {
		var vm = this;
		vm.openSearch = openSearch;
		vm.goBack = goBack;
		vm.goToForm = goToForm;
		vm.isRoute = isRoute;
		vm.searchFoodByTerm = searchFoodByTerm;
		vm.isLoginOrSignUp = isLoginOrSignUp;
		vm.logout = logout;
		vm.showNotifications = showNotifications;

		$scope.toggleLeft = buildDelayedToggler('left');

		vm.openSidenav = buildDelayedToggler('left');

		$rootScope.notificationsCount = 0;

		vm.isLockedOpen = function() {
	    	return $mdMedia('gt-md');
		};

		(function init() {
			checkCookie();
			checkNotifications();
		})();

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

	    function isLoginOrSignUp() {
	    	return $location.path().indexOf('login') > 0 || $location.path().indexOf('register') > 0;
	    }

	    function openSearch() {
	    	vm.searching = true;
	    	$focus('searchInput');
	    }

	    function goBack() {
	    	vm.searching = false;
	    	if (vm.oldRoute && isRoute('search')) {
	    		$location.path(vm.oldRoute.replace(BASE_URL_APP, ''));
	    	}
	    }

	    function goToForm(form) {
	    	$location.path('/' + form + '/form');
	    }

	    function isRoute(route) {
	    	return $location.path().indexOf(route) > 0;
	    }

	    function searchFoodByTerm(term) {
	    	FoodService.searchValue = term;
	    	return FoodService.search(term).then(function(response) {
		    	$location.path('/search');
	    		FoodService.searchResult = response.data;
	    	});
	    }

	    function checkCookie() {
			$rootScope.user = AuthCookie.getCookie() || {
				username: '',
				token: null,
				roleUser: false,
				roleAdmin: false
			};
			$http.defaults.headers.common.Authorization = $rootScope.user.token ? 'Bearer ' + $rootScope.user.token : '';
		}

		function logout() {
			$rootScope.user = {
				username: '',
				token: null,
				roleUser: false,
				roleAdmin: false
			};
			$http.defaults.headers.common.Authorization = '';
			AuthCookie.removeCookie();
			$location.path('/');
		}

		function showNotifications(event) {
			var position = $mdPanel.newPanelPosition().relativeTo('.notifications-menu')
					.addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);

			var config = {
				attachTo: angular.element(document.body),
				controller: 'NotificationController',
				controllerAs: 'vm',
				templateUrl: '/app/notification/notification.html',
				panelClass: 'notifications-menu-body',
				position: position,
				locals: {				},
				openFrom: event,
				clickOutsideToClose: true,
				escapeToClose: true,
				focusOnOpen: true,
				zIndex: 2
			};

			$mdPanel.open(config);
		}

		function checkNotifications() {
			NotificationService.countByUser().then(function(response) {
				$rootScope.notificationsCount = response.data || 0;
			});
		}

		$scope.$watch('user', () => {
			getProfileImage();
		});

	    function getProfileImage() {
	    	ProfileService.get().then(function(response) {
	    		if (response.data && response.data.imageId) {
	    			$rootScope.profileImageId = response.data.imageId;
	    		}
	    	});
	    }

	    $rootScope.$on("$locationChangeStart", function(event, next, old) {
	    	vm.oldRoute = old;
	    	if (!vm.isLockedOpen()) {
	    		$mdSidenav('left').close();
	    	}

	    	checkNotifications();

	    	if (!isRoute('search')) {
	    		goBack();
	    	} else if (!vm.searching) {
	    		openSearch();
	    	}
	    	
			var aux = next.substring(8).substring(next.substring(8).indexOf('/') + 1);
			var route = aux.indexOf('/') > 0 ? aux.substring(0, aux.indexOf('/')) : aux;
			var routes = {
				'profile': 'Perfil',
				'food': 'Alimentos',
				'substance': 'Substâncias',
				'replace': 'Substituição de alimento',
				'default': 'Início'
			};
			vm.mainTitle = routes[route] || routes['default'];
		});
	}

})();