(function() {

	'use strict';

	angular.module('tcc').controller('SearchListController', Controller);

	Controller.$inject = ['$scope', '$rootScope', 'FoodService', 'EnumsService', '$location', 'NotificationService', '$mdToast'];

	function Controller($scope, $rootScope, FoodService, EnumsService, $location, NotificationService, $mdToast) {
		var vm = this;

		vm.formatOtherNames = formatOtherNames;
		vm.replaceFood = replaceFood;
		vm.suggestInclusion = suggestInclusion;
		vm.parseHiddenChips = parseHiddenChips;

		vm.categories = [];
		vm.units = [];

		(function init() {
			loadEnums();
		})();

		$scope.$watch(function() {
			return FoodService.searchResult;
		}, function(newValue) {
			newValue.forEach(function(item) {
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
			vm.results = newValue;
		});

		function suggestInclusion() {
			var name = FoodService.searchValue;
			if (!name) {
				return;
			}
			var message = $rootScope.user.username + ' sugeriu a adição do alimento: ' + name; 
			NotificationService.notificate(message).then(function() {
				$mdToast.show($mdToast.simple().textContent("Sugestão enviada").position('top right'));
				window.scroll(0,0);
			});
		}

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums.category;
				vm.units = enums.unit;
			});
		}

		function formatOtherNames(item) {
			return item.otherNames.join(', ');
		}

		function replaceFood(item) {
			$location.path('/replace/' + item.id);
		}

		function parseHiddenChips(arr) {
			return arr.map(e => e.name).join(', ');
		}

	}

})();