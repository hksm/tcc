(function() {

	'use strict';

	angular.module('tcc').controller('HomeController', Controller);

	Controller.$inject = ['FavoriteService'];

	function Controller(FavoriteService) {
		var vm = this;

		vm.favorites = [];

		vm.removeFavorite = removeFavorite;

		(function init() {
			loadFavorites();
		})();

		function loadFavorites() {
			FavoriteService.getAll().then(function(response) {
				vm.favorites = response.data.content;
			});
		}

		function removeFavorite(item) {
			FavoriteService.remove(item.id).then(function() {
				vm.favorites.splice(vm.favorites.indexOf(item), 1);
			});
		}
	}

})();