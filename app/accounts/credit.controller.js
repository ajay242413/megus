(function() {
    'use strict';
	angular.module('app').controller('Accounts.Credit.IndexController', creditController);

    function creditController(VouchersService, $scope, $uibModal, DTOptionsBuilder){

        var vm=this, activeObj={active:true};
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            VouchersService.readCredit().then(function(res){
                $scope.credits = res.data;
            });
        }

    	$scope.addNewCredit = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'editDebitModal.html',
                backdrop: 'static',
                keyboard: false,
                controller: function editDebitModalController(MasterService, CustomService, $scope, $filter, $uibModalInstance){

                    var groupIds=[], groupName=['Sundry Creditors', 'Sundry Debtors'];
                    $scope.credit = {};
                    $scope.credit.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.credit.refDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.credit.type = 'Without GST';
                    $scope.showItem = false;
                    refreshPicker();
                    initController();

                    function initController(){
                        VouchersService.readVoucherNumber({type:'credit'}).then(function(res){
                            if(res.data.number){
                                if(res.data.number === 'empty'){
                                    swal("","Enter credit voucher number format in setting page.");
                                } else{
                                    $scope.credit.invoiceNumber = res.data.number;
                                }
                            }
                        });

                        MasterService.readLedgerGroup(activeObj).then(function(res) {
                            $scope.ledgerGroups = res.data;
                            groupChange();
                        });

                        MasterService.readFinancialYear(activeObj).then(function (res){
                            if (res.data.length){
                                $scope.credit.finYear = res.data[res.data.findIndex(x => x.status == true)]._id;
                            }
                        });

                        MasterService.readProductItem(activeObj).then(function(res){
                            $scope.productItems = res.data;
                            refreshPicker();
                        });
                    }

                    function refreshPicker() {
                        angular.element(document).ready(function () {
                            $('.selectpicker').selectpicker("refresh");
                            $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
                        });
                    }

                    $scope.typeChange = function(){
                        $scope.credit.ledgerFrom = "";
                        $scope.credit.ledgerTo = "";
                        $scope.ledfrom = "";
                        $scope.ledto = "";
                        if($scope.credit.type == 'Without GST'){
                            groupName = ['Sundry Creditors', 'Sundry Debtors'];
                        } else{
                            groupName = ['Sundry Creditors', 'Sundry Debtors', 'Duties & Taxes', 'Sales Account', 'Purchase Account'];
                        }
                        groupChange();
                    }

                    $scope.showItemClick = function(){
                        refreshPicker();
                    }

                    $(function () {
                        $('#ledger_list').on('input', function () {
                            var opt = $('option[value="' + $(this).val() + '"]');
                            if (opt.attr('id')) {
                                $scope.credit.ledgerFrom = opt.attr('id');
                            }
                        });
                    });

                    $(function () {
                        $('#ledger_list1').on('input', function () {
                            var opt = $('option[value="' + $(this).val() + '"]');
                            if (opt.attr('id')) {
                                $scope.credit.ledgerTo = opt.attr('id');
                            }
                        });
                    });

                    $scope.saveCredit = function () {
                        if(($scope.credit.ledgerFrom) && ($scope.credit.ledgerTo)){
                            $scope.credit.date = angular.element($('#creditDate')).val();
                            if(angular.element($('#transDate')).val()){
                                $scope.credit.transDate = new Date(angular.element($('#transDate')).val());
                            }
                            VouchersService.saveCredit($scope.credit).then(function (res) {
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