(function() {
    'use strict';
    angular.module('app').controller('General.IndexController', generalController);

    function generalController(SettingService, MasterService, UserService, $scope, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModal){

		var vm=this, rows=[], getActiveObj={active:true}, rowObj={}, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}];
		$scope.stoPoiNam = "Stock Point";
		loadDefault();

		function loadDefault(){
			$scope.generalOptions = ['Country','Zone','State','District','City','Area','Region','Product Attributes','Units','Department','Designation','Dealer Category'];
			$scope.generalOption = $scope.generalOptions[0];
			$scope.authorized = false;
			$scope.state = {};
			$scope.region = {};
			$scope.district = {};
			$scope.zone = {};
			$scope.area = {};
			$scope.country = {};
			$scope.city = {};
			$scope.unit = {};
			$scope.salePoint = {};
			$scope.department = {};
			$scope.designation = {};
			$scope.dealerCategory = {};
			$scope.showCreate = true;
			vm.dtInstance = {};
			$scope.buttons = btnObj[0];
			vm.edit = editRow;
			vm.delete = deleteRow;
			
			SettingService.readSetting().then(function(res) {
                if(res.data.length){
                    if(res.data[0].format){
						if(res.data[0].format.stockPoint){
							$scope.stoPoiNam = res.data[0].format.stockPoint;
						}
					}
				}
				$scope.generalOptions.push($scope.stoPoiNam);
                refreshPicker();
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

		function initController() {
			UserService.getCurrentUser().then(function (res) {
                $scope.user = res.data;
                //hide create option for distributor except - ['Area','SalePoint','Department','Designation']
                if($scope.user.userType === 'd') {
                    $scope.showCreate = false;
                    var arrZoneIndex = $scope.generalOptions.indexOf('Zone');
                    if(arrZoneIndex > -1) {
                    	$scope.generalOptions.splice(arrZoneIndex,1);
                    	console.log('INFO: Zone name successfully removed from dropdown list')
                    } 
                }
            });
        }

		function refreshTable() {
			$timeout(function() {
			    $scope.authorized = true;
			}, 0);
			$scope.buttons = btnObj[0];
			refreshPicker();
		} 

		$scope.generalOptChange = function(){
			loadTable();
			$scope.reset();
		}

	    function createdRow(row, data, dataIndex) {
			// Recompiling so we can bind Angular directive to the DT
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return '<button class="btn btn-simple btn-warning btn-icon" ng-click="vm.edit(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-pencil"></i>' +
			    '</button>&nbsp;' +
			    '<button class="btn btn-simple btn-danger btn-icon" ng-click="vm.delete(\'' +  data._id  + '\')">' +
			    '   <i class="fa fa-trash"></i>' +
			    '</button>';
		}

		function loadTable(){
			initController();
			refreshPicker();
			switch($scope.generalOption) {
				case 'Area':
					MasterService.readDistrict(getActiveObj).then(function(res) {
						$scope.districts = res.data;
						refreshPicker();
					});
					MasterService.readArea(getActiveObj).then(function(res) {
						rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
		                $scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Area Name</b>'),
							DTColumnBuilder.newColumn('district.name').withTitle('<b>District Name</b>'),
							DTColumnBuilder.newColumn('code').withTitle('<b>Area Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						refreshTable();
						reloadDataTable();
	                });
	                break;

				case 'City':
					MasterService.readCity(getActiveObj).then(function(res) {
			            rows = res.data;
			            
			            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>City Name</b>'),
							DTColumnBuilder.newColumn('code').withTitle('<b>City Code</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						//if distributor add one more notVisible field to avoid dataTable error
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('code').withTitle('City Code').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
	                });
	                break;

	            case 'District':
	            	MasterService.readState(getActiveObj).then(function(res) {
						$scope.states = res.data;
						refreshPicker();
					});
	            	MasterService.readDistrict(getActiveObj).then(function(res) {
			            rows = res.data;

			           	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>District Name</b>'),
							DTColumnBuilder.newColumn('code').withTitle('<b>District Code</b>'),
							DTColumnBuilder.newColumn('state.name').withTitle('<b>State Name</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('code').withTitle('District Code').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
                    });
	                break;

				case 'State':
					MasterService.readCountry(getActiveObj).then(function(res) {
						$scope.countries = res.data;
						refreshPicker();
					});
					MasterService.readState(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('country.name').withTitle('<b>Country Name</b>'),
							DTColumnBuilder.newColumn('name').withTitle('<b>State Name</b>'),
							DTColumnBuilder.newColumn('code').withTitle('<b>State Code</b>'),
							DTColumnBuilder.newColumn('gstCode').withTitle('<b>State GST-Code</b>')
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('code').withTitle('State Code').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
	                });
	                break;

				case 'Region':
					MasterService.readDistrict(getActiveObj).then(function(res) {
						$scope.districts = res.data;
						refreshPicker();
					});	
	            	MasterService.readRegion(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('district.name').withTitle('<b>District</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('name').withTitle('<b>Region</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('name').withTitle('Region').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
	                });
	                break;
	               
				case 'Zone':
					MasterService.readState(getActiveObj).then(function(res) {
						$scope.states = res.data;
						refreshPicker();
					});
					MasterService.readDistrict(getActiveObj).then(function(res) {
						$scope.districts = res.data;
						refreshPicker();
					});	
	            	MasterService.readZone(getActiveObj).then(function(res) {
						rows = res.data;
						
						$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [						 
							DTColumnBuilder.newColumn('name').withTitle('<b>Zone</b>'),
							DTColumnBuilder.newColumn('state.name').withTitle('<b>State</b>'),
							DTColumnBuilder.newColumn('name').withTitle('Zone').notVisible(),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('name').withTitle('Zone').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
					}); 
				    break;					

	            case 'Country':
					MasterService.readCountry(getActiveObj).then(function(res) {
			            rows = res.data;
             	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Country Name</b>'),
					  		DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Country Code</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('code').withTitle('Country Code').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
					});
	                break;

	            case 'Units':    
					MasterService.readUnit(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Units Measure</b>'),
					  		DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Units Code</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('code').withTitle('Units Code').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
	                });
	                break;

	        	case $scope.stoPoiNam:
					MasterService.readSalePoint(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
						  
					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>' + $scope.stoPoiNam + ' Name</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>' + $scope.stoPoiNam + ' Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						refreshTable();
						reloadDataTable();
	                });
	                break;

	            case 'Department':
					MasterService.readClientDepartment(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Department Name</b>'),
					  		DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Department Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						refreshTable();
						reloadDataTable();
	                });
	                break;

	            case 'Designation':
					MasterService.readClientDesignation(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

					  	$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Designation Name</b>'),
					  		DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Designation Code</b>'),
							DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						refreshTable();
						reloadDataTable();
	                });
					break;
					
				case 'Dealer Category':
					MasterService.readDealerCategory(getActiveObj).then(function(res) {
			            rows = res.data;
	                	
	                	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Category Name</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('code').withTitle('<b>Category Code</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible()
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('code').withTitle('Category Code').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
	                });
					break;
				
				case 'Product Attributes':
					MasterService.readProductAttribute(getActiveObj).then(function(res) {
						rows = res.data;
						for(var i = 0; i < rows.length; i++){
							var values = "";
							for(var j = 0; j < rows[i].value.length; j++){
								if(rows[i].value[j].active == true){
									values = values + ' ' + rows[i].value[j].name + ',';
								}
							}
							if(values.length){
								values = values.slice(0, -1);
							}
							rows[i].values = values;
						}
						$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('createdRow', createdRow).withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [25, 50, 100, 200]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);

						$scope.dtColumns = [
							DTColumnBuilder.newColumn('name').withTitle('<b>Attribute Name</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
							DTColumnBuilder.newColumn('values').withTitle('<b>Attribute Values</b>'),
							DTColumnBuilder.newColumn('_id').withTitle('ID').notVisible(),
						];
						if($scope.user.userType === 'd') {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn('values').withTitle('Attribute Values').notVisible()
							);
						} else {
							$scope.dtColumns.push(
								DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
							);
						}
						refreshTable();
						reloadDataTable();
					});
					break;

	            default: swal('', 'None of options match');
	        }
		}

		$scope.create = function(obj){
			switch($scope.generalOption) {
				case 'Area':
					if(obj){
						MasterService.saveArea(obj).then(function(res) {
							if(res.status === 200) {
								$scope.area = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save area');
							}
						});
					} else {
						swal('', 'area values missing !!!');
					}		
	                break;

				case 'City':
					if(obj){
						MasterService.saveCity(obj).then(function(res) {
							if(res.status === 200) {
								$scope.city = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save city');
							}
						});
					} else {
						swal('', 'city values missing');
					}		
	                break;

	            case 'District':
					if(obj){
						MasterService.saveDistrict(obj).then(function(res) {
							if(res.status === 200) {
								$scope.district = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save district');
							}
						});
					} else {
						swal('', 'district values missing !!!');
					}			
	                break;

	            case 'State':
					if(obj){
						MasterService.saveState(obj).then(function(res) {
							if(res.status === 200) {
								$scope.state = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save state');
							}
						});
					} else {
						swal('', 'state values missing !!!');
					}	
	                break;

	            case 'Region':
					if(obj){
						MasterService.saveRegion(obj).then(function(res) {
							if(res.status === 200) {
								$scope.region = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save region');
							}
						});
					} else {
						swal('', 'region values missing !!!');
					}
	                break;

	            case 'Zone':
					if(obj){
						MasterService.saveZone(obj).then(function(res) {
							if(res.status === 200) {
								$scope.zone = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save zone');
							}
						});
					} else {
						swal('', 'zone values missing !!!');
					}
					break;

	            case 'Country':
					if(obj){
						MasterService.saveCountry(obj).then(function(res) {
							if(res.status === 200) {
								$scope.country = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save country');
							}
						});
					} else {
						swal('', 'country values missing !!!');
					}		
	                break;

	            case 'Units':
					if(obj){
						MasterService.saveUnit(obj).then(function(res) {
							if(res.status === 200) {
								$scope.unit = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save unit');
							}
						});
					} else {
						swal('', 'Unit values missing !!!');
					}	
	                break;

	        	case $scope.stoPoiNam:
					if(obj){
						MasterService.saveSalePoint(obj).then(function(res) {
							if(res.status === 200) {
								$scope.salePoint = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save ' + $scope.stoPoiNam);
							}
						});
					} else {
						swal('', $scope.stoPoiNam + ' values missing !!!');
					}		
	                break;

	            case 'Department':
					if(obj){
						MasterService.saveClientDepartment(obj).then(function(res) {
							if(res.status === 200) {
								$scope.department = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save salePoint');
							}
						});
					} else {
						swal('', 'Salepoint values missing !!!');
					}		
	                break;

	            case 'Designation':
					if(obj){
						MasterService.saveClientDesignation(obj).then(function(res) {
							if(res.status === 200) {
								$scope.designation = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save salePoint');
							}
						});
					} else {
						swal('', 'Salepoint values missing !!!');
					}		
					break;
					
				case 'Dealer Category':
					if(obj){
						MasterService.saveDealerCategory(obj).then(function(res) {
							if(res.status === 200) {
								$scope.dealerCategory = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to save dealer catogry');
							}
						});
					} else {
						swal('', 'dealer catogry values missing !!!');
					}	
					break;

				// case 'Product Attributes':
				// 	break;

	            default: swal('', 'None of options match');
	        }
		}	

		function editRow(row) {
	    	rowObj = angular.copy(rows.find(obj => obj._id === row));
	    	$scope.buttons = btnObj[1];

			switch($scope.generalOption) {
				case 'Area':
					$scope.area = rowObj;
					if($scope.area.district){
						$scope.area.district = rowObj.district._id;
					}
					refreshPicker();
					break;

				case 'City':
					$scope.city = rowObj;
					break;

				case 'District':
					$scope.district = angular.copy(rowObj);
                    if(rowObj.state._id){
                        $scope.district.state = rowObj.state._id;
                    }else{
                        $scope.district.state = '';
                    }
                    refreshPicker();
					break;

				case 'State':
					$scope.state = rowObj;
					if($scope.state.country){
						$scope.state.country = $scope.state.country._id;
					}
					break;

			    case 'Region':
					$scope.region = angular.copy(rowObj);
					if(rowObj.district._id){
						$scope.region.district = rowObj.district._id;
					}else{
						$scope.region.district = '';
					}
					refreshPicker();
					break;

	            case 'Zone':
	            	$scope.zone = angular.copy(rowObj);
					if(rowObj.state._id){
						$scope.zone.state = rowObj.state._id;
					}else{
						$scope.zone.state = '';
					}
					if(rowObj.district.length){
						$scope.zone.district = rowObj.district.map(a => a._id);
					}else{
						$scope.zone.district = undefined;
					}
					refreshPicker();
					break;

	            case 'Country':
					$scope.country = rowObj;
	                break;

	            case 'Units':
	            	$scope.unit = rowObj;
					break;

	        	case $scope.stoPoiNam:
	        		$scope.salePoint = rowObj;
			        break;

			    case 'Department':
	        		$scope.department = rowObj;
			        break;

			    case 'Designation':
	        		$scope.designation = rowObj;
					break;
				
				case 'Dealer Category':
	        		$scope.dealerCategory = rowObj;
					break;
					
				case 'Product Attributes':
					$scope.openProdAttr(rowObj);
					break;

	            default: swal('', 'None of options match');
	        }
		}

		$scope.update = function(obj) {
			switch($scope.generalOption) {
				case 'Area':
					if(obj){
						MasterService.updateArea(obj).then(function(res) {
							if(res.status === 200) {
								$scope.area = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update area values');
							}
						});
					} else {
						swal('', 'area values missing !!!');
					}
	                break;

				case 'City':
					if(obj){
						MasterService.updateCity(obj).then(function(res) {
							if(res.status === 200) {
								$scope.city = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update city values');
							}
						});
					} else {
						swal('', 'city values missing !!!');
					}
	                break;

	            case 'District':
					if(obj){
						MasterService.updateDistrict(obj).then(function(res) {
							if(res.status === 200) { 
								$scope.district = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update district values');
							}
						});

					} else {
						swal('', 'district values missing !!!');
					}
	                break;

				case 'State':
					if(obj){
						MasterService.updateState(obj).then(function(res) {
							if(res.status === 200) {
								$scope.state = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update state values');
							}
						});
					} else {
						swal('', 'state values missing !!!');
					}	
	                break;

	            case 'Region':
					if(obj){
						MasterService.updateRegion(obj).then(function(res) {
							if(res.status === 200) {
								$scope.region = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update region values');
							}
						});
					} else {
						swal('', 'region values missing !!!');
					}
	                break;

	            case 'Zone':
					if(obj){
						MasterService.updateZone(obj).then(function(res) {
							if(res.status === 200) {
								$scope.zone = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update zone values');
							}
						});
					} else {
						swal('', 'zone values missing !!!');
					}
					break;

	            case 'Country':
					if(obj) {
						MasterService.updateCountry(obj).then(function(res) {
							if(res.status === 200) {
								$scope.country = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update country values');
							}							
						});
					} else {
						swal('', 'country values missing !!!');
					}		
	                break;

	            case 'Units':
					if(obj){
						MasterService.updateUnit(obj).then(function(res) {
							if(res.status === 200) {
								$scope.unit = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update unit values');
							}
						});
					} else {
						swal('', 'Units values missing !!!');
					}
	                break;

	        	case $scope.stoPoiNam:
					if(obj){
						MasterService.updateSalePoint(obj).then(function(res) {
							if(res.status === 200) {
								$scope.salePoint = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update ' + $scope.stoPoiNam + ' values');
							}
						});
					} else {
						swal('', $scope.stoPoiNam + ' values missing !!!');
					}
	                break;

	            case 'Department':
					if(obj){
						MasterService.updateClientDepartment(obj).then(function(res) {
							if(res.status === 200) {
								$scope.department = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update department values');
							}
						});
					} else {
						swal('', 'Department values missing !!!');
					}
	                break;

	            case 'Designation':
					if(obj){
						MasterService.updateClientDesignation(obj).then(function(res) {
							if(res.status === 200) {
								$scope.designation = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
							} else {
								swal('', 'Failed to update designation values');
							}
						});
					} else {
						swal('', 'Designation values missing !!!');
					}
					break;
					
				case 'Dealer Category':
					if(obj){
						MasterService.updateDealerCategory(obj).then(function(res) {
                            if(res.status === 200) {
								$scope.dealerCategory = {};
								$scope.reset();
								loadTable();
								alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
                            } else {
                                swal('', 'Failed to update dealer category values');
                            }                           
                        });
					} else {
						swal('', 'Dealer category values missing !!!');
					}	
					break;
					
				// case 'Product Attributes':
				// 	break;

	            default: swal('', 'None of options match');
	        }
		}

		function deleteRow(objID) {
			switch($scope.generalOption) {
				case 'Area':
					MasterService.removeArea({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Area';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
			        break;

			    case 'City':
			    	MasterService.removeCity({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'City';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
			        break;

	            case 'District':
	            	MasterService.removeDistrict({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'District';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
	                break;

				case 'State':
					MasterService.removeState({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'State';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
			        break;

	            case 'Region':
	            	MasterService.removeRegion({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Region';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
	                break;

	            case 'Zone':
					MasterService.removeZone({'_id': objID}).then(function(res) {
						if(res.status == 200) {
							$scope.generalOption = 'Zone';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
						} else {
							swal('', 'Failed to delete the record');
						}
					});
	                break;

	            case 'Country':
					MasterService.removeCountry({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Country';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });	
	                break;

	            case 'Units':
					MasterService.removeUnit({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Units';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
			        break;

	        	case $scope.stoPoiNam:
	        		MasterService.removeSalePoint({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = $scope.stoPoiNam;
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
	                break;

	            case $scope.generalOptions[9]:
	        		MasterService.removeClientDepartment({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Department';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
	                break;

	            case $scope.generalOptions[10]:
	        		MasterService.removeClientDesignation({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Designation';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });
					break;
					
				case 'Dealer Category':
					MasterService.removeDealerCategory({'_id': objID}).then(function(res) {
			        	if(res.status == 200) {
			        		$scope.generalOption = 'Dealer Category';
							loadTable();
							alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
			        	} else {
			        		swal('', 'Failed to delete the record');
			        	}
			        });	
					break;
					
				case 'Product Attributes':
					MasterService.removeProductAttribute({'_id': objID}).then(function(res) {
						if(res.status == 200) {
							$scope.generalOption = 'Product Attributes';
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

		function reloadDataTable() {
			vm.dtInstance._renderer.rerender();
		}

		$scope.changeLocation = function(opt){
			switch(opt){
				case 'country': 
					if($scope.country.name){
						if($scope.country.name.includes(",")){
							var country = $scope.country.name.split(",");
							$scope.country.name = country[0];
						}
					}
					break;
				case 'state': 
					if($scope.state.name){
						if($scope.state.name.includes(",")){
							var state = $scope.state.name.split(",");
							$scope.state.name = state[0];
						}
					}
					break;
				case 'district':
					if($scope.district.name){
						if($scope.district.name.includes(",")){
							var district = $scope.district.name.split(",");
							$scope.district.name = district[0];
						}
					}
					break;
				case 'city':
					if($scope.city.name){
						if($scope.city.name.includes(",")){
							var city = $scope.city.name.split(",");
							$scope.city.name = city[0];
						}
					}
					break;
				case 'area':
					if($scope.area.name){
						if($scope.area.name.includes(",")){
							var area = $scope.area.name.split(",");
							$scope.area.name = area[0];
						}
					}
					break;
			}
		}

		$scope.reset = function(){
			vm.submitted = undefined;
			switch($scope.generalOption){
				case 'Area':
						if(vm.areaForm){
							// vm.areaForm.name.$dirty = false;
							// vm.areaForm.code.$dirty = false;
						}
						break;

				case 'Country':
						if(vm.countryForm){
							vm.countryForm.name.$dirty = false;
							vm.countryForm.code.$dirty = false;
						}
						break;

				case 'City':
						if(vm.cityForm){
							vm.cityForm.name.$dirty = false;
							vm.cityForm.code.$dirty = false;
						}
						break;

				case 'Units':
						if(vm.unitForm){
							vm.unitForm.name.$dirty = false;
							vm.unitForm.code.$dirty = false;
						}
						break;

				case 'State':
						if(vm.stateForm){
							// vm.stateForm.name.$dirty = false;
							// vm.stateForm.code.$dirty = false;
							// vm.stateForm.gstCode.$dirty = false;
						}
						break;

				case 'District':
						$scope.district.state = null;		
						if(vm.districtForm){
							vm.districtForm.name.$dirty = false;
							vm.districtForm.code.$dirty = false;
							vm.districtForm.state.$dirty = false;
						}
	                	break;

				case 'Region':
						$scope.region.district = null;
						if(vm.regionForm){
							vm.regionForm.district.$dirty = false;
							vm.regionForm.name.$dirty = false;
						}
	                	break;

	            case 'Zone':
						$scope.zone.state = null;
						$scope.zone.district = null;
						if(vm.zoneForm){
							vm.zoneForm.state.$dirty = false;
							vm.zoneForm.name.$dirty = false;
							vm.zoneForm.district.$dirty = false;
						}
						break;

				case $scope.stoPoiNam:
						if(vm.salePointForm){
							vm.salePointForm.name.$dirty = false;
							vm.salePointForm.code.$dirty = false;
						}
						break;

				case 'Department':
						if(vm.departmentForm){
							vm.departmentForm.name.$dirty = false;
							vm.departmentForm.code.$dirty = false;
						}
						break;

				case 'Dealer Category':
						if(vm.dealerCategoryForm){
							vm.dealerCategoryForm.name.$dirty = false;
							vm.dealerCategoryForm.code.$dirty = false;
						}
						break;

				case 'Designation':
						if(vm.designationForm){
							vm.designationForm.name.$dirty = false;
							vm.designationForm.code.$dirty = false;
						}
						break;
			}
			$scope.buttons = btnObj[0];
			refreshPicker();
		}

		$scope.openProdAttr = function(obj){
            var modalInstance = $uibModal.open({
                templateUrl: 'productAttributesContent.html',
                backdrop: 'static',
                keyboard: false,
                controller: function productAttributesModalController(MasterService, $scope, $uibModalInstance) {
					
					if(obj){
						$scope.name = obj.name
						$scope.value = obj.value;
						$scope.btns = {method:"edit",title:"Update"};
						// $scope.attValue = "";
						// for(var i=0; i<obj.value.length; i++){
						// 	if(obj.value[i].active){
						// 		$scope.attValue = $scope.attValue + obj.value[i].name + " ";
						// 	}
						// }
						// console.log($scope.attValue);
						// $scope.htmlTextArea = 'form-control tagarea';
					} else{
						$scope.value = [];
						// $scope.attValue = "";
						$scope.btns = {method:"save",title:"Save"};
						// $scope.htmlTextArea = 'form-control';
					}

					$scope.addValue = function() {
						if($scope.attribValue){
							$scope.value.push({name: $scope.attribValue, active: true});
							$scope.attribValue = "";
						}
					}

					$scope.rmAttrbVal = function(ind) {
						$scope.value[ind].active = false;
						// $scope.value.splice(ind,1);
					}

					$scope.save = function(){
						// var attribute = [];
						// var result = document.getElementsByClassName("tags");
						// var wrappedResult = angular.element(result);
						// for(var i=0; i<wrappedResult.length; i++){
						// 	if(wrappedResult[i].innerText){
						// 		attribute.push(wrappedResult[i].innerText);
						// 	}
						// }
						// console.log(attribute);
						if($scope.name){
							if($scope.attribValue){
								$scope.value.push({name: $scope.attribValue, active: true});
								$scope.attribValue = "";
							}
							if($scope.value.length){
								MasterService.saveProductAttribute({name: $scope.name,value: $scope.value}).then(function(res) {
									if(res.status === 200) {
										$scope.name = "";
										$scope.value = [];
										alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
										loadTable();
									} else {
										swal('', 'Failed to save product Attribute');
									}
								});
							}
						}
					}

					$scope.edit = function(){
						if($scope.name){
							if($scope.attribValue){
								$scope.value.push({name: $scope.attribValue, active: true});
								$scope.attribValue = "";
							}
							if($scope.value.length){
								obj.name = $scope.name;
								obj.value = $scope.value;
								MasterService.updateProductAttribute(obj).then(function(res) {
									if(res.status === 200) {
										loadTable();
										alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
										$scope.close();
									} else {
										swal('', 'Failed to save product Attribute');
									}
								});
							}
						}
					}

					$scope.cancel = function(){
						if(obj){
							$scope.close();
						}
						$scope.attribValue = "";
						$scope.name = "";
						$scope.value = [];
					}

                    $scope.close = function() {
                        $uibModalInstance.close();
                    }
                }
            });
        }
	}
}());

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}