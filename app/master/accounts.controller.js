(function() {
    'use strict';
    angular.module('app').controller('Accounts.IndexController', accountsController);

    function accountsController(MasterService, $state, $scope, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

		var vm=this, rows=[], getActiveObj={active:true}, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}];
		vm.loadTable = loadTable;
		vm.cancel = cancel;
		vm.dtInstance = {};
		vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthMenu', [50, 100, 250, 500]).withOption('order', [[0, 'asc']]).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
		loadDefault();

		function loadDefault(){
			$scope.accountsOptions = ['Financial Year','Ledger Group'];
			$scope.accountsOption = $scope.accountsOptions[0];
			refreshPicker();
			loadTable();
		}

		function refreshPicker() {
			angular.element(document).ready(function() { 
   				$('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'DD-MM-YYYY'});
   			});
		}

		function loadTable() {
			cancel();
			$scope.buttons = btnObj[0];
			switch($scope.accountsOption) {
				case $scope.accountsOptions[0]:
					 vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(4).notSortable().withClass('all')];
					 MasterService.readFinancialYear(getActiveObj).then(function(res) {
						$scope.rows = res.data;
						refreshPicker()
					 });
					 break;
				case $scope.accountsOptions[1]: 
					 vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable().withClass('all')];
					 MasterService.readLedgerGroup(getActiveObj).then(function(res) {
						$scope.result = res.data;
						$scope.rows = res.data;
						refreshPicker()
					 });
					 break;
			}
		}

		$scope.create = function(){
			switch($scope.accountsOption) {
				case $scope.accountsOptions[0]: 
					 $scope.finYear.fromDate = angular.element($('#finYearFromDate')).val();
					 $scope.finYear.toDate = angular.element($('#finYearToDate')).val();
					 if(($scope.finYear.finyear) && (angular.element($('#finYearFromDate')).val()) && ( angular.element($('#finYearToDate')).val())){
						 MasterService.saveFinancialYear($scope.finYear).then(function(res) {
							loadTable();
							alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
						 });
					 } else{
						 swal("","Financial Year, From Date and To Date are Compulsary Fields.");
					 }
					 break;

				case $scope.accountsOptions[1]: 
					 if($scope.ledger.parent){
						$scope.ledger.parent = $scope.ledger.parent;
					 }else{
						$scope.ledger.parent = undefined;
					 }
					 if($scope.ledger.name){
						 MasterService.saveLedgerGroup($scope.ledger).then(function(res) {
							loadTable();
							alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
						 });
					 } else{
						 swal("","Group Name is Compulsary.");
					 }
					 break;
			}
		}

		$scope.edit = function(data){
			var rowObj = angular.copy(data);
			$scope.buttons = btnObj[1];
			switch($scope.accountsOption) {
				case $scope.accountsOptions[0]: 
					 $scope.finYear = rowObj;
					 refreshPicker();
					 break;
				case $scope.accountsOptions[1]: 
					 $scope.ledger = rowObj;
					 if(data.parent){
						$scope.ledger.parent = data.parent._id;
					 }
					 refreshPicker();
					 break;
			}
		}

		$scope.update = function(){
			switch($scope.accountsOption) {
				case $scope.accountsOptions[0]: 
	            	 $scope.finYear.fromDate = angular.element($('#finYearFromDate')).val();
					 $scope.finYear.toDate = angular.element($('#finYearToDate')).val();
					 if(($scope.finYear.finyear) && (angular.element($('#finYearFromDate')).val()) && ( angular.element($('#finYearToDate')).val())){
						MasterService.updateFinancialYear($scope.finYear).then(function(res) {
						   loadTable();
						   alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
						});
					 } else{
						swal("","Financial Year, From Date and To Date are Compulsary Fields.");
					 }
					 break;
				case $scope.accountsOptions[1]:
					 if($scope.ledger.parent){
						$scope.ledger.parent = $scope.ledger.parent;
					 }else{
						$scope.ledger.parent = undefined;
					 }
					 if($scope.ledger.name){
						MasterService.updateLedgerGroup($scope.ledger).then(function(res) {
						   loadTable();
						   alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
						});
					 } else{
						swal("","Group Name is Compulsary.");
					 }
					 break;
			}
		}

		$scope.delete = function(data){
			switch($scope.accountsOption) {
				case $scope.accountsOptions[0]: 
					 MasterService.deleteFinancialYear({'_id': data}).then(function(res) {
						loadTable();
						alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
					 });
					 break;
				case $scope.accountsOptions[1]: 
					 MasterService.deleteLedgerGroup({'_id': data}).then(function(res) {
						 loadTable();
						 alert1('<b>Success</b> - Deleted Successfully', 'ti-thumb-up', 'success');
					 });
					 break;
			}
		}

		function cancel(){
			switch($scope.accountsOption) {
				case $scope.accountsOptions[0]:
					 $scope.finYear = {};
					 $scope.finYear.fromDate = undefined;
					 $scope.finYear.toDate = undefined;
					 $scope.finYear.status = false;
					 break;
				case $scope.accountsOptions[1]:
					 $scope.ledger = {};
					 $scope.ledger.parent = null;
					 break;
			}
		}
	}
}());

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}