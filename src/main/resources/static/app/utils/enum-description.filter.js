(function() {

	'use strict';

	angular.module('tcc').filter('enumDescription', Filter);

	Filter.$inject = [];

	function Filter() {
		return function(input, _enum) {
			var found = _enum.filter(e => e.level === input || e.enum === input);
			if (found && found[0]) {
				return found[0].name;
			}
			return input;
		};
	}

})();