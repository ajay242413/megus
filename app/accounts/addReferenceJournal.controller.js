(function() {
    'use strict';
	angular.module('app').controller('Accounts.AddReferenceJournal.IndexController', addReferenceJournalController);

    function addReferenceJournalController(VouchersService, MasterService, $scope, $state, $filter, DTOptionsBuilder) {

        var vm = this;
        vm.dtInstance = {};   
	    vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
        vm.dtInstance1 = {};
        vm.dtOptions1 = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
        vm.dtInstance2 = {};   
	    vm.dtOptions2 = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
        vm.dtInstance3 = {};   
	    vm.dtOptions3 = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            $scope.invAmount = [];
            $scope.invAmount1 = [];
            $scope.vouAmount = [];
            $scope.vouAmount1 = [];
            $scope.voucherCheck = [];
            $scope.voucherCheck1 = [];
            $scope.invoiceCheck = [];
            $scope.invoiceCheck1 = [];
            $scope.voucherAmount = 0;
            $scope.voucherAmount1 = 0;
            $scope.invoiceAmount = 0;
            $scope.invoiceAmount1 = 0;
            $scope.invAmtCop = 0;
            $scope.invAmtCop1 = 0;
            $scope.voucAmtCop = 0;
            $scope.voucAmtCop1 = 0;
            $scope.refJournal = {};
            $scope.refJournal1 = {};
            $scope.refJournal.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            $scope.refJournal1.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            refreshPicker();
            initController();
        }

        function initController(){
            VouchersService.readVoucherNumber({type:'refJournal'}).then(function(res){
                if(res.data.number){
                    if(res.data.number == 'empty'){
                        swal("","Enter reference Journal number format in setting page.");
                    } else{
                        $scope.refJournal.invoiceNumber = res.data.number;
                        $scope.refJournal1.invoiceNumber = res.data.number;
                    }
                }
            });

            VouchersService.readLedger().then(function(res) {
                $scope.ledgers = res.data;
                refreshPicker();
            });

            // MasterService.readProductName({active: true}).then(function(res) {
            //     $scope.categories = res.data;
            //     refreshPicker();
            // });
        }

        function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker("refresh");
            });
        }

        $scope.back = function(){
            $state.go('accounts.referenceJournal',null,{reload: true});
        }

        $scope.search = function(){
            if($scope.client){
                var ch = 0;
                swal({text:"Loading", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                VouchersService.readLedgerEntry({id:$scope.client, credit:1, pending:{$gt: 0}}).then(function(res){
                    $scope.vouchers = res.data;
                    ch = ch + 1;
                    if(ch == 2){
                        swal.close();
                    }
                });
                VouchersService.readLedgerEntry({id:$scope.client, debit:1, pending:{$gt: 0}}).then(function(res){
                    $scope.invoices = res.data;
                    ch = ch + 1;
                    if(ch == 2){
                        swal.close();
                    }
                });
            }
        }

        $scope.supplierChange = function(){
            if($scope.supplier){
                var ch = 0;
                swal({text:"Loading", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                VouchersService.readLedgerEntry({id:$scope.supplier, debit:1, pending:{$gt: 0}}).then(function(res){
                    $scope.vouchers1 = res.data;
                    ch = ch + 1;
                    if(ch == 2){
                        swal.close();
                    }
                });
                VouchersService.readLedgerEntry({id:$scope.supplier, credit:1, pending:{$gt: 0}}).then(function(res){
                    $scope.invoices1 = res.data;
                    ch = ch + 1;
                    if(ch == 2){
                        swal.close();
                    }
                });
            }
        }

        $scope.voucherAmountChange = function(){
            $scope.voucherAmount = 0;
            $scope.refJournal.vouchers = [];
            for(var k in $scope.voucherCheck){
                if($scope.voucherCheck[k]){
                    if(!$scope.vouAmount[k]){
                        $scope.vouAmount[k] = $scope.vouchers[k].pending;
                    }
                    if($scope.vouchers[k].pending >= $scope.vouAmount[k]){
                        $scope.voucherAmount = $scope.voucherAmount + $scope.vouAmount[k];
                        $scope.refJournal.vouchers.push({id:$scope.vouchers[k]._id, amount:$scope.vouAmount[k]});
                    }
                }
            }
            $scope.voucAmtCop =  $scope.voucherAmount;
            $scope.invoiceAmount = $scope.invAmtCop - $scope.voucherAmount;
        }

        $scope.invoiceAmountChange1 = function(){
            $scope.invoiceAmount1 = 0;
            $scope.refJournal1.invoices = [];
            for(var k in $scope.invoiceCheck1){
                if($scope.invoiceCheck1[k]){
                    if(!$scope.invAmount1[k]){
                        $scope.invAmount1[k] = $scope.invoices1[k].pending;
                    }
                    if($scope.invoices1[k].pending >= $scope.invAmount1[k]){
                        $scope.invoiceAmount1 = $scope.invoiceAmount1 + $scope.invAmount1[k];
                        $scope.refJournal1.invoices.push({id:$scope.invoices1[k]._id, amount:$scope.invAmount1[k]});
                    }
                }
            }
            $scope.invAmtCop1 = $scope.invoiceAmount1;
            $scope.voucherAmount1 = $scope.voucAmtCop1 - $scope.invoiceAmount1;
        }

        $scope.invoiceAmountChange = function(){
            $scope.invoiceAmount = 0;
            $scope.refJournal.invoices = [];
            for(var k in $scope.invoiceCheck){
                if($scope.invoiceCheck[k]){
                    if(!$scope.invAmount[k]){
                        $scope.invAmount[k] = $scope.invoices[k].pending;
                    }
                    if($scope.invoices[k].pending >= $scope.invAmount[k]){
                        $scope.invoiceAmount = $scope.invoiceAmount + $scope.invAmount[k];
                        $scope.refJournal.invoices.push({id:$scope.invoices[k]._id, amount:$scope.invAmount[k]});
                    }
                }
            }
            $scope.invAmtCop = $scope.invoiceAmount;
            $scope.invoiceAmount = $scope.invoiceAmount - $scope.voucAmtCop;
        }

        $scope.voucherAmountChange1 = function(){
            $scope.voucherAmount1 = 0;
            $scope.refJournal1.vouchers = [];
            for(var k in $scope.voucherCheck1){
                if($scope.voucherCheck1[k]){
                    if(!$scope.vouAmount1[k]){
                        $scope.vouAmount1[k] = $scope.vouchers1[k].pending;
                    }
                    if($scope.vouchers1[k].pending >= $scope.vouAmount1[k]){
                        $scope.voucherAmount1 = $scope.voucherAmount1 + $scope.vouAmount1[k];
                        $scope.refJournal1.vouchers.push({id:$scope.vouchers1[k]._id, amount:$scope.vouAmount1[k]});
                    }
                }
            }
            $scope.voucAmtCop1 =  $scope.voucherAmount1;
            $scope.voucherAmount1 = $scope.voucherAmount1 - $scope.invAmtCop1;
        }

        $scope.save = function(){
            if(($scope.invoiceAmount == 0) && ($scope.voucherAmount > 0)){
                $scope.refJournal.amount = $scope.voucherAmount;
                swal({text:"Saving", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                VouchersService.saveReferenceJournal($scope.refJournal).then(function(res){
                    if(res.data){
                        swal.close();
                        $scope.cancel();
                    }
                });
            }
        }

        $scope.save1 = function(){
            if(($scope.invoiceAmount1 > 0) && ($scope.voucherAmount1 == 0)){
                $scope.refJournal1.amount = $scope.invoiceAmount1;
                swal({text:"Saving", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                VouchersService.saveReferenceJournal($scope.refJournal1).then(function(res){
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
    }
}());