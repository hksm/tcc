(function() {

	'use strict';

	angular.module('tcc').controller('FoodFormController', Controller);

	Controller.$inject = ['$scope', 'FoodService', 'SubstanceService', 'ImageService', 'EnumsService', '$mdDialog', '$mdToast', '$mdPanel', '$q', '$location', '$focus', 'foodRequest'];

	function Controller($scope, FoodService, SubstanceService, ImageService, EnumsService, $mdDialog, $mdToast, $mdPanel, $q, $location, $focus, foodRequest) {
		var vm = this;
    		
		vm.transformTag = transformTag;
		vm.save = save;
		vm.queryFood = queryFood;
		vm.querySubstance = querySubstance;
		vm.cleanForm = cleanForm;

		vm.categories = [];

		$scope.$watch('picFile', a => {
			if (a === undefined) return; // watch for rolling rocks

			var el = document.getElementsByTagName('img-crop')[0]; // hopefully only one of these in the page

			if (!el.getAttribute('style')) {
				// is first run. no style attr. add
				el.setAttribute('style', `
					background: url('/api/images/${vm.food.imageId}');
					background-size: 250px 250px;
				`);
			} else {
				// 2nd run... clear attr (could also add a boolean outside scope but i think this looks nicer...)
				el.setAttribute('style', '');
			}
			//.getAttribute('style')
		});

		(function init() {
			loadEnums();
			if (foodRequest && foodRequest.data) {
				vm.food = foodRequest.data;
				if (foodRequest.data.imageId) {
					ImageService.get(foodRequest.data.imageId).then(function(response) {
						$scope.picFile = new File([response.data.image], response.data.filename);
					});
				}
			} else {
				cleanForm();
			}
		})();

		function cleanForm(form) {
			vm.food = {
				otherNames: [],
				relatedFood: [],
				containedSubstances: []
			};
			vm.searchTextSubstance = '';
			vm.searchTextFood = '';
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

		function transformTag(chip) {
			if (angular.isObject(chip)) {
				return chip;
			}
			return { description: chip };
		}

		function save(food, form, remain) {
			return ImageService.post($scope.croppedDataUrl).then(function(response) {
				if (response.data && response.data.id) {
					food.imageId = response.data.id;
				}
			}).finally(function() {
				FoodService.save(food).then(function(response) {
					if (response.status === 200 || response.status === 204) {
						$mdToast.show($mdToast.simple().textContent("Alimento salvo com sucesso").position('top right'));
						window.scroll(0,0);
						if (remain) {
							cleanForm(form);
							$focus('nameInput');
						} else {
							$location.path('/food/list');
						}
					} else {
						$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
						window.scroll(0,0);
					}
				}, function() {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
					window.scroll(0,0);
				});
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