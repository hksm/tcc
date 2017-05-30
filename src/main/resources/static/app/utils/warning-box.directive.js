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
			templateUrl: '/app/utils/templates/warning-box.template.html',
			link: function(scope, elem, attr, ctrl, $transclude){
				$transclude(function(clone) {
					if (!clone.length) {
						scope.noPadding = true;
					}
				});
			}
		};
	}

})();