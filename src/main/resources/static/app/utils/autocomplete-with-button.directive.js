(function() {

	'use strict';

	angular.module('tcc').directive('autocompleteWithButton', Directive);

	Directive.$inject = [];

	function Directive() {
		return {
			scope: {
				querySearch: '=',
				list: '=',
				searchText: '=',
				placeholder: '@'
			},
			templateUrl: '/app/utils/templates/autocomplete-with-button.template.html', 
			link: function(scope, element) {
				element.on('keydown', function(e) {
					if (e.which == 13 && scope.list.indexOf(scope.selectedItem) === -1 && scope.selectedItem) {
						scope.$apply(function() {
							scope.list.push(scope.selectedItem);
							scope.selectedItem = undefined;
						});
					}
				});

				scope.add = function(item) {
					if (scope.list.indexOf(item) === -1 && item) {
						scope.list.push(item);
						scope.selectedItem = undefined;
					}
				};
			}
		};
	}

})();