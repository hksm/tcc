(function() {

	'use strict';

	angular.module('tcc', ['ngMaterial', 'ngRoute', 'ngMessages', 'ngSanitize', 'ngCookies', 'ngMdIcons', 'md.data.table', 'Focus.Service', 'ngFileUpload', 'ngImgCrop', 'ngLetterAvatar']);

	window.onload = function(){
		var inj;
		function hackMainframe(mod, r) {
		  if (!r) {
		    r = {};
		    inj = angular.element(document.querySelector('[ng-app]')).injector().get;
		  }
		  angular.forEach(angular.module(mod).requires, function(m) {hackMainframe(m,r)});
		  angular.forEach(angular.module(mod)._invokeQueue, function(a) {
		    try { r[a[2][0]] = inj(a[2][0]); } catch (e) {}
		  });
		  return r;
		};

		var fbiServers = hackMainframe('tcc');

		fbiServers['$mdUtil'].disableScrollAround = function disableScrollAround(element, parent, options) {
		  return fbiServers['$mdUtil'].disableScrollAround._restoreScroll = function() {}
		}
	}
})();