(function() {
    'use strict';
    angular.module('app').controller('Product.IndexController', productMasterController);

    function productMasterController(MasterService, SettingService, UserService, ExcelService, $scope, $uibModal, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile) {

      	var vm=this, rows=[], getActiveObj={active:true}, rowObj={}, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}];
		vm.spName = "Serial Number";
		vm.addNew = addNew;
		loadDefault();

		function loadDefault(){
			$scope.items = ['Brand','Product Description','Product Category','Items'];
			$scope.productSelect = $scope.items[0];
			$scope.authorized = false;
			$scope.productType = {};
			$scope.productName = {};
			$scope.brand = {};
			$scope.item = {};
			$scope.showCreate = true;
			vm.dtInstance = {};
			vm.buttons = btnObj[0];
			vm.edit = editRow;
			vm.delete = deleteRow;
			
			SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.serial){
                            vm.spName = res.data[0].format.serial;
                        }
                    }
                }
			});
			
    		initController();
			refreshPicker();
   			loadTable();
		}

		function refreshPicker() {
			angular.element(document).ready(function() { 
   				$('.selectpicker').selectpicker("refresh");
   			});
		}

		function initController(){
			UserService.getCurrentUser().then(function (res) {
                $scope.user = res.data;
                //hide create option for all product categories
                if($scope.user.userType === 'd') {
                    $scope.showCreate = false;
                }
            });
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
			return '<button class="btn btn-simple btn-warning btn-icon btn-rotate" ng-click="vm.edit(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-pencil"></i>' +
			    '</button>&nbsp;' +
			    '<button class="btn btn-simple btn-danger btn-icon btn-rotate" ng-click="vm.delete(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-trash-o"></i>' +
			    '</button>';
		}

        function loadTable() { 
        	initController();
			refreshPicker();  			
     		switch($scope.productSelect) {
            	case 'Product Description':
            		MasterService.readProductType(getActiveObj).then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('type').withTitle('<b>Product Description</b>'),
							DTColumnBuilder.newColumn('category').withTitle('<b>Product Category</b>'),
							DTColumnBuilder.newColumn('category').withTitle('Product Category').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Product Code</b>'),
						   	DTColumnBuilder.newColumn(null).withTitle('<b>Action</b>').renderWith(actionsHtml).notSortable().withClass('all')
						];
						refreshTable();
					});
                    break;

            	case 'Product Category':
            		MasterService.readProductName(getActiveObj).then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('name').withTitle('<b>Category Name</b>'),
					  		DTColumnBuilder.newColumn('type.type').withTitle('<b>Product Description</b>'),
							DTColumnBuilder.newColumn('type.type').withTitle('Product Description').notVisible(),
							DTColumnBuilder.newColumn('type.type').withTitle('Product Description').notVisible(),
					  		DTColumnBuilder.newColumn(null).withTitle('<b>Action</b>').renderWith(actionsHtml).notSortable().withClass('all')
						];
						refreshTable();
					});
	                break;

	            case 'Brand':
	            	MasterService.readProductBrand(getActiveObj).then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('code').withTitle('<b>Brand Code</b>'),
					  		DTColumnBuilder.newColumn('name').withTitle('<b>Brand Name</b>'),
					  		DTColumnBuilder.newColumn('name').withTitle('Brand Name').notVisible(),
							DTColumnBuilder.newColumn('name').withTitle('Brand Name').notVisible(),
					  		DTColumnBuilder.newColumn(null).withTitle('<b>Action</b>').renderWith(actionsHtml).notSortable().withClass('all')
						];
						refreshTable();
					});
                    break;

	            case 'Items':
	            	MasterService.readProductItem(getActiveObj).then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('itemCode').withTitle('<b>Item Code</b>'),
					  		DTColumnBuilder.newColumn('itemName').withTitle('<b>Item Name</b>').renderWith(renderItemName),
					  		DTColumnBuilder.newColumn('brandName.name').withTitle('<b>Brand Name</b>'),
					  		DTColumnBuilder.newColumn('prodName.name').withTitle('<b>Product Category</b>'),
					  		DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
						];
						refreshTable();
					});
	            	break;

	            default:
	            	swal('', 'None of the options match');
		    }
		}

		function editRow(row){
	    	rowObj = angular.copy(rows.find(obj => obj._id === row));
	    	vm.buttons = btnObj[1];

			switch($scope.productSelect) {
				case 'Product Description':
					addNew(rowObj);
					break;

				case 'Product Category':
					addNew(rowObj);
					break;

	            case 'Brand':
					addNew(rowObj);
					break;

	            case 'Items':
					addNew(rowObj);
					break;

	            default: swal('', 'None of options match');
	        }
		}
        
		function addNew(rowObj) {
			switch($scope.productSelect) {

				case 'Product Description':
					var modalInstance = $uibModal.open({
						templateUrl: 'productType.html',
						backdrop: 'static',
						keyboard: false,
						controller: function addProductTypeController(MasterService, $scope, $uibModalInstance) {
	    					
	    					$scope.buttons = vm.buttons;
							$scope.prodCategory = ['Goods','Services'];
							$scope.prodTax = ['Non-Taxable','Taxable'];
							$scope.productType = {};
							$scope.productType['category'] = $scope.prodCategory[0];
							$scope.productType['tax'] = $scope.prodTax[1];
							$scope.categoryVal = 'HSN';
							
							$scope.prodCategoryChange = function(){
								if($scope.productType.category == $scope.prodCategory[0])
									$scope.categoryVal = 'HSN';
								else
									$scope.categoryVal = 'SAC';
							}

							if(rowObj){
								$scope.productType = angular.copy(rowObj);
								$scope.prodCategoryChange();
							}

							angular.element(document).ready(function() { 
								$('.selectpicker').selectpicker("refresh"); 
							});

							$scope.taxTypeChange = function(){
								if($scope.productType['tax'] == $scope.prodTax[0]){
									$scope.productType['taxRate'] = 0;
								} else{
									$scope.productType['taxRate'] = "";
								}
								angular.element(document).ready(function() { 
									$('.selectpicker').selectpicker("refresh"); 
								});
							}

		          			$scope.create = function(){
		          				if($scope.productType) {
									MasterService.saveProductType($scope.productType).then(function(res) {
										$scope.productType.type = undefined;
										$scope.productType.code = undefined;
										$scope.productType.taxRate = undefined;
										$scope.submitted = undefined;
										$scope.productDescriptionForm.type.$dirty = false;
										$scope.productDescriptionForm.code.$dirty = false;
										alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
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

				case 'Product Category':
					
					var modalInstance = $uibModal.open({
						templateUrl: 'productName.html',
						backdrop: 'static',
						keyboard: false,
						controller: function addProductNameController(MasterService, $scope, $uibModalInstance) {
							$scope.spName = vm.spName;
							$scope.buttons = vm.buttons;
							initProdNameCont();
							
							function initProdNameCont() {
								MasterService.readProductType().then(function(res) {
									if(res.status == 200)
										$scope.productTypeList = res.data;
									refreshControllerPicker();
								});
								MasterService.readProductAttribute({active: true}).then(function(res) {
									if(res.status == 200)
										$scope.productAttributeList = res.data;
									refreshControllerPicker();
								});
		                   		MasterService.readUnit({active: true}).then(function(res) {
		                   			if(res.status == 200)
		                				$scope.productUnitList = res.data;
									refreshControllerPicker();
		                   		});

		                   		loadDefault();
							}

							function refreshControllerPicker(){
								angular.element(document).ready(function() { 
									$('.selectpicker').selectpicker("refresh"); 
								});
							}

							function loadDefault() {					
								$scope.disableIMEIVal = false;
								$scope.enableValid = true;
		                   		$scope.productName = {};
		                   		$scope.productName['IMEINumCount'] = 2;

		                   		if(rowObj){
									$scope.productName = rowObj;
									if(rowObj.type){
										$scope.productName.type = rowObj.type._id;
										$scope.prodNameCode = rowObj.type.code;
									}
									if(rowObj.attribute.length){
										$scope.productName.attribute = rowObj.attribute.map(a => a._id);
									}
									if(rowObj.unit){
										$scope.productName.unit = rowObj.unit._id;
									}
    			   					//$scope.productName.code = rowObj.code._id;
									if(!rowObj.IMEINumLen){
										$scope.disableIMEIVal = true;
									}
									refreshControllerPicker();
								}
							}

							$scope.$watch('disableIMEIVal', function(val) {
								if(val) {
									$scope.productName.IMEINumLen = undefined;
									$scope.productName.IMEINumCount = undefined;
									$scope.enableValid = false;
								}else{
									$scope.enableValid = true;
									$scope.productName.IMEINumCount = 2;
								}
							});

    			   			$scope.productTypeChange = function() {
    			   				$scope.prodNameCode = undefined;
    			   				$scope.productName.code = undefined;
    			   				var ptlInd = $scope.productTypeList.findIndex(x => x._id == $scope.productName.type);
    			   				if(ptlInd >= 0){
	    			   				$scope.prodNameCode = $scope.productTypeList[ptlInd].code;
								}
								refreshControllerPicker();
    			   			}

							$scope.create = function() {
		          				if($scope.productName) {
									MasterService.saveProductName($scope.productName).then(function(res) {
										$scope.productName = {};
										$scope.prodNameCode = undefined;
										loadDefault();
										$scope.submitted = undefined;
										$scope.productNameForm.name.$dirty = false;
										$scope.productNameForm.type.$dirty = false;
										$scope.productNameForm.unit.$dirty = false;
										$scope.productNameForm.IMEINumLen.$dirty = false;
										$scope.productNameForm.IMEINumCount.$dirty = false;
										alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
										loadTable();
									});
								}
		          			}

		          			$scope.update = function() {
		          				if($scope.productName) {
									MasterService.updateProductName($scope.productName).then(function(res) {
										$scope.productName = {};
										$scope.prodNameCode = undefined;
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

				case 'Brand':
					var modalInstance = $uibModal.open({
						templateUrl: 'brand.html',
						backdrop: 'static',
						keyboard: false,
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
										$scope.submitted = undefined;
										$scope.brandForm.name.$dirty = false;
										$scope.brandForm.code.$dirty = false;
										alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
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

				case 'Items':
					var modalInstance = $uibModal.open({
						templateUrl: 'item.html',
						backdrop: 'static',
						keyboard: false,
						controller: function addProductItemController(MasterService, $scope, $uibModalInstance) {
							$scope.spName = vm.spName;
							initController();

							function initController() {
								MasterService.readProductBrand().then(function(res) {
									if(res.status == 200)
										$scope.brandNameList = res.data;
									refreshControllerPicker();
		                   		});

		                   		MasterService.readProductName().then(function(res) {
		                   			if(res.status == 200)
		                				$scope.prodNameList = res.data;
									refreshControllerPicker();
		                   		});
		                   		loadDefault();
							}
							
							function refreshControllerPicker(){
								angular.element(document).ready(function() { 
									$('.selectpicker').selectpicker("refresh"); 
								});
							}

							function loadDefault() {
								$scope.buttons = vm.buttons;
								$scope.attributes = [];
								$scope.attribute = [];
								$scope.attributeStatus = [];
								$scope.inventTypes = ['Consumable', 'Non consumable'];
								$scope.disableIMEIVal = false;
								$scope.enableValid = true;
								$scope.item = {};
								refreshControllerPicker();

								if(rowObj){
									$scope.item = angular.copy(rowObj);
									if(rowObj.brandName){
										$scope.item.brandName = rowObj.brandName._id;
									}
									if(rowObj.prodName){
										if(rowObj.prodName.type.taxRate){
											$scope.taxRate = rowObj.prodName.type.taxRate;
										}
										if(rowObj.prodName.attribute.length){
											$scope.attributes = rowObj.prodName.attribute;
										}
										if(rowObj.attribute.length){
											for(var i = 0; i < $scope.attributes.length; i++) {
												var attInd = rowObj.attribute.findIndex(x => x.name._id == $scope.attributes[i]._id);
												if(attInd >= 0){
													$scope.attribute[i] = rowObj.attribute[attInd].value;
													if(rowObj.attribute[attInd].status){
														$scope.attributeStatus[i] = true;
													} else{
														$scope.attributeStatus[i] = false;
													}
												} else{
													$scope.attribute[i] = "";
													$scope.attributeStatus[i] = false;
												}
											}
										}
										$scope.item.prodName = rowObj.prodName._id;
									}
									$scope.item.itemCode = rowObj.itemCode;
									$scope.item.taxRate = rowObj.taxRate;
									$scope.itemCode = rowObj.itemCode;
									if(!rowObj.IMEINumLen){
										$scope.disableIMEIVal = true;
										$scope.enableValid = false;
									}
								} else{
									MasterService.readProductItemCode().then(function(res) {
										if(res.data){
											$scope.item.itemCode = res.data.code;
											$scope.itemCode = res.data.code;
										}
									});
								}
								refreshControllerPicker();
							}

							$scope.productNameChange = function(){
								var pnlInd = $scope.prodNameList.findIndex(x => x._id == $scope.item.prodName);
								$scope.attributes = [];
								$scope.taxRate = $scope.prodNameList[pnlInd].type.taxRate;
								if($scope.prodNameList[pnlInd].attribute){
									$scope.attributes = $scope.prodNameList[pnlInd].attribute;
								}
		   						if(!$scope.prodNameList[pnlInd].IMEINumLen){
									$scope.disableIMEIVal = true;
									$scope.enableValid = false;
                                    $scope.item.IMEINumLen = undefined;
                                } else{
									$scope.disableIMEIVal = false;
									$scope.enableValid = true;
                                    $scope.item.IMEINumLen = $scope.prodNameList[pnlInd].IMEINumLen;
								}
								refreshControllerPicker();
    			   			}

							$scope.create = function(){
								var attValues = [];
								$scope.item.name = "";
								if($scope.attribute.length){
									for(var i = 0; i < $scope.attribute.length; i++){
										if($scope.attribute[i]){
											attValues.push({name:$scope.attributes[i]._id,value: $scope.attribute[i]});
											if($scope.attributeStatus[i]){
												attValues[attValues.length - 1].status = true;
												var valInd = $scope.attributes[i].value.findIndex(x => x._id == $scope.attribute[i]);
												if(valInd >= 0){
													$scope.item.name = $scope.item.name + " / " + $scope.attributes[i].value[valInd].name;
												}
											} else{
												attValues[attValues.length - 1].status = false;
											}
										}
									}
								}
								$scope.item.attribute = attValues;
								MasterService.saveProductItem($scope.item).then(function(res){
									loadDefault();
									$scope.submitted = undefined;
									$scope.itemForm.brandName.$dirty = false;
									$scope.itemForm.prodName.$dirty = false;
									$scope.itemForm.itemName.$dirty = false;
									$scope.itemForm.sellPrice.$dirty = false;
									$scope.itemForm.costPrice.$dirty = false;
									$scope.taxRate = undefined;
									// $scope.itemForm.inputTax.$dirty = false;
									// $scope.itemForm.outputTax.$dirty = false;
									$scope.itemForm.IMEINumLen.$dirty = false;
									alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
									loadTable();
								});
		          			}

		          			$scope.update = function(){
		          				if($scope.item){
									var attValues = [];
									$scope.item.name = "";
									if($scope.attribute.length){
										for(var i = 0; i < $scope.attribute.length; i++){
											if($scope.attribute[i]){
												attValues.push({name:$scope.attributes[i]._id,value: $scope.attribute[i]});
												if($scope.attributeStatus[i]){
													attValues[attValues.length - 1].status = true;
													var valInd = $scope.attributes[i].value.findIndex(x => x._id == $scope.attribute[i]);
													if(valInd >= 0){
														$scope.item.name = $scope.item.name + "/ " + $scope.attributes[i].value[valInd].name;
													}
												} else{
													attValues[attValues.length - 1].status = false;
												}
											}
										}
									}
									$scope.item.attribute = attValues;
									MasterService.updateProductItem($scope.item).then(function(res){
										loadTable();
										$uibModalInstance.close();
									});
								}
		          			}

							$scope.close = function(allocate){
								loadTable();
								$uibModalInstance.close();
							}
						}
					});
					break;

				default:
					swal('', 'None of the above options match');

			}
		}

		function deleteRow(row){

			switch($scope.productSelect) {
				case 'Product Description':
					MasterService.removeProductType({'_id': row}).then(function(res) {
						alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
						loadTable();
					});
					break;

				case 'Product Category':
					MasterService.removeProductName({'_id': row}).then(function(res) {
						alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
						loadTable();
					});
					break;

	            case 'Brand':
					MasterService.removeProductBrand({'_id': row}).then(function(res) {
						alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
						loadTable();
					});
					break;

	            case 'Items':
					MasterService.removeProductItem({'_id': row}).then(function(res) {
						alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
						loadTable();
					});
					break;

	            default: swal('', 'None of options match');
	        }
		}

		function renderItemName(data, type, row, meta){
			if(row.name){
				return row.itemName + row.name;
			} else{
				return row.itemName;
			}
		}

		$scope.exportToExcel=function(tableId){
            ExcelService.exportTable(tableId,$scope.productSelect);
		}
    }
})();

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}