(function() {

	'use strict';

	angular.module('tcc').config(function($routeProvider, $locationProvider, $mdThemingProvider) {

		$routeProvider
			.when('/', {
				templateUrl: '/components/home/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			})
			// .when('/login', {
			// 	templateUrl: '/components/auth/login.html',
			// 	controller: 'LoginController',
			// 	controllerAs: 'vm'
			// })
			// .when('/register', {
			// 	templateUrl: '/components/auth/register.html',
			// 	controller: 'SignupController',
			// 	controllerAs: 'vm'
			// })
			.when('/profile', {
				templateUrl: '/components/profile/profile.html',
				controller: 'ProfileController',
				controllerAs: 'vm'
			})
			.when('/search', {
				templateUrl: '/components/search/search-list.html',
				controller: 'SearchListController',
				controllerAs: 'vm'
			})
			.when('/food', {
				templateUrl: '/components/food/food-list.html',
				controller: 'FoodListController',
				controllerAs: 'vm'
			})
			.when('/food/form', {
				templateUrl: '/components/food/food-form.html',
				controller: 'FoodFormController',
				controllerAs: 'vm'
			})
			.when('/food/list', {
				templateUrl: '/components/food/food-list.html',
				controller: 'FoodListController',
				controllerAs: 'vm'
			})
			.when('/substance', {
				templateUrl: '/components/substance/substance-list.html',
				controller: 'SubstanceListController',
				controllerAs: 'vm'
			})
			.when('/substance/form', {
				templateUrl: '/components/substance/substance-form.html',
				controller: 'SubstanceFormController',
				controllerAs: 'vm'
			})
			.when('/substance/list', {
				templateUrl: '/components/substance/substance-list.html',
				controller: 'SubstanceListController',
				controllerAs: 'vm'
			})
			.otherwise('/');
			
			$locationProvider.html5Mode(true);

			$mdThemingProvider.theme('default')
				.primaryPalette('blue-grey')
				.accentPalette('deep-purple');
	
	});
	
})();