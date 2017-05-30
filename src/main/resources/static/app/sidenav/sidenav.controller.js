(function() {

	'use strict';

	angular.module('tcc').controller('SidenavController', Controller);

	Controller.$inject = ['$scope', '$rootScope', '$mdSidenav'];

	function Controller($scope, $rootScope, $mdSidenav) {
		
		$scope.close = function() {
			$mdSidenav('left').close();
	    };

	}

})();