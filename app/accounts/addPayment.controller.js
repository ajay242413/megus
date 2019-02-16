(function(){
    'use strict';
	angular.module('app').controller('Accounts.AddPayment.IndexController', addPaymentController);
    
    function addPaymentController(MasterService,  CustomService, VouchersService, $scope, $filter, $state, $uibModal){
        
        var vm=this, bankLedgers=[], cashLedgers=[], supLedgers=[], expLedgers=[], activeObj={active:true}, refJou={}, groupIds=[];
        var groupIds = [];
        loadDefault();
        
        function loadDefault(){
            $scope.payment = {};
            $scope.ledgerClone = [];
            $scope.clientLedgers =[];
            $scope.branches = [];
            $scope.banks = [];
            $scope.showBank = false;
            $scope.showAdjus = false;
            $scope.payment.type = 'cash';
            $scope.labelName = "TXN";
            $scope.payment.mode = 'neft';
            $scope.payment.agst = 'advance';
            $scope.bank = {};
            $scope.paymentFor = "Ledger";
            $scope.payment.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            $scope.payment.refDate = $filter('date')(new Date(), "yyyy-MM-dd");
            refreshPicker();
            initController();
        }

        function initController(){
            MasterService.readLedgerGroup(activeObj).then(function(res){
                $scope.ledgerGroups = res.data;
                var expLed = CustomService.getObject($scope.ledgerGroups, "name", "Indirect Expenses");
                groupRecrusion(expLed);
                VouchersService.readLedger({group: groupIds}).then(function(res){
                    expLedgers = res.data;
                    $scope.fromLedgers = res.data;
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
                var supLed = CustomService.getObject($scope.ledgerGroups, "name", "Sundry Creditors");
                groupRecrusion(supLed);
                VouchersService.readLedger({group: groupIds}).then(function(res){
                    supLedgers = res.data;
                });
                groupIds = [];
                var bankLed = CustomService.getObject($scope.ledgerGroups, "name", "Bank Accounts");
                groupRecrusion(bankLed);
                VouchersService.readLedger({group: groupIds}).then(function(res){
                    bankLedgers = res.data;
                });
                refreshPicker();
            });

            VouchersService.readVoucherNumber({type:'payment'}).then(function(res){
                if(res.data.number){
                    if(res.data.number === 'empty'){
                        swal("","Enter payment voucher number format in setting page.");
                    } else{
                        $scope.payment.invoiceNumber = res.data.number;
                        $scope.payment.refNumber = res.data.number;
                    }
                }
            });
            MasterService.readFinancialYear(activeObj).then(function(res){
                if(res.data.length != 0){
                    $scope.payment.finYear = res.data[res.data.findIndex(x => x.status == true)]._id;
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function () {
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        $scope.back = function(){
            $state.go('accounts.payment',null,{reload: true});
        }

        $scope.forChange = function(){
            $scope.payment.ledgerFrom = "";
            if($scope.paymentFor == 'Supplier'){
                $scope.fromLedgers = supLedgers;
            } else if($scope.paymentFor == 'Ledger'){
                $scope.fromLedgers = expLedgers;
            } else if($scope.paymentFor == 'Staff'){
                $scope.fromLedgers = [];
            } else{
                $scope.fromLedgers = [];
            }
            refreshPicker();
        }

        $scope.supplierChange = function(){
            if($scope.paymentFor == "Supplier"){
                $scope.payment.amount = "";
                var ledInd = $scope.fromLedgers.findIndex(x => x._id == $scope.payment.ledgerFrom);
                if(ledInd >= 0){
                    refJou = {};
                    if($scope.fromLedgers[ledInd].bank){
                        $scope.banks = $scope.fromLedgers[ledInd].bank;
                    }else{
                        $scope.banks = [];
                    }
                    if($scope.fromLedgers[ledInd].branch){
                        $scope.branches = $scope.fromLedgers[ledInd].branch;
                    } else{
                        $scope.branches = [];
                    }
                    VouchersService.readLedgerEntry({id:$scope.payment.ledgerFrom, credit:1, pending:{$ne: 0}}).then(function(res){
                        vm.invoices = res.data;
                    });
                }
            }
        }

        $scope.payTypeChange = function(){
            if($scope.payment.type == "bank"){
                if(!$scope.payment.mode){
                    $scope.payment.mode = 'neft';
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
            if($scope.payment.agst == "agst"){
                $scope.showAdjus = true;
            } else{
                $scope.showAdjus = false;
            }
        }

        $scope.payModeChange = function(){
            if($scope.payment.mode == "neft"){
                $scope.labelName = "TXN";
            } else if($scope.payment.mode == "cheque"){
                $scope.labelName = "Cheque";
            } else{
                $scope.labelName = "DD";
            }
        }

        $scope.addBank = function(){
            if($scope.bank.bank){
                var ledInd = $scope.fromLedgers.findIndex(x => x._id == $scope.payment.ledgerFrom);
                if(ledInd >= 0){
                    $scope.banks.push($scope.bank.bank);
                    VouchersService.updateMainLedger({bank:$scope.banks, _id:$scope.fromLedgers[ledInd]._id}).then(function(res){
                    });
                }
            }
        }

        $scope.addBranch = function(){
            if($scope.bank.branch){
                var ledInd = $scope.fromLedgers.findIndex(x => x._id == $scope.payment.ledgerFrom);
                if(ledInd >= 0){
                    $scope.branches.push($scope.bank.branch);
                    VouchersService.updateMainLedger({branch:$scope.branches, _id:$scope.fromLedgers[ledInd]._id}).then(function(res){
                    });
                }
            }
        }

        $scope.agstModal = function(){
            if($scope.payment.ledgerFrom  && $scope.payment.amount){
                var amt = $scope.payment.amount;
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

        $scope.savePayment = function(){
            var errorCode = 0;
            if($scope.payment.type == "bank"){
                if(angular.element($('#transDate')).val() != undefined){
                    $scope.bank.transDate = angular.element($('#transDate')).val();
                    if($scope.payment.mode == 'cheque'){
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
                    $scope.payment.bank = $scope.bank;
                } else{
                    errorCode = 1;
                    swal("", "Select Transaction Date");
                }
            } else{
                $scope.payment.mode = undefined;
            }
            if($scope.payment.agst == "agst"){
                if(refJou.ic){
                    $scope.payment.refJournal = refJou.refereneJournal;
                } else{
                    errorCode = 1;
                    swal("", "Adjust Invoices");
                }
            }
            if(errorCode == 0){
                $scope.bank.refDate = angular.element($('#refDate')).val();
                swal({
                    // title: ,
                    text: "payment Creating",
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    imageUrl: '../images/200px/spinner.gif'
                });
                VouchersService.savePayment($scope.payment).then(function(res){
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