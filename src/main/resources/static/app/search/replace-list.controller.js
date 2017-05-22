(function() {

	'use strict';

	angular.module('tcc').controller('ReplaceListController', Controller);

	Controller.$inject = ['$scope', 'FoodService', 'EnumsService', 'foodRequest'];

	function Controller($scope, FoodService, EnumsService, foodRequest) {
		var vm = this;

		vm.formatOtherNames = formatOtherNames;

		vm.categories = [];
		vm.units = [];

		(function init() {
			loadEnums();
			if (foodRequest && foodRequest.data) {
				vm.food = foodRequest.data;
			}
		})();

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums.category;
				vm.units = enums.unit;
			});
		}

		function formatOtherNames(item) {
			return item.otherNames.join(', ');
		}

	}

})();