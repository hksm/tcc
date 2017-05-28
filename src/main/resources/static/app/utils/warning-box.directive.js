(function() {

	'use strict';

	angular.module('tcc').directive('warningBox', Directive);

	Directive.$inject = [];

	function Directive() {
		return {
			scope: {
				message: '@'
			},
			transclude: true,
			templateUrl: '/app/utils/templates/warning-box.template.html'
		};
	}

})();