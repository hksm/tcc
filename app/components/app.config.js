(function() {

	'use strict';

	angular.module('tcc').config(function($routeProvider, $locationProvider) {

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
			.when('/food', {
				templateUrl: '/components/food/food.html',
				controller: 'FoodController',
				controllerAs: 'vm'
			})
			.when('/substance', {
				templateUrl: '/components/substance/substance.html',
				controller: 'SubstanceController',
				controllerAs: 'vm'
			})
			.otherwise('/');
			
			$locationProvider.html5Mode(true);
	});
	
})();