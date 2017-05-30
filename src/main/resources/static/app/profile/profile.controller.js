(function() {

	'use strict';

	angular.module('tcc').controller('ProfileController', Controller);

	Controller.$inject = ['ProfileService', 'SubstanceService', 'FoodService', 'EnumsService', 'AuthService', '$mdToast', 'ImageService', '$scope'];

	function Controller(ProfileService, SubstanceService, FoodService, EnumsService, AuthService, $mdToast, ImageService, $scope) {
		var vm = this;

		vm.save = save;
		vm.queryFood = queryFood;
		vm.querySubstance = querySubstance;
		vm.cleanForm = cleanForm;

		(function init() {
			loadEnums();
			cleanForm();
			loadProfile();
		})();

		function cleanForm(form) {
			if (!vm.profile) {
				vm.profile = {};
			}
			vm.profile.fullName = undefined;
			vm.profile.food = [];
			vm.profile.substance = [];
			vm.searchTextFood = '';
			vm.searchTextSubstance = '';
			if (form) {
				form.$setUntouched();
			}
		}

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums.category;
				vm.units = enums.unit;
			});
		}

		function save(profile) {
			return ImageService.post($scope.croppedDataUrl).then(function(response) {
				if (response.data && response.data.id) {
					profile.imageId = response.data.id;
				}
			}).finally(function() {
				ProfileService.save(profile).then(function(response) {
					if (response.status === 200 || response.status === 204) {
						$mdToast.show($mdToast.simple().textContent("Perfil salvo com sucesso").position('top right'));
						loadProfile();
					} else {
						$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o perfil").position('top right'));
					}
				}, function() {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o perfil").position('top right'));
				});
			});
		}

		function loadProfile() {
			vm.loadingPromise = ProfileService.get().then(function(response) {
				if (response.data) {
					vm.profile = response.data;
				}
			});
		}

		function queryFood(string) {
			var filter = 'name==*' + string + '*';
			return FoodService.getPage({filter: filter}).then(function(response) {
				return response.data.content;
			});
		}

		function querySubstance(string) {
			var filter = 'name==*' + string + '*';
			return SubstanceService.getPage({filter: filter}).then(function(response) {
				return response.data.content;
			});
		}

	}

})();