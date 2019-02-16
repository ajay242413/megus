(function() {
	'use strict';

	angular.module('app').controller('Supplier.New.IndexController', newSupplierMasterController);

	function newSupplierMasterController(MasterService, UserService, CustomService, $state, $stateParams, $scope) {

		var vm=this, getActiveObj={active:true}, rowObj={}, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}];
		$scope.errormsgCount = 0;
		loadDefault();
		
		function loadDefault() {
			$scope.buttons = btnObj[0];
			$scope.supplier = {};
			$scope.contact = {};
			$scope.supplier.mobNum = [];
			$scope.contactObj = [];
			$scope.supplier.contact = [];
			$scope.errormsg = "";
			initController();
			refreshPicker();
   		}
   		
		function refreshPicker() {
			angular.element(document).ready(function() { 
   				$('.selectpicker').selectpicker("refresh");
   			});
		}

		function initController() {
			function loadLedger(){
                MasterService.readLedgerGroup({active: true, name: "Current Liabilities"}).then(function(res) {
                	$scope.ledger = CustomService.getObject(res.data, "name", "Sundry Creditors");
                    if((!$scope.ledger)) {
                    	$scope.errormsgCount = 1;
                        $scope.errormsg = $scope.errormsg + "Ledger Group('sundry creditors') not found !!!"
                        warningmsg();
                    }
				});
            }
			MasterService.readSupplierCategory(getActiveObj).then(function(res) {
				$scope.categoryList = res.data;
				refreshPicker();
		    }); 
			MasterService.readArea(getActiveObj).then(function(res) {
				$scope.areaList = res.data;
				refreshPicker();
		    }); 
           	MasterService.readCity(getActiveObj).then(function(res) {
				$scope.cityList = res.data;
				refreshPicker();
		    });
		    MasterService.readState(getActiveObj).then(function(res) {
				$scope.stateList = res.data;
				refreshPicker();
		    });
		    MasterService.readCountry(getActiveObj).then(function(res) {      
				$scope.countryList = res.data;
				refreshPicker();
		    });
		    MasterService.readClientDepartment(getActiveObj).then(function(res) {      
				$scope.departmentList = res.data;
				refreshPicker();
            });
            MasterService.readClientDesignation(getActiveObj).then(function(res) {      
				$scope.designationList = res.data;
				refreshPicker();
            });
            MasterService.readFinancialYear(getActiveObj).then(function(res) {
				$scope.finYear = res.data;
				var finInd = $scope.finYear.findIndex(x => x.status === true);
				if(($scope.finYear.length == 0) || (finInd > 0)){
                    $scope.errormsgCount = 1;
                    $scope.errormsg = $scope.errormsg + "Add Financial Year In Master Accounts Page.";
                    warningmsg();
				} else {
					loadLedger();
				}
			});
			UserService.getCurrentUser().then(function(res) {
                $scope.user = res.data;
                $scope.supplier.createdBy = $scope.user._id;
                refreshPicker();
			});
			MasterService.readSupplierCode().then(function(res){
				$scope.supplier.code = res.data.code;
		    });
		}
		
   		if($stateParams.obj) {
   			$scope.buttons = btnObj[1];
   			$scope.supplier = angular.copy($stateParams.obj);
   			if($stateParams.obj.category1)
   				$scope.supplier.category1 = $stateParams.obj.category1._id;
   			if($stateParams.obj.category2)
   				$scope.supplier.category2 = $stateParams.obj.category2._id;
   			if($stateParams.obj.area)
   				$scope.supplier.area = $stateParams.obj.area._id;
   			if($stateParams.obj.city)
   				$scope.supplier.city = $stateParams.obj.city._id;
   			if($stateParams.obj.country)
   				$scope.supplier.country = $stateParams.obj.country._id;
   			if($stateParams.obj.state)
   				$scope.supplier.state = $stateParams.obj.state._id;
   			if($stateParams.obj.contact)
   				$scope.contactObj = $stateParams.obj.contact;
   			for (var i = 0; i < $scope.contactObj.length; i++) {
   				if($scope.contactObj[i].department)
					$scope.contactObj[i].departName = $scope.contactObj[i].department.name;
				if($scope.contactObj[i].designation)
					$scope.contactObj[i].designName = $scope.contactObj[i].designation.name;
   			}
   			if($scope.contactObj.length != 0)
				$scope.showContactTable = true;	
			refreshPicker();
		}

		$scope.backClick = function() {
			$state.go('master.supplier',null,{reload: true});
		}

		function warningmsg(){
            swal({
                title: 'Missing Values',
                text: $scope.errormsg,
                type: 'warning'
            });
        }

		$scope.addPhoneNo = function() {
			if($scope.mobNo){	
				$scope.supplier.mobNum.push($scope.mobNo);
				$scope.mobNo = undefined;
			}
		}

		$scope.rmPhoneNo = function(ind) {
			$scope.supplier.mobNum.splice(ind,1);
		}

		$scope.addContacts = function() {
			if(($scope.contact.name) && ($scope.contact.phone) && ($scope.contact.email)){
				$scope.contactObj.push($scope.contact);
				if($scope.contact.department)
					$scope.contactObj[$scope.contactObj.length - 1].departName = $scope.departmentList[$scope.departmentList.findIndex(x => x._id == $scope.contact.department)].name;
				if($scope.contact.designation)
					$scope.contactObj[$scope.contactObj.length - 1].designName = $scope.designationList[$scope.designationList.findIndex(x => x._id == $scope.contact.designation)].name;
				$scope.contact = {};
				refreshPicker();
			}
			if($scope.contactObj.length == 0){
				$scope.showContactTable = false;	
			}else{
				$scope.showContactTable = true;	
			}
		}	

		$scope.rmContact = function(ind) {
			$scope.contactObj.splice(ind,1);	
			if($scope.contactObj.length == 0){
				$scope.showContactTable = false;	
			}else{
				$scope.showContactTable = true;	
			}	
		}

		$scope.create = function(){
			if($scope.errormsgCount == 0){
				if($scope.contactObj.length != 0) {
					$scope.supplier.contact = $scope.contactObj;
				} 
				if(($scope.contact.name) && ($scope.contact.phone) && ($scope.contact.email)) {
					$scope.supplier.contact.push($scope.contact);
				}
				if($scope.mobNo) {
					$scope.supplier.mobNum.push($scope.mobNo);
				}
				if($scope.finYear){
					$scope.supplier.finYear = $scope.finYear[$scope.finYear.findIndex(x => x.status === true)]._id;
				}
				if($scope.ledger){
					$scope.supplier.ledger = $scope.ledger._id;
				}
				if($scope.supplier){
					MasterService.saveSupplier($scope.supplier).then(function(res) {
						$state.reload();
					});
				}
			} else{
                warningmsg();
            }
		}

		$scope.update = function(){
			if($scope.errormsgCount == 0){
				if($scope.contactObj.length != 0) {
					$scope.supplier.contact = $scope.contactObj;
				} 
				if(($scope.contact.name) && ($scope.contact.phone) && ($scope.contact.email)) {
					$scope.supplier.contact.push($scope.contact);
				}
				if($scope.mobNo) {
					$scope.supplier.mobNum.push($scope.mobNo);
				}
				if($scope.supplier) {
					MasterService.updateSupplier($scope.supplier).then(function(res) {
						$state.go('master.supplier',null,{reload: true});
					});
				}
			} else{
                warningmsg();
            }
		}
	}
})();