(function() {

	'use strict';

	angular.module('tcc').controller('FoodFormController', Controller);

	Controller.$inject = ['FoodService', 'SubstanceService', 'EnumsService', '$mdDialog', '$mdToast', '$mdPanel', '$q', '$location', '$focus', 'foodRequest'];

	function Controller(FoodService, SubstanceService, EnumsService, $mdDialog, $mdToast, $mdPanel, $q, $location, $focus, foodRequest) {
		var vm = this;
		
		vm.transformTag = transformTag;
		vm.save = save;
		vm.queryFood = queryFood;
		vm.querySubstance = querySubstance;
		vm.cleanForm = cleanForm;

		vm.categories = [];

		(function init() {
			loadEnums();
			if (foodRequest && foodRequest.data) {
				vm.food = foodRequest.data;
			} else {
				cleanForm();
			}
		})();

		function cleanForm(form) {
			vm.food = {
				otherNames: [],
				relatedFood: [],
				containedSubstances: []
			};
			vm.searchTextSubstance = '';
			vm.searchTextFood = '';
			if (form) {
				form.$setUntouched();
			}
		}

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums.category;
				vm.units = enums.unit;
			});
		}

		function transformTag(chip) {
			if (angular.isObject(chip)) {
				return chip;
			}
			return { description: chip };
		}

		function save(food, form, remain) {
			return FoodService.save(food).then(function(response) {
				if (response.status === 200 || response.status === 204) {
					$mdToast.show($mdToast.simple().textContent("Alimento salvo com sucesso").position('top right'));
					if (remain) {
						cleanForm(form);
						$focus('nameInput');
					} else {
						$location.path('/food/list');
					}
				} else {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
				}
			}, function() {
				$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
			});
		}

		function queryFood(string) {
			var filter = 'name==*' + string + '*';
			return FoodService.getPage({filter: filter}).then(function(response) {
				return response.data.content;
			});
		}

		function querySubstance(string) {
			var filter = 'name==*' + string + '*';
			return SubstanceService.getPage({filter: filter}).then(function(response) {
				return response.data.content;
			});
		}

	}

})();