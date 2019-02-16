(function() {
    'use strict';

    angular
        .module('app')
        .controller('Tertiary.IndexController', tertiaryController);

    function tertiaryController(MasterService, $state, $scope, $uibModal, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile) {

      	var vm = this;
		var rows = [], getActiveObj = {active: true}, rowObj = {};
		var btnObj = [{"method":"create","title":"Create"}, {"method":"update","title":"Update"}]; 
		loadDefault();

		function loadDefault(){
			$scope.items = ['Product Type','Product Name','Brand','Items'];
			$scope.productSelect = $scope.items[0];
			$scope.authorized = false;
			$scope.productType = {};
			$scope.productName = {};
			$scope.brand = {};
			$scope.item = {};
			vm.dtInstance = {};
			vm.buttons = btnObj[0];
			vm.edit = editRow;
    		vm.delete = deleteRow;
			refreshPicker();
   			loadTable();
		}

		function refreshPicker() {
			// angular.element(document).ready(function() { 
   			// 	$('select').selectpicker("refresh");
   			// });
		}

		function refreshTable() {
			$timeout(function() {
			    $scope.authorized = true;
			}, 0);
			vm.buttons = btnObj[0];
			refreshPicker();
		} 

		$scope.productselectChange = function() {
			loadTable();
		}

		function createdRow(row, data, dataIndex) {
			// Recompiling so we can bind Angular directive to the DT
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return '<button class="btn btn-simple btn-warning btn-icon edit" ng-click="vm.edit(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-edit"></i>' +
			    '</button>&nbsp;' +
			    '<button class="btn btn-simple btn-danger btn-icon remove" ng-click="vm.delete(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-trash-o"></i>' +
			    '</button>';
		}

        function loadTable() {   			
     		switch($scope.productSelect) {
            	case $scope.items[0]:
            		MasterService.readProductType().then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions()
		                	.withOption('data', rows)
						  	.withPaginationType('full_numbers')
						 	.withOption('createdRow', createdRow);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('type').withTitle('Product Type'),
					  		DTColumnBuilder.newColumn('category').withTitle('Product Category'),
							DTColumnBuilder.newColumn('code').withTitle('Product Code'),
						   	DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
								.renderWith(actionsHtml)
						];
						refreshTable();
					});
                    break;

            	case $scope.items[1]:
            		MasterService.readProductName().then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions()
		                	.withOption('data', rows)
						  	.withPaginationType('full_numbers')
						 	.withOption('createdRow', createdRow);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('name').withTitle('Product Name'),
					  		DTColumnBuilder.newColumn('type.type').withTitle('Product Type'),
					  		DTColumnBuilder.newColumn('type.type').withTitle('Product Type').notVisible(),
					  		/*DTColumnBuilder.newColumn('serialNumLen').withTitle('Serial No. Length'),*/
					  		DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
								.renderWith(actionsHtml)
						];
						refreshTable();
					});
	                break;

	            case $scope.items[2]:
	            	MasterService.readProductBrand().then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions()
		                	.withOption('data', rows)
						  	.withPaginationType('full_numbers')
						 	.withOption('createdRow', createdRow);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('code').withTitle('Brand Code'),
					  		DTColumnBuilder.newColumn('name').withTitle('Brand Name'),
					  		DTColumnBuilder.newColumn('name').withTitle('Brand Name').notVisible(),
					  		DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
								.renderWith(actionsHtml)
						];
						refreshTable();
					});
                    break;

	            case $scope.items[3]:
	            	MasterService.readProductItem().then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions()
		                	.withOption('data', rows)
						  	.withPaginationType('full_numbers')
						 	.withOption('createdRow', createdRow);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('itemName').withTitle('Item Name'),
					  		DTColumnBuilder.newColumn('brandName.name').withTitle('Brand Name'),
					  		DTColumnBuilder.newColumn('prodName.name').withTitle('Product Name'),
					  		DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
								.renderWith(actionsHtml)
						];
						refreshTable();
					});
	            	break;

	            default:
	            	alert('None of the options match');
		    }
		}

		function editRow(row){
	    	rowObj = angular.copy(rows.find(obj => obj._id === row));
	    	vm.buttons = btnObj[1];

			switch($scope.productSelect) {
				case $scope.items[0]:
					$scope.addNew(rowObj);
					break;

				case $scope.items[1]:
					$scope.addNew(rowObj);
					break;

	            case $scope.items[2]:
					$scope.addNew(rowObj);
					break;

	            case $scope.items[3]:
					$scope.addNew(rowObj);
					break;

	            default: alert('None of options match');
	        }
		}
        
		$scope.addNew = function(rowObj) {
			switch($scope.productSelect) {

				case $scope.items[0]:
					var modalInstance = $uibModal.open({
						templateUrl: 'productType.html',
						controller: function addProductTypeController(MasterService, $scope, $uibModalInstance) {
	    					
	    					$scope.buttons = vm.buttons;
							$scope.prodCategory = ['Goods','Services'];
							$scope.productType = {};
							$scope.productType['category'] = $scope.prodCategory[0];
							$scope.categoryVal = 'HSN';
							
							$scope.prodCategoryChange = function(){
								if($scope.productType.category == $scope.prodCategory[0])
									$scope.categoryVal = 'HSN';
								else
									$scope.categoryVal = 'SAC';
							}

							if(rowObj){
								$scope.productType = rowObj;
								$scope.prodCategoryChange();
							}

							angular.element(document).ready(function() { 
								$('select').selectpicker("refresh"); 
							});

		          			$scope.create = function(){
		          				if($scope.productType) {
									MasterService.saveProductType($scope.productType).then(function(res) {
										$scope.productType.type = undefined;
										$scope.productType.code = undefined;
										loadTable();
									});
								}
		          			}

		          			$scope.update = function(){
		          				if($scope.productType) {
									MasterService.updateProductType($scope.productType).then(function(res) {
										loadTable();
										$uibModalInstance.close();
									});
								}
		          			}

							$scope.close = function() {
								loadTable();
								$uibModalInstance.close();
							};

						}
					});
					break;

				case $scope.items[1]:
					
					var modalInstance = $uibModal.open({
						templateUrl: 'productName.html',
						controller: function addProductNameController(MasterService, $scope, $uibModalInstance) {
							
							$scope.buttons = vm.buttons;
							initProdNameCont();
							
							function initProdNameCont() {
								MasterService.readProductType().then(function(res) {
									if(res.status == 200)
		                				$scope.productTypeList = res.data;
		                   		});

		                   		MasterService.readUnit({active: true}).then(function(res) {
		                   			if(res.status == 200)
		                				$scope.productUnitList = res.data;
		                			angular.element(document).ready(function() { 
										$('select').selectpicker("refresh"); 
									});
		                   		});

		                   		loadDefault();
							}

							function loadDefault() {					
								$scope.disableSerialVal = false;
		                   		$scope.productName = {};
		                   		$scope.productName['serialNumCount'] = 2;

		                   		if(rowObj){
									$scope.productName = rowObj;
									$scope.productName.type = rowObj.type._id;
									$scope.productName.unit = rowObj.unit._id;
    			   					$scope.productName.code = rowObj.code._id;
									if(!rowObj.serialNumLen){
										$scope.disableSerialVal = true;
									}
								}

								angular.element(document).ready(function() { 
									$('select').selectpicker("refresh"); 
								});
							}

							$scope.$watch('disableSerialVal', function(val) {
								if(val) {
									$scope.productName.serialNumLen = null;
								}	
							});

    			   			$scope.productTypeChange = function() {
    			   				var ptlInd = $scope.productTypeList.findIndex(x => x._id == $scope.productName.type);
    			   				$scope.productName.code = $scope.productTypeList[ptlInd]._id;
    			   			}

							$scope.create = function() {
		          				if($scope.productName) {
									MasterService.saveProductName($scope.productName).then(function(res) {
										loadDefault();
										loadTable();
									});
								}
		          			}

		          			$scope.update = function() {
		          				if($scope.productName) {
									MasterService.updateProductName($scope.productName).then(function(res) {
										loadTable();
										$uibModalInstance.close();
									});
								}
		          			}

							$scope.close = function() {
								loadTable();
								$uibModalInstance.close();
							};
							
						}
					});
					break;

				case $scope.items[2]:
					var modalInstance = $uibModal.open({
						templateUrl: 'brand.html',
						controller: function addProductBrandController(MasterService, $scope, $uibModalInstance) {

							$scope.buttons = vm.buttons;
							if(rowObj){
								$scope.brand = rowObj;
							}

							$scope.create = function() {
		          				if($scope.brand) {
									MasterService.saveProductBrand($scope.brand).then(function(res) {
										$scope.brand = {};
										loadTable();
									});
								}
		          			}

		          			$scope.update = function() {
		          				if($scope.brand) {
									MasterService.updateProductBrand($scope.brand).then(function(res) {
										loadTable();
										$uibModalInstance.close();
									});
								}
		          			}

							$scope.close = function() {
								loadTable();
								$uibModalInstance.close();
							};
							
						}
					});
					break;

				case $scope.items[3]:
					var modalInstance = $uibModal.open({
						templateUrl: 'item.html',
						controller: function addProductItemController(MasterService, $scope, $uibModalInstance) {

							$scope.buttons = vm.buttons;
							initController();

							function initController() {
								MasterService.readProductBrand().then(function(res) {
									if(res.status == 200)
		                				$scope.brandNameList = res.data;
		                   		});

		                   		MasterService.readProductName().then(function(res) {
		                   			if(res.status == 200)
		                				$scope.prodNameList = res.data;
									angular.element(document).ready(function() { 
										$('select').selectpicker("refresh"); 
									});
		                   		});

		                   		loadDefault();
		               		}

							function loadDefault() {
								$scope.inventTypes = ['Consumable', 'Non consumable'];
								$scope.disableSerialVal = false;
								$scope.item = {};

								if(rowObj){
									$scope.item = rowObj;
									$scope.item.brandName = rowObj.brandName._id;
									$scope.item.prodName = rowObj.prodName._id;
									if(!rowObj.serialNumLen)
										$scope.disableSerialVal = true;
								}

		                   		angular.element(document).ready(function() { 
									$('select').selectpicker("refresh"); 
								});
							}

							$scope.productNameChange = function() {
								var pnlInd = $scope.prodNameList.findIndex(x => x._id == $scope.item.prodName);
		   						if(!$scope.prodNameList[pnlInd].serialNumLen){
                                    $scope.disableSerialVal = true;
                                    $scope.item.serialNumLen = undefined;
                                }
                                else{
                                    $scope.disableSerialVal = false;
                                    $scope.item.serialNumLen = $scope.prodNameList[pnlInd].serialNumLen;
                                }
    			   			}

							$scope.create = function() {
		          				if($scope.item) {
									MasterService.saveProductItem($scope.item).then(function(res) {
										loadDefault();
										loadTable();
									});
								}
		          			}

		          			$scope.update = function() {
		          				if($scope.item) {
									MasterService.updateProductItem($scope.item).then(function(res) {
										loadTable();
										$uibModalInstance.close();
									});
								}
		          			}

							$scope.close = function(allocate) {
								loadTable();
								$uibModalInstance.close();
							}
							
						}
					});
					break;

				default:
					alert('None of the above options match');

			}
		}

		function deleteRow(row){

			switch($scope.productSelect) {
				case $scope.items[0]:
					MasterService.removeProductType({'_id': row}).then(function(res) {
						loadTable();
					});
					break;

				case $scope.items[1]:
					MasterService.removeProductName({'_id': row}).then(function(res) {
						loadTable();
					});
					break;

	            case $scope.items[2]:
					MasterService.removeProductBrand({'_id': row}).then(function(res) {
						loadTable();
					});
					break;

	            case $scope.items[3]:
					MasterService.removeProductItem({'_id': row}).then(function(res) {
						loadTable();
					});
					break;

	            default: alert('None of options match');
	        }
		}
    
    }

})();