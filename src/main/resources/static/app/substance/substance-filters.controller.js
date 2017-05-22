(function() {

	'use strict';

	angular.module('tcc').controller('FoodFiltersController', Controller);

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
			vm.filters.categories = vm.categories.filter(c => c.filtered);
			var arr = [];
			if (vm.filters.name) {
				arr.push('name==*' + vm.filters.name + '*');
			}
			if (vm.filters.isAlergenic) {
				arr.push('alergenic==true');
			}
			if (vm.filters.categories) {
				arr.push('category=in=(' + vm.filters.categories.map(c => c.enum) + ')');
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