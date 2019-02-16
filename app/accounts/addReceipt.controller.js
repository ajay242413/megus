(function(){
    'use strict';
	angular.module('app').controller('Accounts.AddReceipt.IndexController', addReceiptController);
    
    function addReceiptController(MasterService,  CustomService, VouchersService, $scope, $filter, $state, $uibModal){
        
        var vm=this, bankLedgers=[], cashLedgers=[], activeObj={active:true}, refJou={}, groupIds=[];
        $scope.receipt = {};
        $scope.ledgerClone = [];
        $scope.clientLedgers =[];
        $scope.branches = [];
        $scope.banks = [];
        $scope.showBank = false;
        $scope.showAdjus = false;
        $scope.receipt.type = 'cash';
        $scope.labelName = "TXN";
        $scope.receipt.mode = 'neft';
        $scope.receipt.agst = 'advance';
        $scope.bank = {};
        $scope.receipt.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.receipt.refDate = $filter('date')(new Date(), "yyyy-MM-dd");
        refreshPicker();
        initController();

        function initController(){
            MasterService.readLedgerGroup(activeObj).then(function(res){
                $scope.ledgerGroups = res.data;
                var cliLed = CustomService.getObject($scope.ledgerGroups, "name", "Sundry Debtors");
                groupRecrusion(cliLed);
                VouchersService.readLedger({group: groupIds}).then(function(res){
                    $scope.clientLedgers = res.data;
                    refreshPicker();
                });
                groupIds = [];
                var cashLed = CustomService.getObject($scope.ledgerGroups, "name", "Cash-in-hand");
                groupRecrusion(cashLed);
                VouchersService.readLedger({group: groupIds}).then(function(res){
                    cashLedgers = res.data;
                    $scope.ledgerClone = res.data;
                    refreshPicker();
                });
                groupIds = [];
                var bankLed = CustomService.getObject($scope.ledgerGroups, "name", "Bank Accounts");
                groupRecrusion(bankLed);
                VouchersService.readLedger({group: groupIds}).then(function(res){
                    bankLedgers = res.data;
                    refreshPicker();
                });
                refreshPicker();
            });
            VouchersService.readVoucherNumber({type:'receipt'}).then(function(res){
                if(res.data.number){
                    if(res.data.number === 'empty'){
                        swal("","Enter receipt voucher number format in setting page.");
                    } else{
                        $scope.receipt.invoiceNumber = res.data.number;
                        $scope.receipt.refNumber = res.data.number;
                    }
                }
            });
            MasterService.readFinancialYear(activeObj).then(function(res){
                if(res.data.length != 0){
                    $scope.receipt.finYear = res.data[res.data.findIndex(x => x.status == true)]._id;
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function () {
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({ format: 'YYYY-MM-DD'});
            });
        }

        $scope.back = function(){
            $state.go('accounts.receipt',null,{reload: true});
        }

        $scope.clientChange = function(){
            $scope.receipt.amount = "";
            var ledInd = $scope.clientLedgers.findIndex(x => x._id == $scope.receipt.ledgerFrom);
            if(ledInd >= 0){
                refJou = {};
                if($scope.clientLedgers[ledInd].bank){
                    $scope.banks = $scope.clientLedgers[ledInd].bank;
                } else{
                    $scope.banks = [];
                }
                if($scope.clientLedgers[ledInd].branch){
                    $scope.branches = $scope.clientLedgers[ledInd].branch;
                } else{
                    $scope.branches = [];
                }
                VouchersService.readLedgerEntry({id:$scope.receipt.ledgerFrom, debit:1, pending:{$ne: 0}}).then(function(res){
                    vm.invoices = res.data;
                });
            }
        }

        $scope.payTypeChange = function(){
            if($scope.receipt.type == "bank"){
                if(!$scope.receipt.mode){
                    $scope.receipt.mode = 'neft';
                }
                $scope.showBank = true;
                $scope.ledgerClone = bankLedgers;
            } else{
                $scope.ledgerClone = cashLedgers;
                $scope.showBank = false;
            }
            refreshPicker();
        }

        $scope.adstChange = function(){
            refJou = {};
            if($scope.receipt.agst == "agst"){
                $scope.showAdjus = true;
            } else{
                $scope.showAdjus = false;
            }
        }

        $scope.setRefJou = function(){
            refJou = {};
        }

        $scope.agstModal = function(){
            if($scope.receipt.ledgerFrom  && $scope.receipt.amount){
                var amt = $scope.receipt.amount;
                var modalInstance = $uibModal.open({
                    templateUrl: 'agstModal.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: function editReceiptModalController($scope, $filter, $uibModalInstance){

                        $scope.amount = 0 - amt;
                        $scope.invoices = vm.invoices;
                        $scope.refJournal = {};
                        $scope.invAmount = [];
                        $scope.invoiceCheck = [];
                        $scope.invAmtCop = 0;
                        $scope.refJournal.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");

                        VouchersService.readVoucherNumber({type:'refJournal'}).then(function(res){
                            if(res.data.number){
                                if(res.data.number == 'empty'){
                                    swal("","Enter reference Journal number format in setting page.");
                                } else{
                                    $scope.refJournal.invoiceNumber = res.data.number;
                                }
                            }
                        });

                        if(refJou.ic){
                            $scope.amount = 0;
                            $scope.invoiceCheck = refJou.ic;
                            $scope.invAmount = refJou.ia;
                        }

                        $scope.invoiceAmountChange = function(){
                            $scope.amount = 0;
                            $scope.refJournal.invoices = [];
                            for(var k in $scope.invoiceCheck){
                                if($scope.invoiceCheck[k]){
                                    if(!$scope.invAmount[k]){
                                        $scope.invAmount[k] = $scope.invoices[k].pending;
                                    }
                                    if($scope.invoices[k].pending >= $scope.invAmount[k]){
                                        $scope.amount = $scope.amount + $scope.invAmount[k];
                                        $scope.refJournal.invoices.push({id:$scope.invoices[k]._id, amount:$scope.invAmount[k]});
                                    } else{
                                        swal("", "Invalid Current Amount");
                                    }
                                }
                            }
                            $scope.invAmtCop = $scope.amount;
                            $scope.amount = $scope.amount - amt;
                        }

                        $scope.close = function () {
                            $uibModalInstance.close();
                        }

                        $scope.saveAgst = function(){
                            if($scope.amount == 0){
                                $scope.refJournal.amount = amt;
                                refJou.refereneJournal = $scope.refJournal;
                                refJou.ic = $scope.invoiceCheck;
                                refJou.ia= $scope.invAmount;
                                $scope.close();
                            } else{
                                swal("", "Adjust Full Amount");
                            }
                        }
                    }
                });
            } else{
                swal("", "Select Party and Enter Amount to adjust");
            }
        }

        $scope.payModeChange = function(){
            if($scope.receipt.mode == "neft"){
                $scope.labelName = "TXN";
            } else if($scope.receipt.mode == "cheque"){
                $scope.labelName = "Cheque";
            } else{
                $scope.labelName = "DD";
            }
        }

        $scope.addBank = function(){
            if($scope.bank.bank){
                var ledInd = $scope.clientLedgers.findIndex(x => x._id == $scope.receipt.ledgerFrom);
                if(ledInd >= 0){
                    $scope.banks.push($scope.bank.bank);
                    VouchersService.updateMainLedger({bank:$scope.banks, _id:$scope.clientLedgers[ledInd]._id}).then(function(res){
                        // console.log(res.data);
                    });
                }
            }
        }

        $scope.addBranch = function(){
            if($scope.bank.branch){
                var ledInd = $scope.clientLedgers.findIndex(x => x._id == $scope.receipt.ledgerFrom);
                if(ledInd >= 0){
                    $scope.branches.push($scope.bank.branch);
                    VouchersService.updateMainLedger({branch:$scope.branches, _id:$scope.clientLedgers[ledInd]._id}).then(function(res){
                        // console.log(res.data);
                    });
                }
            }
        }

        $scope.saveReceipt = function(){
            var errorCode = 0;
            if($scope.receipt.type == "bank"){
                if(angular.element($('#transDate')).val() != undefined){
                    $scope.bank.transDate = angular.element($('#transDate')).val();
                    if($scope.receipt.mode == 'cheque'){
                        $scope.bank.count = 0;
                    } else{
                        $scope.bank.count = undefined;
                    }
                    $scope.bank.active = true;
                    if(!$scope.depositDate){
                        $scope.bank.brsDate = undefined;
                    } else{
                        $scope.bank.brsDate = angular.element($('#brsDate')).val();
                    }
                    $scope.receipt.bank = $scope.bank;
                } else{
                    errorCode = 1;
                    swal("", "Select Transaction Date");
                }
            } else{
                $scope.receipt.mode = undefined;
            }
            if($scope.receipt.agst == "agst"){
                if(refJou.ic){
                    $scope.receipt.refJournal = refJou.refereneJournal;
                } else{
                    errorCode = 1;
                    swal("", "Adjust Invoices");
                }
            }
            if(errorCode == 0){
                $scope.bank.refDate = angular.element($('#refDate')).val();
                swal({
                    // title: ,
                    text: "Receipt Creating",
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    imageUrl: '../images/200px/spinner.gif'
                });
                VouchersService.saveReceipt($scope.receipt).then(function(res){
                    if(res.data){
                        swal.close();
                        $scope.cancel();
                    }
                });
            }
        }

        $scope.cancel = function(){
            $state.reload();
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