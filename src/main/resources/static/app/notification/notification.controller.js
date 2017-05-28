(function() {

	'use strict';

	angular.module('tcc').controller('NotificationController', Controller);

	Controller.$inject = ['NotificationService', '$rootScope'];

	function Controller(NotificationService, $rootScope) {
		var vm = this;

		vm.loadNotifications = loadNotifications;
		vm.closeNotification = closeNotification;

		vm.notifications = [];

		(function init() {
			loadNotifications();			
		})();

		function loadNotifications() {
			NotificationService.findByUser().then(function(response) {
				vm.notifications = response.data || [];
			});
		}

		function closeNotification(notification) {
			NotificationService.dispense(notification.id).then(function() {
				vm.notifications.splice(vm.notifications.indexOf(notification), 1);
				$rootScope.notificationsCount--;
			});
		}
	}

})();