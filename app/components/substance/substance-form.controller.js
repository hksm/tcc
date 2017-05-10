(function() {

	'use strict';

	angular.module('tcc').controller('SubstanceFormController', Controller);

	Controller.$inject = ['EnumsService', '$mdDialog', '$mdToast', 'SubstanceService', 'FoodService', '$focus'];

	function Controller(EnumsService, $mdDialog, $mdToast, SubstanceService, FoodService, $focus) {
		var vm = this;

		vm.transformTag = transformTag;
		vm.save = save;
		vm.cleanForm = cleanForm;
		vm.queryFood = queryFood;

		(function init() {
			loadEnums();
			cleanForm();
		})();

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums;
			});
		}

		function cleanForm(form) {
			vm.substance = {
				name: undefined,
				containedInFood: []
			};
			if (form) {
				form.$setUntouched();
			}
		}

		function transformTag(chip) {
			if (angular.isObject(chip)) {
				return chip;
			}
			return { description: chip };
		}

		function save(substance, form) {
			return SubstanceService.save(substance).then(function(response) {
				if (response.status >= 200 && response.status < 300) {
					$mdToast.show($mdToast.simple().textContent("Substância salva com sucesso").position('top right'));
					cleanForm(form);
					$focus('nameInput');
				} else {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar a substância").position('top right'));
				}
			}, function() {
				$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar a substância").position('top right'));
			});
		}

		function queryFood(string) {
			var filter = 'name==*' + string + '*';
			return FoodService.getPage({filter: filter}).then(function(response) {
				return response.data.content;
			});
		}

	}

})();