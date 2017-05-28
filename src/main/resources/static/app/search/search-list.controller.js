(function() {

	'use strict';

	angular.module('tcc').controller('SearchListController', Controller);

	Controller.$inject = ['$scope', '$rootScope', 'FoodService', 'EnumsService', '$location', 'NotificationService', '$mdToast'];

	function Controller($scope, $rootScope, FoodService, EnumsService, $location, NotificationService, $mdToast) {
		var vm = this;

		vm.formatOtherNames = formatOtherNames;
		vm.replaceFood = replaceFood;
		vm.suggestInclusion = suggestInclusion;

		vm.categories = [];
		vm.units = [];

		(function init() {
			loadEnums();
		})();

		$scope.$watch(function() {
			return FoodService.searchResult;
		}, function(newValue) {
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

	}

})();