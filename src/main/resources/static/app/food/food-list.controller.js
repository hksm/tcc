(function() {

	'use strict';

	angular.module('tcc').controller('FoodListController', Controller);

	Controller.$inject = ['FoodService', 'SubstanceService', 'EnumsService', '$mdDialog', '$mdToast', '$mdPanel', '$q', '$location'];

	function Controller(FoodService, SubstanceService, EnumsService, $mdDialog, $mdToast, $mdPanel, $q, $location) {
		var vm = this;
		
		vm.edit = edit;
		vm.remove = remove;
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

		(function init() {
			loadEnums();
			loadPage();
		})();

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums.category;
				vm.units = enums.unit;
			});
		}

		function loadPage() {
			vm.selectedRows = [];
			vm.loadingPromise = FoodService.getPage(vm.query).then(function(response) {
				vm.foodPage = response.data;
			});
		}

		function edit(food) {
			$location.path('/food/form/' + food.id);
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
				}, function() {
					$mdToast.show($mdToast.simple().textContent('Erro na remoção do alimento "' + '' + '"').position('top right'));
				});
				
			});

			vm.selectedRows = [];
		}

		function viewFilters() {
			var position = $mdPanel.newPanelPosition().absolute().center();

			var config = {
				attachTo: angular.element(document.body),
				controller: 'FoodFiltersController',
				controllerAs: 'vm',
				disableParentScroll: true,
				templateUrl: '/app/food/food-filters.html',
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