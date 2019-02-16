(function(){
    'use strict';
	angular.module('app').controller('Accounts.LedgerStatement.IndexController', ledgerStatementController);
	
	function ledgerStatementController(VouchersService, ExcelService, DTOptionsBuilder, $scope, $filter, $state, $stateParams){

		var vm=this;
		if($stateParams.obj != null){
			loadDefault();
		} else{
			$state.go('accounts.ledger',null,{reload: true})
		}
		
		function loadDefault(){
			$scope.opening = {credit:0, debit:0, result:0};
			$scope.closing = {credit:0, debit:0, result:0};
			$scope.showFields = {rec:false, rj:false, sal:false, prodCat:false, pay:false, pur:false};
			$scope.colspan = [1,5];
			$scope.result = [];
			$scope.showTable = false;
			$scope.from = $filter('date')(new Date(), "yyyy-MM-dd");
			$scope.to = $filter('date')(new Date(), "yyyy-MM-dd");
			$scope.ledgerName = $stateParams.obj.refId.name;
			$scope.ledgerGroup = $stateParams.obj.groupName;
			vm.dtInstance = {};
			vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
			refreshPicker();
		}

		$scope.back = function(){
			$state.go('accounts.ledger',null,{reload: true});
		}

		function refreshPicker(){
            angular.element(document).ready(function() {
                $('.datepicker').datetimepicker({format:'YYYY-MM-DD', maxDate:new Date()});
            });
        }

		$scope.search = function(){
			if(angular.element($('#from')).val() && angular.element($('#to')).val()){
				swal({text:"Loading", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
				VouchersService.readAccountStatement({from:angular.element($('#from')).val(), to:angular.element($('#to')).val(), ledger:$stateParams.obj._id}).then(function(res){
					if(res.data){
						$scope.result = [];
						$scope.opening = {credit:0, debit:0, result:0};
						$scope.closing = {credit:0, debit:0, result:0};
						$scope.showFields = {rec:false, rj:false, sal:false, pay:false, pur:false};
						$scope.colspan = [1,5];
						var total = 0;
						if(res.data.opening.length){
							if((res.data.opening[0].credit) && (res.data.opening[0].debit)){
								$scope.opening.result = parseFloat(res.data.opening[0].credit) - parseFloat(res.data.opening[0].debit);
							} else if(res.data.opening[0].credit){
								$scope.opening.result = parseFloat(res.data.opening[0].credit);
							} else{
								$scope.opening.result = 0 - parseFloat(res.data.opening[0].debit);
							}
							if($scope.opening.result >= 0){
								$scope.opening.credit = $scope.opening.result;
								$scope.opening.debit = 0;
							} else{
								$scope.opening.debit = 0 - $scope.opening.result;
								$scope.opening.credit = 0;
							}
							$scope.closing.credit = $scope.opening.credit;
							$scope.closing.debit = $scope.opening.debit;
							$scope.closing.result = $scope.opening.result;
							total = $scope.opening.result;
						}
						if(res.data.entries.length == 0){
							if($scope.opening.result < 0){
								$scope.closing.result = $scope.opening.result.toString() + " dr";
								$scope.closing.debitResult = $scope.opening.result;
								$scope.closing.creditResult = "";
							} else{
								$scope.closing.result = $scope.opening.result.toString() + " cr";
								$scope.closing.creditResult = $scope.opening.result;
								$scope.closing.debitResult = "";
							}
						} else{
							if(res.data.entries[0].type == 'o'){
								$scope.rowInd = 1;
							} else{
								$scope.rowInd = 0;
							}
							for(var i=0; i<res.data.entries.length; i++){
								if(res.data.entries[i].type != 'o'){
									var credit=0, debit=0;
									var balance="", type="";
									var rj=[], rec=[], sal=[], ptr=[], prodCat=[], pur=[];
									if(res.data.entries[i].credit){
										total = parseFloat(total) + parseFloat(res.data.entries[i].credit);
										$scope.closing.credit = parseFloat($scope.closing.credit) + parseFloat(res.data.entries[i].credit);
										credit = res.data.entries[i].credit;
									} else{
										total = parseFloat(total) - parseFloat(res.data.entries[i].debit);
										$scope.closing.debit = parseFloat($scope.closing.debit) + parseFloat(res.data.entries[i].debit);
										debit = res.data.entries[i].debit;
									}
									total = parseFloat(total).toFixed(2);
									if(total < 0){
										var tot = 0 - total;
										tot = parseFloat(tot).toFixed(2);
										$scope.closing.result = tot.toString() + " dr";
										$scope.closing.debitResult = tot;
										$scope.closing.creditResult = "";
										balance = tot.toString() + " dr";
									} else{
										$scope.closing.result = total.toString() + " cr";
										$scope.closing.creditResult = total;
										$scope.closing.debitResult = "";
										balance = total.toString() + " cr";
									}
									if(res.data.entries[i].type == "p"){
										type = "Purchase";
										ptr.push(res.data.entries[i].refId.party.name);
										ptr.push(res.data.entries[i].refId.remark);
										for(var j=0; j<res.data.entries[i].refId.category.length; j++){
											prodCat.push(res.data.entries[i].refId.category[j].name);
										}
									} else if(res.data.entries[i].type == "s"){
										type = "Sale";
										ptr.push(res.data.entries[i].refId.party.name);
										ptr.push(res.data.entries[i].refId.remark);
										for(var j=0; j<res.data.entries[i].refId.category.length; j++){
											prodCat.push(res.data.entries[i].refId.category[j].name);
										}
									} else if(res.data.entries[i].type == "r"){
										type = "Receipt";
										ptr.push(res.data.entries[i].refId.remark);
									} else if(res.data.entries[i].type == "j"){
										type = "Journal";
										ptr.push(res.data.entries[i].refId.remark);
									} else if(res.data.entries[i].type == "c"){
										type = "Contra";
										ptr.push(res.data.entries[i].refId.remark);
									} else if(res.data.entries[i].type == "y"){
										type = "Payment";
										ptr.push(res.data.entries[i].refId.remark);
									} else if(res.data.entries[i].type == "e"){
										type = "Credit";
										ptr.push(res.data.entries[i].refId.remark);
									} else if(res.data.entries[i].type == "d"){
										type = "Debit";
										ptr.push(res.data.entries[i].refId.remark);
									}
									if($scope.rj){
										for(var k=0; k<res.data.entries[i].refJournal.length; k++){
											rj.push(res.data.entries[i].refJournal[k].invoiceNumber + " - " +  res.data.entries[i].refJournal[k].amount);
										}
									}
									if((res.data.entries[i].type == "s") && ($scope.receipt)){
										for(var k=0; k<res.data.entries[i].refJournal.length; k++){
											for(var l=0; l<res.data.entries[i].refJournal[k].vouchers.length; l++){
												rec.push(res.data.entries[i].refJournal[k].vouchers[l].id.refId.invoiceNumber + " - " +  res.data.entries[i].refJournal[k].vouchers[l].amount);
											}
										}
									} else if((res.data.entries[i].type == "r") && ($scope.sale)){
										for(var k=0; k<res.data.entries[i].refJournal.length; k++){
											for(var l=0; l<res.data.entries[i].refJournal[k].invoices.length; l++){
												sal.push(res.data.entries[i].refJournal[k].invoices[l].id.refId.invoiceNumber + " - " +  res.data.entries[i].refJournal[k].invoices[l].amount);
											}
										}
									}  else if((res.data.entries[i].type == "p") && ($scope.purchase)){
										for(var k=0; k<res.data.entries[i].refJournal.length; k++){
											for(var l=0; l<res.data.entries[i].refJournal[k].invoices.length; l++){
												if(res.data.entries[i].refJournal[k].invoices[l].id.type == 'p'){
													pur.push(res.data.entries[i].refJournal[k].invoices[l].id.refId.invoiceNumber + " - " +  res.data.entries[i].refJournal[k].invoices[l].amount);
												}
											}
										}
									}
									$scope.result.push({date:res.data.entries[i].refDate, particular:ptr, docNo:res.data.entries[i].refId.invoiceNumber, 'prodCat':prodCat, refJou:rj, rece:rec, sale:sal, pur:pur, docType:type, cred:credit, deb:debit, bal:balance});
								}
							}
						}
						if($scope.rj){
							$scope.showFields.rj = true;
							$scope.colspan[0] = $scope.colspan[0] + 1;
							$scope.colspan[1] = $scope.colspan[1] + 1;
						}
						if($scope.receipt){
							$scope.showFields.rec = true;
							$scope.colspan[0] = $scope.colspan[0] + 1;
							$scope.colspan[1] = $scope.colspan[1] + 1;
						}
						if($scope.sale){
							$scope.showFields.sal = true;
							$scope.colspan[0] = $scope.colspan[0] + 1;
							$scope.colspan[1] = $scope.colspan[1] + 1;
						}
						if($scope.prodCat){
							$scope.showFields.prodCat = true;
							$scope.colspan[0] = $scope.colspan[0] + 1;
							$scope.colspan[1] = $scope.colspan[1] + 1;
						}
						if($scope.payment){
							$scope.showFields.pay = true;
							$scope.colspan[0] = $scope.colspan[0] + 1;
							$scope.colspan[1] = $scope.colspan[1] + 1;
						}
						if($scope.purchase){
							$scope.showFields.pur = true;
							$scope.colspan[0] = $scope.colspan[0] + 1;
							$scope.colspan[1] = $scope.colspan[1] + 1;
						}
						$scope.showTable = true;
						swal.close();
					}
	            });
			}
		}

		$scope.excelAlert = function(tableId){
            // XLS format
            ExcelService.exportTable(tableId,$scope.ledgerName);
        }
	}
}());