(function() {
	'use strict';
	angular.module('app').controller('HRMaster.IndexController', hrMasterController);

	function hrMasterController(MasterService, $state, $scope, $uibModal, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile) {

		var vm=this, rows=[], getActiveObj={active:true}, rowObj={}, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}]; 
		loadDefault();

		function loadDefault(){
			$scope.items = ['Department','Designation','Hierarchy','Journey Visit Type'];
			$scope.hrSelect = $scope.items[0];
			$scope.authorized = false;
			$scope.department = {};
			$scope.designation = {};
			$scope.visitType = {};
			$scope.hierarchy={};
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

		function loadTable(){
			switch($scope.hrSelect) {
				case $scope.items[0]:
					MasterService.readEmpDepartment(getActiveObj).then(function(res) {
			            rows = res.data;

	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Dept Name</b>'),
					  		DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Dept Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
						];
						refreshTable();
	                });
	                break;

				case $scope.items[1]:
					MasterService.readEmpDesignation(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Designation Name</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Designation Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Actions</b>').notSortable().withClass('all')
						];
						refreshTable();
						reloadDataTable();
	                });
					break;
					
				case $scope.items[2]:
					MasterService.readEmpHierarchy(getActiveObj).then(function(res) {
						rows = res.data;
						
						$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Name</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('level').withTitle('<b>Level</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
						];
						refreshTable();
						reloadDataTable();
					});
					break;

				case $scope.items[3]:
					MasterService.readVisitType(getActiveObj).then(function (res) {
						rows = res.data;

						$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Visit Type</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Visit Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
						];
						refreshTable();
						reloadDataTable();
					});
					break;

	            default: swal('', 'None of the options match');
	        }
		}

		$scope.create = function(obj) {
			switch($scope.hrSelect) {
				case $scope.items[0]:
					if((obj.name) && (obj.code)){
						MasterService.saveEmpDepartment(obj).then(function(res) {
							if(res.status === 200) {
								$scope.department = {};
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save department');
							}
						});
					} else {
						swal('', 'department values missing !!!');
					}		
	                break;

				case $scope.items[1]:
	                break;
				case $scope.items[2]:
					if((obj.level) && (obj.name)){
						MasterService.saveEmpHierarchy(obj).then(function(res) {
							if(res.status === 200) {
								$scope.hierarchy = {};
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save hierarchy');
							}
						});
					} else {
						swal('', 'hierarchy missing !!!');
					}	
					break;
					
				case $scope.items[3]:
					if((obj.name) && (obj.code)){
						MasterService.saveVisitType(obj).then(function (res) {
							if(res.status === 200) {
								$scope.visitType = {};
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save visit type');
							}
						});
					} else {
						swal('', 'visit type missing !!!');
					}	
	                break;
	            default: swal('', 'None of options match');
	        }
		}	

		function editRow(row) {
			rowObj = rows.find(obj => obj._id === row);
	    	$scope.buttons = btnObj[1];

			switch($scope.hrSelect) {
				case $scope.items[0]:
					$scope.department = angular.copy(rowObj);
	                break;

				case $scope.items[1]:
					hrDesignationDialog(angular.copy(rowObj));
					break;

				case $scope.items[2]:
					$scope.hierarchy = angular.copy(rowObj);
	                break;

				case $scope.items[3]:
					$scope.visitType = angular.copy(rowObj);
					break;

	            default: swal('', 'None of options match');
	        }
		}

		$scope.update = function(obj) {
			switch($scope.hrSelect) {
				case $scope.items[0]:
					if((obj.name) && (obj.code)){
						MasterService.updateEmpDepartment(obj).then(function(res) {
							if(res.status === 200) {
								$scope.department = {};
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update department values');
							}							
						});
					} else {
						swal('', 'department values missing !!!');
					}		
	                break;

				case $scope.items[1]:
					break;

				case $scope.items[2]:
					if((obj.level) && (obj.name)){
						MasterService.updateEmpHierarchy(obj).then(function(res) {
							if(res.status === 200) {
								$scope.hierarchy = {};
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update hierarchy values');
							}							
						});
					} else {
						swal('', 'hierarchy values missing !!!');
					}		
	                break;
					
				case $scope.items[3]:
					if((obj.name) && (obj.code)){
						MasterService.updateVisitType(obj).then(function (res) {
							if (res.status === 200) {
								$scope.visitType = {};
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update visit type values');
							}
						});
					} else {
						swal('', 'visit type values missing !!!');
					}
					break;

	            default: swal('', 'None of options match');
	        }
		}

		function deleteRow(objID) {
			switch($scope.hrSelect) {
				case $scope.items[0]:
					MasterService.removeEmpDepartment({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.hrSelect = 'Department';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });	
	                break;

				case $scope.items[1]:
					MasterService.removeEmpDesignation({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.hrSelect = 'Designation';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });	
					break;

				case $scope.items[2]:
					MasterService.removeEmpHierarchy({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.hrSelect = 'Hierarchy';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });	
	                break;
					
				case $scope.items[3]:
					MasterService.removeVisitType({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.hrSelect = $scope.items[3];
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

		$scope.hrSelectChange = function() {
			loadTable();
		}

		function reloadDataTable() {
			vm.dtInstance._renderer.rerender();
		}

		$scope.addNew = function(){
			hrDesignationDialog();	
		}

		function hrDesignationDialog(hrDesignObj){
			var modalInstance = $uibModal.open({
				templateUrl: 'hrDesignationModal.html',
				backdrop: 'static',
				keyboard: false,
				controller: function hrDesignationModalController(MasterService, $state, $scope, $uibModalInstance) {

					var HRbtnObj = [{ "method": "createHR", "title": "Create" }, { "method": "updateHR", "title": "Update" }];
					var defaultOption = { 'view': false, 'new': false, 'edit': false, 'delete': false };
					$scope.HRbuttons = HRbtnObj[0];
					$scope.designation = {};
					$scope.permission = {
						'master': { 'client': angular.copy(defaultOption), 'accounts': angular.copy(defaultOption), 'generalMaster': angular.copy(defaultOption), 'hr': angular.copy(defaultOption), 'product': angular.copy(defaultOption), 'supplier': angular.copy(defaultOption), 'master': angular.copy(defaultOption) },
						'inventory': { 'purchaseAck': angular.copy(defaultOption), 'purchaseOrder': angular.copy(defaultOption), 'purchaseOrderManagement': angular.copy(defaultOption), 'sales': angular.copy(defaultOption), 'salesOrder': angular.copy(defaultOption), 'salesOrderManagement': angular.copy(defaultOption), 'stockRegister': angular.copy(defaultOption), 'stockStatus': angular.copy(defaultOption), 'stockTransfer': angular.copy(defaultOption), 'inventory': angular.copy(defaultOption) },
						'hr': { 'employee': angular.copy(defaultOption), 'expense': angular.copy(defaultOption), 'hr': angular.copy(defaultOption) },
						'accounts': { 'accountStatement': angular.copy(defaultOption), 'contra': angular.copy(defaultOption), 'creditNote': angular.copy(defaultOption), 'debitNote': angular.copy(defaultOption), 'journal': angular.copy(defaultOption), 'ledger': angular.copy(defaultOption), 'paymentVoucher': angular.copy(defaultOption), 'receiptVoucher': angular.copy(defaultOption), 'accounts': angular.copy(defaultOption) }
					};

					if(hrDesignObj) {
						$scope.HRbuttons = HRbtnObj[1];
						$scope.designation = angular.copy(hrDesignObj);
						$scope.permission = angular.copy(hrDesignObj.permission);
					}

					$scope.viewAllClicked = function (event, opt1, opt2) {
						angular.forEach($scope.permission[opt1], function (value, key) {
							if (key != opt1) {
								$scope.permission[opt1][key][opt2] = event.target.checked;
							}
						});
					}

					$scope.viewClicked = function (opt1, opt3) {
						var check = 0;
						angular.forEach($scope.permission[opt1], function (value, key) {
							if (key != opt1) {
								if ($scope.permission[opt1][key][opt3] == false) {
									check = 1;
								}
							}
						});
						if (check == 1) {
							$scope.permission[opt1][opt1][opt3] = false;
						} else {
							$scope.permission[opt1][opt1][opt3] = true;
						}
					}

					$scope.createHR = function () {
						$scope.designation.permission = $scope.permission;
						MasterService.saveEmpDesignation($scope.designation).then(function (res) {
							if (res.status === 200) {
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
								$scope.close();
							} else {
								swal('', 'Failed to save designation');
							}
						});
					}

					$scope.updateHR = function () {
						$scope.designation.permission = $scope.permission;
						MasterService.updateEmpDesignation($scope.designation).then(function (res) {
							if (res.status === 200) {
								$scope.designation = {};
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
								$scope.close();
							} else {
								swal('', 'Failed to update designation values');
							}
						});
					}

					$scope.close = function () {
						loadTable();
						$uibModalInstance.close();
					};
				}
			});
		}
	}
})();

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}