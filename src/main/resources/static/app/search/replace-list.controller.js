(function() {

	'use strict';

	angular.module('tcc').controller('ReplaceListController', Controller);

	Controller.$inject = ['$scope', 'FoodService', 'EnumsService', 'foodRequest', 'ReplaceService', 'FavoriteService'];

	function Controller($scope, FoodService, EnumsService, foodRequest, ReplaceService, FavoriteService) {
		var vm = this;

		vm.formatOtherNames = formatOtherNames;
		vm.loadReplacements = loadReplacements;
		vm.favoriteAction = favoriteAction;

		vm.categories = [];
		vm.units = [];

		(function init() {
			loadEnums();
			if (foodRequest && foodRequest.data) {
				vm.mainFood = foodRequest.data;
				FavoriteService.getOne(foodRequest.data.id).then(function(response) {
					if (response.data) {
						vm.mainFoodFavoriteId = response.data.id;
					}
				});
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
			return item.otherNames.join(', ');
		}

		function loadReplacements(food) {
			ReplaceService.replace(food).then(function(response) {
				if (response.data) {
					response.data.sort((a,b) => a.second > b.second ? -1 : 1);
				}
				vm.results = response.data;
			});
		}

		function favoriteAction(item) {
			var main = item.first.id === vm.mainFood.id;
			if (item.fourth) {
				FavoriteService.remove(item.fourth).then(function() {
					delete item.fourth;
					if (main) {
						vm.mainFoodFavoriteId = undefined;
					}
				});
				return;
			}
			FavoriteService.add({ food: item.first }).then(function(response) {
				item.fourth = response.data.id;
				if (main) {
					vm.mainFoodFavoriteId = response.data.id;
				}
			});
		}

	}

})();