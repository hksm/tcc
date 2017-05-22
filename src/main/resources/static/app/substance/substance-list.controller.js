(function() {

	'use strict';

	angular.module('tcc').controller('SubstanceListController', Controller);

	Controller.$inject = ['EnumsService', '$mdDialog', '$mdToast', 'SubstanceService', '$q', '$location'];

	function Controller(EnumsService, $mdDialog, $mdToast, SubstanceService, $q, $location) {
		var vm = this;

		vm.edit = edit;
		vm.remove = remove;
		vm.loadPage = loadPage;

		vm.selectedRows = [];

		vm.query = {
			sort: 'name',
			size: 10,
			page: 1
		};

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
				}, function() {
					$mdToast.show($mdToast.simple().textContent('Erro na remoção da substância "' + '' + '"').position('top right'));
				});
				
			});
		}

	}

})();