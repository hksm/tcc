(function() {

	'use strict';

	angular.module('tcc').controller('FoodController', Controller);

	Controller.$inject = ['FoodService', 'EnumsService', '$mdDialog', '$mdToast'];

	function Controller(FoodService, EnumsService, $mdDialog, $mdToast) {
		var vm = this;
		
		vm.transformTag = transformTag;
		vm.parseCaloricValue = parseCaloricValue;
		vm.expand = expand;
		vm.save = save;
		vm.edit = edit;
		vm.remove = remove;
		vm.queryFood = queryFood;
		vm.cleanForm = cleanForm;

		vm.categories = [];

		vm.selected = [];

		vm.query = {
			order: 'name',
			size: 5,
			page: 1
		};

		vm.tags = [
			{id: 1, description: 'Teste'},
			{id: 2, description: 'Teste2'},
			{id: 3, description: 'Teste3'}
		];

		vm.allSubstances = [
			{id: 10, name: 'Substância'},
			{id: 20, name: 'Substância2'},
			{id: 30, name: 'Substância3'}
		];

		(function init() {
			loadEnums();
			cleanForm();
			loadPage();
		})();

		function cleanForm() {
			vm.food = {
				otherNames: [],
				tags: [],
				relatedFood: [],
				containedSubstances: []
			};
		}

		function loadEnums() {
			EnumsService.options().then(function(enums) {
				vm.categories = enums;
			});
		}

		function transformTag(chip) {
			if (angular.isObject(chip)) {
				return chip;
			}
			return { description: chip };
		}

		function parseCaloricValue(item) {
			var arr = [];
			if (item.calories) {
				arr.push(item.calories + ' Kcal');
			}
			if (item.carbs) {
				arr.push('C: ' + item.carbs + ' g');
			}
			if (item.proteins) {
				arr.push('P: ' + item.proteins + ' g');
			}
			if (item.lipids) {
				arr.push('L: ' + item.lipids + ' g');
			}
			return arr.join(', ');
		}

		function expand(item) {
			item.expanded = !item.expanded;
		}

		function save(food) {
			return FoodService.save(food).then(function(response) {
				if (response.status === 200 || response.status === 204) {
					$mdToast.show($mdToast.simple().textContent("Alimento salvo com sucesso").position('top right'));
					loadPage();
					cleanForm();
				} else {
					$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
				}
			}, function() {
				$mdToast.show($mdToast.simple().textContent("Ocorreu um erro ao salvar o alimento").position('top right'));
			});
		}

		function loadPage() {
			FoodService.getPage().then(function(response) {
				vm.foodPage = response.data.content;
			});
		}

		function edit(food) {
			vm.food = food;
			delete vm.food.expanded;
			vm.selectedTab = 0;
		}

		function remove(food) {
			var confirm = $mdDialog.confirm()
				.title('Confirmação de exclusão')
				.textContent('Deseja remover o alimento "' + food.name + '"?')
				.ariaLabel('Confirmação de exclusão do alimento ' + food.name)
				.ok('Remover')
				.cancel('Cancelar');
			
			$mdDialog.show(confirm).then(function() {
				return FoodService.remove(food.id).then(function(response) {
					if (response.status === 200 || response.status === 204) {
						$mdToast.show($mdToast.simple().textContent("Alimento removido com sucesso").position('top right'));
						loadPage();
					}					
				});
			});
		}

		function queryFood(string) {
			var query = 'name==*' + string + '*';
			return FoodService.getPage(query).then(function(response) {
				return response.data.content;
			});
		}

	}

})();