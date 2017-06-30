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

		//var insertListener = function(event){
		//	if (event.animationName == "nodeInserted") {
		//		console.warn("node insert! ", event, event.target);
		//		
		//	}
		//}
//
		//document.addEventListener("animationstart", insertListener, false); // standard + firefox
		//document.addEventListener("MSAnimationStart", insertListener, false); // IE
		//document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari

		$scope.$watch('picFile', a => {
			if (a === undefined) return; // watch for rolling rocks

			var el = document.getElementsByTagName('img-crop')[0]; // hopefully only one of these in the page

			//el.setAttribute('style', '');

			if (!el.getAttribute('style')) {
				// is first run. no style attr. add
				el.setAttribute('style', `
					background: url('/api/images/${vm.profile.imageId}');
					background-size: 250px 250px;
				`);
			} else {
				// 2nd run... clear attr (could also add a boolean outside scope but i think this looks nicer...)
				el.setAttribute('style', '');
			}

		});

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
						window.scroll(0,0);
					} else {
						$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o perfil").position('top right'));
						window.scroll(0,0);
					}
				}, function() {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o perfil").position('top right'));
					window.scroll(0,0);
				});
			});
		}

		function loadProfile() {
			vm.loadingPromise = ProfileService.get().then(function(response) {
				if (response.data) {
					vm.profile = response.data;

					// hack for image
					document.getElementsByTagName('img-crop')[0].setAttribute('style', `
						background: url('/api/images/${vm.profile.imageId}');
						background-size: 250px 250px;
					`);
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