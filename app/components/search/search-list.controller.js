(function() {

	'use strict';

	angular.module('tcc').controller('SearchListController', Controller);

	Controller.$inject = ['$scope', 'FoodService', 'EnumsService'];

	function Controller($scope, FoodService, EnumsService) {
		var vm = this;

		(function init() {
			loadEnums();
		})();

		$scope.$watch(function() {
			return FoodService.searchResult;
		}, function(newValue) {
			vm.results = newValue;
		});

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums;
			});
		}

	}

})();