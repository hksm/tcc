(function() {

	'use strict';

	angular.module('tcc').controller('FoodFormController', Controller);

	Controller.$inject = ['FoodService', 'SubstanceService', 'EnumsService', '$mdDialog', '$mdToast', '$mdPanel', '$q', '$focus'];

	function Controller(FoodService, SubstanceService, EnumsService, $mdDialog, $mdToast, $mdPanel, $q, $focus) {
		var vm = this;
		
		vm.transformTag = transformTag;
		vm.save = save;
		vm.queryFood = queryFood;
		vm.querySubstance = querySubstance;
		vm.cleanForm = cleanForm;

		vm.categories = [];

		vm.tags = [
			{id: 1, description: 'Teste'},
			{id: 2, description: 'Teste2'},
			{id: 3, description: 'Teste3'}
		];

		(function init() {
			loadEnums();
			cleanForm();
		})();

		function cleanForm(form) {
			vm.food = {
				otherNames: [],
				tags: [],
				relatedFood: [],
				containedSubstances: []
			};
			if (form) {
				form.$setUntouched();
			}
		}

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums;
			});
		}

		function transformTag(chip) {
			if (angular.isObject(chip)) {
				return chip;
			}
			return { description: chip };
		}

		function save(food, form) {
			return FoodService.save(food).then(function(response) {
				if (response.status === 200 || response.status === 204) {
					$mdToast.show($mdToast.simple().textContent("Alimento salvo com sucesso").position('top right'));
					cleanForm(form);
					$focus('nameInput');
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