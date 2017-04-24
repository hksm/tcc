(function() {

	'use strict';

	angular.module('tcc').controller('SubstanceController', Controller);

	Controller.$inject = ['EnumsService', '$mdDialog', '$mdToast', 'SubstanceService', 'FoodService'];

	function Controller(EnumsService, $mdDialog, $mdToast, SubstanceService, FoodService) {
		var vm = this;

		vm.transformTag = transformTag;
		vm.expand = expand;
		vm.save = save;
		vm.edit = edit;
		vm.remove = remove;
		vm.queryFood = queryFood;

		(function init() {
			loadEnums();
			cleanForm();
			loadPage();
		})();

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums;
			});
		}

		function cleanForm() {
			vm.substance = {
			names: [],
			containedInFood: []
		};
		}

		function transformTag(chip) {
			if (angular.isObject(chip)) {
				return chip;
			}
			return { description: chip };
		}

		function loadPage() {
			SubstanceService.getPage().then(function(response) {
				vm.substancePage = response.data.content;
			});
		}

		function expand(item) {
			item.expanded = !item.expanded;
		}

		function save(substance) {
			return SubstanceService.save(substance).then(function(response) {
				if (response.status === 200 || response.status === 204) {
					$mdToast.show($mdToast.simple().textContent("Substância salva com sucesso").position('top right'));
					loadPage();
					cleanForm();
				} else {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar a substância").position('top right'));
				}
			}, function() {
				$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar a substância").position('top right'));
			});
		}

		function edit(substance) {
			vm.substance = substance;
			delete vm.substance.expanded;
			vm.selectedTab = 0;
		}

		function remove(substance) {
			var confirm = $mdDialog.confirm()
				.title('Confirmação de exclusão')
				.textContent('Deseja remover a substância "' + substance.names[0] + '"?')
				.ariaLabel('Confirmação de exclusão da substância ' + substance.names[0])
				.ok('Remover')
				.cancel('Cancelar');
			
			$mdDialog.show(confirm).then(function() {
				return SubstanceService.remove(substance.id).then(function(response) {
					if (response.status === 200 || response.status === 204) {
						$mdToast.show($mdToast.simple().textContent("Substância removida com sucesso").position('top right'));
						loadPage();
					}					
				});
			});
		}

		function queryFood(string) {
			var query = 'name==*' + string + '*';
			return FoodService.getPage(query).then(function(response) {
				return response.data.content;
			});
		}

	}

})();