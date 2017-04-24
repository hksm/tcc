(function() {

	'use strict';

	angular.module('tcc').directive('numbersOnly', Directive);

	Directive.$inject = [];

	function Directive() {
		return {
			scope: {
				appendUnit: '@',
				appendLocation: '@',
				integer: '=',
				decimal: '='
			},
			require: 'ngModel',
			link: function(scope, element, attrs, modelCtrl) {
				modelCtrl.$parsers.unshift(function(value) {
					console.log('teste parser: ' + value);
					var transformedInput = value.replace(/[^0-9,]/g, '').replace(/^(.*?),(.*?),(.*)$/, '$1,$2$3');
					var index = transformedInput.indexOf(',');
					if (index === 0) {
						transformedInput = '';
					}
					if (transformedInput.length > scope.integer && index === -1) {
						transformedInput = transformedInput.slice(0, scope.integer) + "," + transformedInput.slice(scope.integer);
						index = scope.integer;
					}
					if (index > 0 && transformedInput.length > scope.integer + scope.decimal + 1) {
						transformedInput = transformedInput.slice(0, scope.integer + scope.decimal + 1);
					}
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
					return transformedInput;
				});

				element.on('blur', function() {
					var value = element.val();
					if (value && value.indexOf(scope.appendUnit) === -1) {
						if (value.endsWith(',')) {
							value = value.slice(0, -1);
						}
						modelCtrl.$viewValue = value + ' ' + scope.appendUnit;
						modelCtrl.$render();
					}
		        });

		        element.on('focus', function() {
					if (element.val()) {
						modelCtrl.$viewValue = element.val().replace(new RegExp(scope.appendUnit, 'g'), '').trim();
						modelCtrl.$render();
					}
		        });
			}
		};
	}

})();