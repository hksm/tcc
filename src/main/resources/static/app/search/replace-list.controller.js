(function() {

	'use strict';

	angular.module('tcc').controller('ReplaceListController', Controller);

	Controller.$inject = ['$scope', 'FoodService', 'EnumsService', 'foodRequest', 'ReplaceService', 'FavoriteService'];

	function Controller($scope, FoodService, EnumsService, foodRequest, ReplaceService, FavoriteService) {
		var vm = this;

		vm.formatOtherNames = formatOtherNames;
		vm.loadReplacements = loadReplacements;
		vm.favoriteAction = favoriteAction;
		vm.parseHiddenChips = parseHiddenChips;

		vm.categories = [];
		vm.units = [];

		(function init() {
			loadEnums();
			if (foodRequest && foodRequest.data) {
				foodRequest.data.relatedFood = foodRequest.data.relatedFood.slice(0, 5);
				foodRequest.data.containedSubstances = foodRequest.data.containedSubstances.slice(0, 5);
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
				response.data.forEach(function(item) {
					item.relatedFoodChips = item.first.relatedFood.slice(0, 5);
					item.relatedFoodHidden = item.first.relatedFood.slice(5);
					if (item.relatedFoodHidden.length) {
						item.relatedFoodChips.push({name: '...'});
					}
					item.containedSubstancesChips = item.first.containedSubstances.slice(0, 5);
					item.containedSubstancesHidden = item.first.containedSubstances.slice(5);
					if (item.containedSubstancesHidden.length) {
						item.containedSubstancesChips.push({name: '...'});
					}
					
				});
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

		function parseHiddenChips(arr) {
			return arr.map(e => e.name).join(', ');
		}

	}

})();