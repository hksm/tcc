(function() {

	'use strict';

	angular.module('tcc').controller('SubstanceFiltersController', Controller);

	Controller.$inject = [];

	function Controller() {
		var vm = this;
		vm.parseFilter = parseFilter;
		vm.close = close;

		(function init() {
			if (vm.filters && !vm.filters.mode) {
				vm.filters.mode = 'and';
			}
		})();

		function parseFilter() {
			var arr = [];
			if (vm.filters.name) {
				arr.push('(name==\'*' + vm.filters.name + '*\' or otherNames==\'*' + vm.filters.name + '*\')');
			}
			if (vm.filters.isAlergenic) {
				arr.push('alergenic==true');
			}
			vm.query.filter = arr.join(' ' + vm.filters.mode + ' ');
		}

		function close() {
			if (vm.mdPanelRef) {
				vm.mdPanelRef.close().then(function() {
					vm.mdPanelRef.destroy();
				});
			}
		}

	}

})();