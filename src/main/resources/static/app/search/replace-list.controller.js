(function() {

	'use strict';

	angular.module('tcc').controller('ReplaceListController', Controller);

	Controller.$inject = ['$scope', 'FoodService', 'EnumsService', 'foodRequest', 'ReplaceService'];

	function Controller($scope, FoodService, EnumsService, foodRequest, ReplaceService) {
		var vm = this;

		vm.formatOtherNames = formatOtherNames;
		vm.loadReplacements = loadReplacements;

		vm.categories = [];
		vm.units = [];

		(function init() {
			loadEnums();
			if (foodRequest && foodRequest.data) {
				vm.mainFood = foodRequest.data;
				loadReplacements(vm.mainFood);
			}
		})();

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums.category;
				vm.units = enums.unit;
			});
		}

		function formatOtherNames(item) {
			console.log(item);
			return item.otherNames.join(', ');
		}

		function loadReplacements(food) {
			ReplaceService.replace(food).then(function(response) {
				response.data.sort((a,b) => a.second > b.second ? a : b);
				console.log(response.data);
				vm.results = response.data;
				vm.results.shift(); // remove 1st element
			});
		}

	}

})();