(function() {
    'use strict';
	angular.module('app').controller('Accounts.Debit.IndexController', debitController);

    function debitController(VouchersService, $scope, $uibModal, DTOptionsBuilder) {

        var vm = this,activeObj = {active: true};
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            VouchersService.readDebit().then(function(res) {
                $scope.debits = res.data;
            });
        }

    	$scope.addNewDebit = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'editDebitModal.html',
                backdrop: 'static',
                keyboard: false,
                controller: function editDebitModalController(MasterService, CustomService, $scope, $filter, $uibModalInstance) {

                    var groupIds=[], groupName=['Sundry Creditors', 'Sundry Debtors'];
                    $scope.debit = {};
                    $scope.debit.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.debit.refDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.debit.type = 'Without GST';
                    $scope.showItem = false;
                    refreshPicker();
                    initController();

                    function initController(){
                        VouchersService.readVoucherNumber({type:'debit'}).then(function(res){
                            if(res.data.number){
                                if(res.data.number === 'empty'){
                                    swal("","Enter debit voucher number format in setting page.");
                                } else{
                                    $scope.debit.invoiceNumber = res.data.number;
                                }
                            }
                        });

                        MasterService.readLedgerGroup(activeObj).then(function(res) {
                            $scope.ledgerGroups = res.data;
                            groupChange();
                        });

                        MasterService.readFinancialYear(activeObj).then(function(res){
                            if (res.data.length){
                                $scope.debit.finYear = res.data[res.data.findIndex(x => x.status == true)]._id;
                            }
                        });

                        MasterService.readProductItem(activeObj).then(function(res){
                            $scope.productItems = res.data;
                            refreshPicker();
                        });
                    }

                    function refreshPicker(){
                        angular.element(document).ready(function(){
                            $('.selectpicker').selectpicker("refresh");
                            $('.datepicker').datetimepicker({ format: 'YYYY/DD/MM' });
                        });
                    }

                    $scope.typeChange = function(){
                        $scope.debit.ledgerFrom = "";
                        $scope.debit.ledgerTo = "";
                        $scope.ledfrom = "";
                        $scope.ledto = "";
                        if($scope.debit.type == 'Without GST'){
                            groupName = ['Sundry Creditors', 'Sundry Debtors'];
                        } else{
                            groupName = ['Sundry Creditors', 'Sundry Debtors', 'Duties & Taxes', 'Sales Account', 'Purchase Account'];
                        }
                        groupChange();
                    }

                    $scope.showItemClick = function(){
                        refreshPicker();
                    }

                    $(function(){
                        $('#ledger_list').on('input', function(){
                            var opt = $('option[value="' + $(this).val() + '"]');
                            if (opt.attr('id')){
                                $scope.debit.ledgerFrom = opt.attr('id');
                            }
                        });
                    });

                    $(function(){
                        $('#ledger_list1').on('input', function(){
                            var opt = $('option[value="' + $(this).val() + '"]');
                            if (opt.attr('id')){
                                $scope.debit.ledgerTo = opt.attr('id');
                            }
                        });
                    });

                    $scope.saveDebit = function(){
                        if(($scope.debit.ledgerFrom) && ($scope.debit.ledgerTo)){
                            $scope.debit.date = angular.element($('#debitDate')).val();
                            if(angular.element($('#transDate')).val()){
                                $scope.debit.transDate = new Date(angular.element($('#transDate')).val());
                            }
                            VouchersService.saveDebit($scope.debit).then(function (res) {
                                loadDefault();
                                $scope.close();
                            });
                        } else{
                            swal('Select From and To ledgers');
                        }
                    }

                    $scope.close = function () {
                        $uibModalInstance.close();
                    }

                    function groupChange(){
                        groupIds = [];
                        for(var i=0; i<groupName.length; i++){
                            groupRecrusion(CustomService.getObject($scope.ledgerGroups, "name", groupName[i]));
                        }
                        if(groupIds.length){
                            VouchersService.readLedger({group:groupIds}).then(function(res) {
                                $scope.ledger = res.data;
                            });
                        }
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
            });
        }
    }
}());