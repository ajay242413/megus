(function() {
    'use strict';
	angular.module('app').controller('Accounts.Journal.IndexController', journalController);

    function journalController(VouchersService, DTOptionsBuilder, $scope, $uibModal){

    	var vm=this, activeObj={active:true}, groupIds=[];
        $scope.showDelete = false;
        loadDefault();
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);

        function loadDefault(){
        	VouchersService.readJournal().then(function(res) {
                $scope.journals = res.data;
            });
        }

        $scope.showEdit = function(){
            if($scope.showDelete){
                $scope.showDelete = false;
            } else{
                $scope.showDelete = true;
            }
        }

    	$scope.addNewJournal = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'journalModal.html',
                backdrop: 'static',
                keyboard: false,
                controller: function contraModalController(MasterService, CustomService, $scope, $filter, $uibModalInstance){
                    
                    $scope.journal = {};
                    $scope.journal.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.journal.refDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    refreshPicker();
                    initController();
                    
                    function initController(){
                        VouchersService.readVoucherNumber({type:'journal'}).then(function(res){
                            if(res.data.number){
                                if(res.data.number === 'empty'){
                                    swal("","Enter journal voucher number format in setting page.");
                                } else{
                                    $scope.journal.invoiceNumber = res.data.number;
                                }
                            }
                        });

                        MasterService.readLedgerGroup(activeObj).then(function(res){
                            $scope.ledgerGroups = res.data;
                            for(var i=0; i<$scope.ledgerGroups.length; i++){
                                groupRecrusion($scope.ledgerGroups[i]);
                            }
                            VouchersService.readLedger({group: groupIds}).then(function(res){
                                $scope.ledger = res.data;
                                refreshPicker();
                            });
                        });

                        MasterService.readProductName(activeObj).then(function(res) {
                            $scope.categories = res.data;
                            refreshPicker();
                        });

                        MasterService.readFinancialYear(activeObj).then(function(res){
                            if(res.data.length != 0){
                                $scope.journal.finYear = res.data[res.data.findIndex(x => x.status == true)]._id;
                            }
                        });
                    }

                    function refreshPicker(){
                        angular.element(document).ready(function(){ 
                            $('.selectpicker').selectpicker("refresh");
                            $('.datepicker').datetimepicker({maxDate:new Date(), format:'YYYY-MM-DD'});
                        });
                    }

                    $(function(){
                        $('#ledger_list').on('input',function(){
                            var opt = $('option[value="'+$(this).val()+'"]');
                            if(opt.attr('id')){
                                $scope.journal.ledgerFrom = opt.attr('id');
                            }else{
                                $scope.journal.ledgerFrom = undefined;
                            }
                        });
                    });

                    $(function(){
                        $('#ledger_list1').on('input',function(){
                            var opt = $('option[value="'+$(this).val()+'"]');
                            if(opt.attr('id')){
                                $scope.journal.ledgerTo = opt.attr('id');
                            }else{
                                $scope.journal.ledgerTo = undefined;
                            }
                        });
                    });

                    $scope.saveJournal = function(){
                        if($scope.journal.amount > 0){
                            if(($scope.journal.ledgerFrom) && ($scope.journal.ledgerTo)){
                                $scope.journal.refDate = angular.element($('#refDate')).val();
                                if(angular.element($('#transDate')).val()){
                                    $scope.journal.transDate = new Date(angular.element($('#transDate')).val());
                                }
                                VouchersService.saveJournal($scope.journal).then(function(res){
                                    loadDefault();
                                    $scope.close();
                                });
                            } else{
                                swal("", "Invalid Ledgers");
                            }
                        } else{
                            swal("", "Journal Amount is too low");
                        }
                    }

                    $scope.close = function(){
                        $uibModalInstance.close();
                    };
                }
            });
        }

        $scope.deleteAlert = function(vou){
            swal({
                title:"Are you sure ?", text:"You will not be able to recover this journal !", type:"warning", confirmButtonText:"Yes, delete it !", confirmButtonColor:'#7AC29A', showCancelButton:true, cancelButtonText:"Cancel", cancelButtonColor:'#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    deleteJournal(vou);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    swal("Journal bill not deleted !");
                }
            })
        }

        function deleteJournal(vou){
            swal({title:"Deleting", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
            VouchersService.removeJournal(vou).then(function(res){
                swal.close();
                if(res.data.status == 'Deleted'){
                    loadDefault();
                    swal("Journal is deleted","You will not be able to recover this journal !");
                } else{
                    // swal("Journal is not deleted");
                    showRj(res.data);
                }
            });
        }

        function showRj(vouchers){
            var modalInstance = $uibModal.open({
                templateUrl: 'showRj.html',
                backdrop: 'static',
                keyboard: false,
                controller: function showRjController($scope, $uibModalInstance){
                    $scope.rjs = [];
                    
                    if(vouchers[0].refJournal.length){
                        $scope.rjs = vouchers[0].refJournal;
                    }
                    if(vouchers[1].refJournal.length){
                        $scope.rjs = $scope.rjs.concat(vouchers[1].refJournal);
                    }

                    $scope.close = function(){
                        $uibModalInstance.close();
                    }
                }
            });
        }
        
        function groupRecrusion(ledObj){
            if((ledObj.name != "Bank Accounts") && (ledObj.name != "Cash-in-hand")){
                groupIds.push(ledObj._id);
                if(ledObj.subName.length){
                    for(var i=0; i<ledObj.subName.length; i++){
                        groupRecrusion(ledObj.subName[i]);
                    }
                }
            }
		}
    }
}());