(function() {
	'use strict';
	angular.module('app').controller('HRMaster.IndexController', hrMasterController);

	function hrMasterController(MasterService, $state, $scope, $modal, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile) {

		var vm = this;
		var rows = [], getActiveObj = {active: true}, rowObj = {};
		var btnObj = [{"method":"create","title":"Create"}, {"method":"update","title":"Update"}]; 
		loadDefault();

		function loadDefault(){
			$scope.items = ['Department','Designation','Hierarchy'];
			$scope.hrSelect = $scope.items[0];
			$scope.authorized = false;
			$scope.department = {};
			$scope.designation = {};
			$scope.hierarchy={};
			vm.dtInstance = {};
			$scope.buttons = btnObj[0];
			vm.edit = editRow;
    		vm.delete = deleteRow;
			refreshPicker();
			initController();
   			loadTable();
		}

		function refreshPicker() {
			angular.element(document).ready(function() { 
   				$('select').selectpicker("refresh");
   			});
		}

		function initController() {
		
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
			return '<button class="btn btn-simple btn-warning btn-icon edit" ng-click="vm.edit(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-edit"></i>' +
			    '</button>&nbsp;' +
			    '<button class="btn btn-simple btn-danger btn-icon remove" ng-click="vm.delete(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-trash-o"></i>' +
			    '</button>';
		}

		function loadTable(){
			switch($scope.hrSelect) {
				case $scope.items[0]:
					MasterService.readEmpDepartment(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions()
		                	.withOption('data', rows)
						  	.withPaginationType('full_numbers')
						 	.withOption('createdRow', createdRow);

					  	$scope.dtColumns = [
					  		DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('name').withTitle('Dept Name'),
							DTColumnBuilder.newColumn('code').withTitle('Dept Code'),
						   	DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
								.renderWith(actionsHtml)
						];
						refreshTable();
	                });
	                break;

				case $scope.items[1]:
					MasterService.readEmpDesignation(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions()
					  	.withOption('data', rows)
					  	.withPaginationType('full_numbers')
						.withOption('createdRow', createdRow);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('name').withTitle('Designation Name'),
							DTColumnBuilder.newColumn('code').withTitle('Designation Code'),
							DTColumnBuilder.newColumn(null).withTitle('Actions')
							.renderWith(actionsHtml)
						];
						refreshTable();
						reloadDataTable();
	                });
					break;
				case $scope.items[2]:
				
					break;

	            default: alert('None of the options match');
	        }
		}

		$scope.create = function(obj) {
			switch($scope.hrSelect) {
				case $scope.items[0]:
					if(obj){
						MasterService.saveEmpDepartment(obj).then(function(res) {
							if(res.status === 200) {
								$scope.department = {};
								loadTable();
							} else {
								alert('Failed to save department');
							}
						});
					} else {
						alert('department values missing !!!');
					}		
	                break;

				case $scope.items[1]:
					if(obj){
						MasterService.saveEmpDesignation(obj).then(function(res) {
							if(res.status === 200) {
								$scope.designation = {};
								loadTable();
							} else {
								alert('Failed to save designation');
							}
						});
					} else {
						alert('designation values missing !!!');
					}	
	                break;
				case $scope.items[2]:
					if(obj){
						MasterService.saveEmpHierarchy(obj).then(function(res) {
							if(res.status === 200) {
								$scope.hierarchy = {};
								loadTable();
							} else {
								alert('Failed to save hierarchy');
							}
						});
					} else {
						alert(' hierarchy missing !!!');
					}	
	                break;
	            default: alert('None of options match');
	        }
		}	

		function editRow(row) {
			rowObj = rows.find(obj => obj._id === row);
	    	$scope.buttons = btnObj[1];

			switch($scope.hrSelect) {
				case $scope.items[0]:
					$scope.department = rowObj;
	                break;

				case $scope.items[1]:
					/*$scope.designation = rowObj*/;
					$state.go('master.hrDesignation',{'obj': rowObj});
					break;

	            default: alert('None of options match');
	        }
		}

		$scope.update = function(obj) {
			switch($scope.hrSelect) {
				case $scope.items[0]:
					if(obj) {
						MasterService.updateEmpDepartment(obj).then(function(res) {
							if(res.status === 200) {
								$scope.department = {};
								loadTable();
							} else {
								alert('Failed to update department values');
							}							
						});
					} else {
						alert('department values missing !!!');
					}		
	                break;

				case $scope.items[1]:
					if(obj){
						MasterService.updateEmpDesignation(obj).then(function(res) {
							if(res.status === 200) {
								$scope.designation = {};
								loadTable();
							} else {
								alert('Failed to update designation values');
							}
						});
					} else {
						alert('designation values missing !!!');
					}	
	                break;

	            default: alert('None of options match');
	        }
		}

		function deleteRow(objID) {
			switch($scope.hrSelect) {
				case $scope.items[0]:
					MasterService.removeEmpDepartment({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.hrSelect = 'Department';
			        		loadTable();
			        	} else {
			        		alert('Failed to delete the record');
			        	}
			        });	
	                break;

				case $scope.items[1]:
					MasterService.removeEmpDesignation({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.hrSelect = 'Designation';
			        		loadTable();
			        	} else {
			        		alert('Failed to delete the record');
			        	}
			        });	
			        break;

	            default: alert('None of options match');
	        }
		}

		$scope.hrSelectChange = function() {
			loadTable();
		}

		function reloadDataTable() {
			vm.dtInstance._renderer.rerender();
		}

		$scope.addNew = function(){
			$state.go('master.hrDesignation');	
		}
	}

})();

   			