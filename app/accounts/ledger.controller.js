(function() {
    'use strict';
	angular.module('app').controller('Accounts.Ledger.IndexController', ledgerController);
	
	function ledgerController(MasterService, VouchersService, CustomService, ExcelService, $scope, $state, $uibModal, $filter, DTOptionsBuilder, DTColumnDefBuilder) {

		var vm=this, activeObj={active:true}, groupIds=[];
		$scope.ledgerGroupList = ["Cash / Bank Ledger", "General", "Indirect Expenses", "Sundry Creditors", "Sundry Debtors"];
		$scope.showDelete = false;
		vm.dtInstance = {};
		vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(4).notSortable().withClass('all')];
	    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
		loadDefault();

		function loadDefault(){
			vm.initController = initController;
			vm.initController();
			refreshPicker();
		}

		function initController(){
			MasterService.readLedgerGroup({active: true}).then(function(res) {
				$scope.ledgerGroups = res.data;
				$scope.groupName = $scope.ledgerGroupList[4];
				$scope.groupChange();
			});
		}

		function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format:'YYYY-MM-DD'});
            });
		}

		$scope.showEdit = function(){
			if($scope.showDelete){
				$scope.showDelete = false;
			} else{
				$scope.showDelete = true;
			}
		}
		
		$scope.groupChange = function(){
			groupIds = [];
			if($scope.groupName == "Cash / Bank Ledger"){
				var bank = CustomService.getObject($scope.ledgerGroups, "name", "Bank Accounts");
				var cash = CustomService.getObject($scope.ledgerGroups, "name", "Cash-in-hand");
				groupRecrusion(bank);
				groupRecrusion(cash);
			} else if($scope.groupName == "Indirect Expenses"){
				for(var i=0; i<$scope.ledgerGroups.length; i++){
					if($scope.ledgerGroups[i].name === "Indirect Expenses"){
						groupRecrusion($scope.ledgerGroups[i]);
					}
				}
			} else if($scope.groupName != "General"){
				var others = CustomService.getObject($scope.ledgerGroups, "name", $scope.groupName);
				groupRecrusion(others);
			}  else{
				for(var i=0; i<$scope.ledgerGroups.length; i++){
					if($scope.ledgerGroups[i].name != "Indirect Expenses"){
						groupIds.push($scope.ledgerGroups[i]._id);
						for(var j=0; j<$scope.ledgerGroups[i].subName.length; j++){
							if(($scope.ledgerGroups[i].subName[j].name!="Bank Accounts") && ($scope.ledgerGroups[i].subName[j].name!="Cash-in-hand") && ($scope.ledgerGroups[i].subName[j].name!="Sundry Debtors") && ($scope.ledgerGroups[i].subName[j].name!="Sundry Creditors")){
								groupRecrusion($scope.ledgerGroups[i].subName[j]);
							}
						}
					}
				}
			}
			if(groupIds.length){
				VouchersService.readLedger({group: groupIds}).then(function(res) {
					$scope.result = res.data;
				});
			}
		}

		$scope.viewLedger = function(id){
			var test = CustomService.getObject($scope.ledgerGroups, "_id", id);
			return test.name;
		}

		$scope.addNewLedger = function(){
			var modalInstance = $uibModal.open({
				templateUrl: 'newLedgerModal.html',
				backdrop: 'static',
				keyboard: false,
				controller: function newLedgerModalController(MasterService, $scope, $uibModalInstance) {
					$scope.ledger = {};
					$scope.ledger.ledgerGroup = '';

					MasterService.readFinancialYear(activeObj).then(function(res) {
						$scope.finYears = res.data;
						var finInd = $scope.finYears.findIndex(x => x.status === true);
						if(($scope.finYears.length == 0) || (finInd > 0)){
							swal({text:'Add Financial Year In Master Accounts Page.', type:'warning'});
						} else{
							$scope.actFinYear = [];
							$scope.actFinYear.push($scope.finYears[finInd]);
							$scope.ledger.finYear = $scope.finYears[finInd]._id;
						}
						refreshPicker();
		            });

		            MasterService.readLedgerGroup(activeObj).then(function(res) {
		                $scope.ledgerGroups = res.data;
		                refreshPicker();
					});

		            function refreshPicker(){
						angular.element(document).ready(function() {
			                $('.selectpicker').selectpicker("refresh");
			            });
					}

					$scope.saveLedger = function(){
						if(($scope.ledger.name) && ($scope.ledger.ledgerGroup) && ($scope.ledger.finYear)){
							VouchersService.saveLedger($scope.ledger).then(function(res){
								vm.initController();
								$uibModalInstance.close();
							});
						} else{
							swal("Warning", "Ledger Name,ledger Group and Financial Fields are Compulsary.");
						}
					}

					$scope.setDebit = function(){
						$scope.ledger.debit = 0;
					}

					$scope.setCredit = function(){
						$scope.ledger.credit = 0;
					}

					$scope.close = function() {
						$uibModalInstance.close();
					};
				}
			});
		}

		$scope.viewLedgerEntry = function(data){
			var test = CustomService.getObject($scope.ledgerGroups, "_id", data.ledgerGroup);
			data.groupName = test.name;
			$state.go('accounts.ledgerStatement',{'obj': data})
		}

		$scope.removeLedger = function(data){
			// VouchersService.removeLedger({_id: data._id}).then(function(res){
            //     vm.initController();
            // });
		}

		$scope.editLedger = function(data){
			var modalInstance = $uibModal.open({
				templateUrl: 'editLedgerModal.html',
				backdrop: 'static',
				keyboard: false,
				controller: function editLedgerModalController(MasterService, UserService, $scope, $uibModalInstance) {

					$scope.ledger = angular.copy(data);

					MasterService.readFinancialYear(activeObj).then(function(res) {
		                $scope.finYears = res.data;
		            });

		            MasterService.readLedgerGroup(activeObj).then(function(res) {
		                $scope.ledgerGroups = res.data;
		                refreshPicker();
					});
					
					$scope.ledger.ledgerGroup = data.ledgerGroup._id;
					$scope.ledger.finYear = data.finYear._id;
					$scope.ledger.name = data.refId.name;
					$scope.ledger.gstin = data.refId.gstin;
					$scope.ledger.panID = data.refId.panID;
					if(data.refType != 'client')
						$scope.ledger.address = data.refId.address;

		            function refreshPicker(){
						angular.element(document).ready(function() {
			                $('.selectpicker').selectpicker("refresh");
			            });
					}

					$scope.updateLedger = function(){
						if(($scope.ledger.name) && ($scope.ledger.ledgerGroup) && ($scope.ledger.finYear)){
							console.log($scope.ledger);
							// VouchersService.updateLedger($scope.ledger).then(function(res){
							// 	vm.initController();
							// 	$uibModalInstance.close();
							// });
						} else{
							swal("Warning","Ledger Name,ledger Group and Financial Fields are Compulsary.");
						}
					}

					$scope.close = function(){
						$uibModalInstance.close();
					};
				}
			});
		}

		$scope.excelAlert = function(tableId){
            // XLS format
            ExcelService.exportTable(tableId,$scope.groupName + $filter('date')(new Date(), "yyyy-MM-dd"));
        }

		function groupRecrusion(ledObj){
			groupIds.push(ledObj._id);
			if(ledObj.subName.length){
				for(var i=0; i<ledObj.subName.length; i++){
					groupRecrusion(ledObj.subName[i]);
				}
			}
		}
	}
}());