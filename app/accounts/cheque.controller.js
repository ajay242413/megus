(function() {
    'use strict';
	angular.module('app').controller('Accounts.Cheque.IndexController', chequeController);

    function chequeController(MasterService, VouchersService, CustomService, $scope, $filter, $uibModal, $state, DTOptionsBuilder){

        var vm = this,activeObj = {active: true};
        $scope.bankLedgers = [];
        $scope.receiptCheck = [];
        $scope.receiptIds = [];
        $scope.present = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.payment = 'neft';
        vm.dtInstance = {};
        $scope.showTable = false;
	    vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('searching', false)
            .withOption('ordering', false)
            .withOption('paging', false)
            .withOption('lengthChange', false)
            .withPaginationType('full_numbers', false)
            .withOption('responsive', true)
            .withOption('info', false);
        loadDefault();

        function loadDefault(){
            refreshPicker();
            initController();
        }

        function initController(){
            MasterService.readLedgerGroup(activeObj).then(function(res){
                VouchersService.readLedger(activeObj).then(function(res1){
                    if(res1.data.length){
                        var bankLed = CustomService.getObject(res.data, "name", "Bank Accounts");
                        for(var i=0; i<res1.data.length; i++){
                            if(res1.data[i].ledgerGroup == bankLed._id){
                                $scope.bankLedgers.push(res1.data[i]);
                            }
                        }
                    }
                    refreshPicker();
                });
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function () {
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({maxDate:new Date(), format:'YYYY-MM-DD'});
            });
        }

        $scope.search = function(){
            if((angular.element($('#presentDate')).val()) && ($scope.bankLedger)){
                swal({
                    // title: ,
                    text: "Loading",
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    imageUrl: '../images/200px/spinner.gif'
                });
                $scope.receiptCheck = [];
                VouchersService.readBankReceipt({ledger: $scope.bankLedger, mode: $scope.payment, present:angular.element($('#presentDate')).val()}).then(function(res){
                    if(res.data){
                        $scope.showTable = true;
                        $scope.receipts = res.data;
                        swal.close();
                    }
                });
            }
        }

        $scope.receiptClicked = function(){
            $scope.receiptIds = [];
            for(var k in $scope.receiptCheck){
                if($scope.receiptCheck[k]){
                    $scope.receiptIds.push($scope.receipts[k]._id);
                }
            }
        }

        $scope.save = function(){
            if($scope.receiptIds.length){
                swal({
                    // title: ,
                    text: "Updating",
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    imageUrl: '../images/200px/spinner.gif'
                });
                VouchersService.updateReceiptBankDate({ids: $scope.receiptIds, date:angular.element($('#presentDate')).val()}).then(function(res){
                    if(res.data){
                        swal.close();
                        $scope.search();
                    }
                });
            }
        }

        $scope.cancel = function(){
            $state.reload();
        }

        $scope.openDialog = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'chequeModal.html',
                backdrop: 'static',
                keyboard: false,
                controller: function editReceiptModalController($scope, $uibModalInstance){

                    $scope.chequeNumbers =[];
                    $scope.showPicker = false;
                    $scope.showChequeTable = false;
                    refreshPicker();

                    $scope.searchCheque = function(){
                        if($scope.chequeNumber){
                            VouchersService.readCheque({num: $scope.chequeNumber}).then(function(res){
                                if(res.data.length){
                                    if(res.data.length == 1){
                                        $scope.receipts = res.data[0];
                                        $scope.showChequeTable = true;
                                        $scope.showPicker = false;
                                    } else{
                                        $scope.chequeNumbers = res.data;
                                        $scope.showPicker = true;
                                        $scope.showChequeTable = false;
                                    }
                                    refreshPicker();
                                } else{
                                    swal("","Data Not Found");
                                }
                            });
                        }
                    }

                    $scope.chequeModelChange = function(){
                        $scope.showChequeTable = true;
                        $scope.receipts = $scope.chequeNumbers[$scope.chequeModel];
                    }

                    $scope.updateCheque = function(){
                        VouchersService.updateCheque({id:$scope.receipts._id, no:$scope.receipts.bank.number, remark:$scope.remark}).then(function(res){
                            if(res.data){
                                $scope.close();
                            }
                        });
                    }

                    $scope.close = function () {
                        $uibModalInstance.close();
                    }
                }
            });
        }
    }
}());