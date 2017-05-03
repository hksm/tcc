(function() {

	'use strict';

	angular.module('tcc').controller('FoodController', Controller);

	Controller.$inject = ['FoodService', 'SubstanceService', 'EnumsService', '$mdDialog', '$mdToast', '$mdPanel', '$q', '$focus'];

	function Controller(FoodService, SubstanceService, EnumsService, $mdDialog, $mdToast, $mdPanel, $q, $focus) {
		var vm = this;
		
		vm.transformTag = transformTag;
		vm.parseCaloricValue = parseCaloricValue;
		vm.expand = expand;
		vm.save = save;
		vm.edit = edit;
		vm.remove = remove;
		vm.queryFood = queryFood;
		vm.querySubstance = querySubstance;
		vm.cleanForm = cleanForm;
		vm.loadPage = loadPage;
		vm.viewFilters = viewFilters;

		vm.categories = [];
		vm.selectedRows = [];

		vm.query = {
			sort: 'name',
			size: 10,
			page: 1,
			filter: ''
		};

		vm.filters = {};

		vm.tags = [
			{id: 1, description: 'Teste'},
			{id: 2, description: 'Teste2'},
			{id: 3, description: 'Teste3'}
		];

		vm.allSubstances = [
			{id: 10, name: 'Substância'},
			{id: 20, name: 'Substância2'},
			{id: 30, name: 'Substância3'}
		];

		(function init() {
			loadEnums();
			cleanForm();
			loadPage();
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

		function parseCaloricValue(item) {
			var arr = [];
			if (item.calories) {
				arr.push(item.calories + ' Kcal');
			}
			if (item.carbs) {
				arr.push('C: ' + item.carbs + ' g');
			}
			if (item.proteins) {
				arr.push('P: ' + item.proteins + ' g');
			}
			if (item.lipids) {
				arr.push('L: ' + item.lipids + ' g');
			}
			return arr.join(', ');
		}

		function expand(item) {
			item.expanded = !item.expanded;
		}

		function save(food, form) {
			return FoodService.save(food).then(function(response) {
				if (response.status === 200 || response.status === 204) {
					$mdToast.show($mdToast.simple().textContent("Alimento salvo com sucesso").position('top right'));
					loadPage();
					cleanForm(form);
					$focus('nameInput');
				} else {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
				}
			}, function() {
				$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
			});
		}

		function loadPage() {
			vm.selectedRows = [];
			vm.loadingPromise = FoodService.getPage(vm.query).then(function(response) {
				vm.foodPage = response.data;
			});
		}

		function edit(food) {
			vm.food = food;
			delete vm.food.expanded;
			vm.selectedTab = 0;
		}

		function remove(food) {
			if (!food || food.length === 0) {
				return;
			}
			var confirm = $mdDialog.confirm()
				.title('Confirmação de exclusão')
				.textContent('Deseja remover ' + (food.length === 1 ? 'o alimento ' : 'os alimentos ') + food.map(f => f.name).join(', ') + '?')
				.ariaLabel('Confirmação de exclusão')
				.ok('Remover')
				.cancel('Cancelar');
			
			$mdDialog.show(confirm).then(function() {
				$q.all(food.map(f => FoodService.remove(f.id))).then(function() {
					$mdToast.show($mdToast.simple().textContent((food.length === 1 ? 'Alimento removido' : 'Alimentos removidos ') + ' com sucesso').position('top right'));
					loadPage();
				}, function(response) {
					console.log(response);
					$mdToast.show($mdToast.simple().textContent('Erro na remoção do alimento "' + '' + '"').position('top right'));
				});
				
			});

			vm.selectedRows = [];
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

		function viewFilters() {
			var position = $mdPanel.newPanelPosition().absolute().center();

			var config = {
				attachTo: angular.element(document.body),
				controller: 'FoodFiltersController',
				controllerAs: 'vm',
				disableParentScroll: true,
				templateUrl: '/components/food/food-filters.html',
				hasBackdrop: true,
				position: position,
				panelClass: 'filters-dialog',
				trapFocus: true,
				zIndex: 150,
				clickOutsideToClose: true,
				escapeToClose: true,
				focusOnOpen: true,
				locals: {
					query: vm.query,
					filters: vm.filters,
					categories: vm.categories,
				}
			};

			$mdPanel.open(config);
		}

	}

})();