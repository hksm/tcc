(function() {

	'use strict';

	angular.module('tcc').directive('listboxOptions', Directive);

	Directive.$inject = [];

	function Directive() {
		return {
			scope: {
				list: '=',
				categories: '='
			},
			template: 
				'<md-list layout="row" layout-wrap class="listbox-container">' +
                	'<md-list-item class="md-2-line listbox-option" ng-repeat="item in list track by item.id" layout="row" layout-wrap flex-gt-sm="20" flex-sm="25" flex-xs="50">' +
                		'<div class="md-item-text md-whiteframe-z1" flex>' +
                        	'<h3>{{item.name}}</h3>' +
                        	'<p ng-if="item.category">{{item.category | enumDescription: categories}}</p>' +
                        	'<ng-md-icon icon="close" size="16" class="close-icon" ng-click="remove($index)"></ng-md-icon>' +
                    	'</div>' +
            		'</md-list-item>' +
            	'</md-list>',
			link: function(scope) {
				scope.remove = function(index) {
					scope.list.splice(index, 1);
				};
			}
		};
	}

})();