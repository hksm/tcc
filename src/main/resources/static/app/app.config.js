(function() {

	'use strict';

	angular.module('tcc').config(function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, flowFactoryProvider) {

		$routeProvider
			.when('/', {
				templateUrl: '/app/home/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			})
			.when('/login', {
				templateUrl: '/app/auth/login.html',
				controller: 'LoginController',
				controllerAs: 'vm'
			})
			.when('/register', {
				templateUrl: '/app/auth/signup.html',
				controller: 'SignUpController',
				controllerAs: 'vm'
			})
			.when('/profile', {
				templateUrl: '/app/profile/profile.html',
				controller: 'ProfileController',
				controllerAs: 'vm'
			})
			.when('/search', {
				templateUrl: '/app/search/search-list.html',
				controller: 'SearchListController',
				controllerAs: 'vm'
			})
			.when('/replace/:id?', {
				templateUrl: '/app/search/replace-list.html',
				controller: 'ReplaceListController',
				controllerAs: 'vm',
				resolve: {
					foodRequest: function(FoodService, $q, $route) {
						if ($route.current.params.id) {
							return FoodService.get($route.current.params.id);
						}
						return $q.when();
					}
				}
			})
			.when('/food', {
				templateUrl: '/app/food/food-list.html',
				controller: 'FoodListController',
				controllerAs: 'vm'
			})
			.when('/food/form/:id?', {
				templateUrl: '/app/food/food-form.html',
				controller: 'FoodFormController',
				controllerAs: 'vm',
				resolve: {
					foodRequest: function(FoodService, $q, $route) {
						if ($route.current.params.id) {
							return FoodService.get($route.current.params.id);
						}
						return $q.when();
					}
				}
			})
			.when('/food/list', {
				templateUrl: '/app/food/food-list.html',
				controller: 'FoodListController',
				controllerAs: 'vm'
			})
			.when('/substance', {
				templateUrl: '/app/substance/substance-list.html',
				controller: 'SubstanceListController',
				controllerAs: 'vm'
			})
			.when('/substance/form/:id?', {
				templateUrl: '/app/substance/substance-form.html',
				controller: 'SubstanceFormController',
				controllerAs: 'vm',
				resolve: {
					substanceRequest: function(SubstanceService, $q, $route) {
						if ($route.current.params.id) {
							return SubstanceService.get($route.current.params.id);
						}
						return $q.when();
					}
				}
			})
			.when('/substance/list', {
				templateUrl: '/app/substance/substance-list.html',
				controller: 'SubstanceListController',
				controllerAs: 'vm'
			})
			.otherwise('/');
			
			$locationProvider.html5Mode(true);

			$mdThemingProvider.theme('default')
				.primaryPalette('deep-orange')
				.accentPalette('deep-purple');

			$mdIconProvider.defaultIconSet('img/icons/mdi.svg');

			flowFactoryProvider.defaults = {
				target: '/api/images',
				singleFile: true,
				testChunks: false
			};

	});
	
})();