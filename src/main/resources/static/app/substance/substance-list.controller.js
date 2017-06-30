(function() {

	'use strict';

	angular.module('tcc').controller('SubstanceListController', Controller);

	Controller.$inject = ['EnumsService', '$mdDialog', '$mdToast', 'SubstanceService', '$q', '$location', '$mdPanel'];

	function Controller(EnumsService, $mdDialog, $mdToast, SubstanceService, $q, $location, $mdPanel) {
		var vm = this;

		vm.edit = edit;
		vm.remove = remove;
		vm.loadPage = loadPage;
		vm.formatOtherNames = formatOtherNames;
		vm.viewFilters = viewFilters;

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
			vm.loadingPromise = SubstanceService.getPage(vm.query).then(function(response) {
				vm.substancePage = response.data;
			});
		}

		function edit(substance) {
			$location.path('/substance/form/' + substance.id);
		}

		function remove(substance) {
			if (!substance || substance.length === 0) {
				return;
			}
			var confirm = $mdDialog.confirm()
				.title('Confirmação de exclusão')
				.textContent('Deseja remover ' + (substance.length === 1 ? 'a substância ' : 'as substâncias ') + substance.map(s => s.name).join(', ') + '?')
				.ariaLabel('Confirmação de exclusão')
				.ok('Remover')
				.cancel('Cancelar');
			
			$mdDialog.show(confirm).then(function() {
				$q.all(substance.map(s => SubstanceService.remove(s.id))).then(function() {
					$mdToast.show($mdToast.simple().textContent((substance.length === 1 ? 'Substância removida' : 'Substâncias removidas ') + ' com sucesso').position('top right'));
					loadPage();
					window.scroll(0,0);
				}, function() {
					$mdToast.show($mdToast.simple().textContent('Erro na remoção da substância "' + '' + '"').position('top right'));
					window.scroll(0,0);
				});
				
			});
		}

		function formatOtherNames(names) {
			if (!names) {
				return '';
			}
			return names.join(', ');
		}



		function viewFilters() {
			var position = $mdPanel.newPanelPosition().absolute().center();

			var config = {
				attachTo: angular.element(document.body),
				controller: 'SubstanceFiltersController',
				controllerAs: 'vm',
				disableParentScroll: true,
				templateUrl: '/app/substance/substance-filters.html',
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
					filters: vm.filters
				}
			};

			$mdPanel.open(config);
		}

	}

})();