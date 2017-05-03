(function() {

	'use strict';

	angular.module('tcc').controller('SubstanceController', Controller);

	Controller.$inject = ['EnumsService', '$mdDialog', '$mdToast', 'SubstanceService', 'FoodService', '$focus'];

	function Controller(EnumsService, $mdDialog, $mdToast, SubstanceService, FoodService, $focus) {
		var vm = this;

		vm.transformTag = transformTag;
		vm.expand = expand;
		vm.save = save;
		vm.edit = edit;
		vm.remove = remove;
		vm.cleanForm = cleanForm;
		vm.queryFood = queryFood;
		vm.loadPage = loadPage;

		vm.selectedRows = [];

		vm.query = {
			sort: 'name',
			size: 10,
			page: 1
		};

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

		function loadPage() {
			vm.selectedRows = [];
			vm.loadingPromise = SubstanceService.getPage(vm.query).then(function(response) {
				vm.substancePage = response.data;
			});
		}

		function expand(item) {
			item.expanded = !item.expanded;
		}

		function save(substance, form) {
			return SubstanceService.save(substance).then(function(response) {
				if (response.status >= 200 && response.status < 300) {
					$mdToast.show($mdToast.simple().textContent("Substância salva com sucesso").position('top right'));
					loadPage();
					cleanForm(form);
					$focus('nameInput');
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
			var filter = 'name==*' + string + '*';
			return FoodService.getPage({filter: filter}).then(function(response) {
				return response.data.content;
			});
		}

	}

})();