(function() {
	'use strict';

	angular.module('app').controller('Supplier.IndexController', supplierMasterController);

	function supplierMasterController(MasterService, $state, $scope, $uibModal, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile){

		var vm=this, rows=[], getActiveObj={active:true}, rowObj={}, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}];
		loadDefault();

		function loadDefault(){
			$scope.supplierOptions = ['Supplier', 'Supplier Category'];
			$scope.supplierSelect = $scope.supplierOptions[0];	
			$scope.authorized = false;
			$scope.category = {};
			vm.dtInstance = {};
			$scope.buttons = btnObj[0];
			vm.edit = editRow;
    		vm.delete = deleteRow;
    		refreshPicker();
   			loadTable();
		}

		function refreshPicker() {
			angular.element(document).ready(function() { 
   				$('.selectpicker').selectpicker("refresh");
   			});
		}

		function refreshTable() {
			$timeout(function() {
			    $scope.authorized = true;
			}, 0);
			$scope.buttons = btnObj[0];
			refreshPicker();
			// reloadDataTable();
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
			    '   <i class="fa fa-trash"></i>' +
			    '</button>';
		}

		function loadTable() {
			switch($scope.supplierSelect) {
            	case $scope.supplierOptions[0]:
	                var res = MasterService.readSupplier().then(function(res) {
	                	rows = res.data;

	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('createdRow', createdRow).withOption('order', [[0, 'asc']]).withOption('lengthMenu', [50, 100, 150, 250]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Supplier name</b>'),
						   	DTColumnBuilder.newColumn('mobNum').withTitle('<b>Supplier MobNo</b>'),
						   	DTColumnBuilder.newColumn('gstin').withTitle('<b>Supplier GSTIN</b>'),
						   	DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
						];
						refreshTable();
	                });
	                break;

            	case $scope.supplierOptions[1]:
	                var res = MasterService.readSupplierCategory().then(function(res) {
	                	rows = res.data;

	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('createdRow', createdRow).withOption('order', [[0, 'asc']]).withOption('lengthMenu', [25, 50, 100, 150]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('code').withTitle('<b>Category code</b>'),
						   	DTColumnBuilder.newColumn('name').withTitle('<b>Category Name</b>'),
						   	DTColumnBuilder.newColumn('name').withTitle('Category Name').notVisible(),
						   	DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
						];
						refreshTable();
						reloadDataTable(); //render the table only after its loaded.  Dont call this function on the first table load. That throws console error stating undefine renderer function 
	                });
	                break;

	            default:
	            	swal('', 'None of the options match');
	        }
		}
		
		function editRow(row) {
	    	rowObj = angular.copy(rows.find(obj => obj._id === row));
	    	$scope.buttons = btnObj[1];

			switch($scope.supplierSelect) {
				case $scope.supplierOptions[0]:
					$scope.addNew(rowObj);
	   				break;

				case $scope.supplierOptions[1]:
					$scope.addNew(rowObj);
					break;

	            default: swal('', 'None of options match');
	        }
		}

		$scope.addNew = function(rowObj) {
			switch($scope.supplierSelect) {
				case $scope.supplierOptions[0]:
					$state.go('master.newSupplier', {obj: rowObj});
					break;

				case $scope.supplierOptions[1]:
					var modalInstance = $uibModal.open({
						templateUrl: 'addCategory.html',
						backdrop: 'static',
						keyboard: false,
		          		controller: function addCategoryController(MasterService, $scope, $uibModalInstance, $state) {
		          			// rowObj => undefince in case of add new; rowObj => holds row object in case of edit
		          			if(rowObj == undefined) {
		          				$scope.buttons = btnObj[0];
		          			} else {
		          				$scope.buttons = btnObj[1];
		          			}
		          			$scope.category = rowObj;

		          			$scope.create = function(obj) {
		     					if(obj){
									MasterService.saveSupplierCategory(obj).then(function(res) {
										if(res.status === 200) {
											$scope.category = {};
											loadTable();
											alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
										} else {
											swal('', 'Failed to save category');
										}
									});
								} else {
									swal('', 'category values missing !!!');
								}	
		          			}

		          			$scope.update = function(obj) {
		          				if(obj) {
									MasterService.updateSupplierCategory(obj).then(function(res) {
										if(res.status === 200) {
											$scope.category = {};
											$scope.close();
											loadTable();
											alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
										} else {
											swal('', 'Failed to update category values');
										}							
									});
								} else {
									swal('', 'category values missing !!!');
								}	
		          			}

			            	$scope.close = function() {
			              		$uibModalInstance.close();
			            	};
			            }
	    	  		});
	    	  		break;

				default:
					swal('', 'Given options do not match');
			}
    	}

    	function deleteRow(objID) {
			switch($scope.supplierSelect) {

				case $scope.supplierOptions[0]:
					MasterService.removeSupplier({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.supplierSelect = 'Supplier';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });	
	                break;

				case $scope.supplierOptions[1]:
					MasterService.removeSupplierCategory({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.supplierSelect = 'Supplier Category';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
			        break;
    
	            default: swal('', 'None of options match');
	        }
		}

    	$scope.supplierSelectChange = function() {
			loadTable();
		}

		function reloadDataTable() {
			vm.dtInstance._renderer.rerender();
		}
	}
})();

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}