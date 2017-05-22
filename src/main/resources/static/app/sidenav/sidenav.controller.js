(function() {

	'use strict';

	angular.module('tcc').controller('SidenavController', Controller);

	Controller.$inject = ['$scope', '$mdSidenav'];

	function Controller($scope, $mdSidenav) {
		var vm = this;

		$scope.close = function () {
			// Component lookup should always be available since we are not using `ng-if`
			$mdSidenav('left').close();

	    };
	}

})();