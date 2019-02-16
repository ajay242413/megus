(function() {
    'use strict';
	angular.module('app').controller('Accounts.Contra.IndexController', contraController);

    function contraController(VouchersService, DTOptionsBuilder, $scope, $uibModal){

        var vm=this, activeObj={active:true}, groupIds=[];
        $scope.showDelete = false;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
        	VouchersService.readContra().then(function(res){
                $scope.contras = res.data;
            });
        }

        $scope.showEdit = function(){
            if($scope.showDelete){
                $scope.showDelete = false;
            } else{
                $scope.showDelete = true;
            }
        }

        $scope.addNewContra = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'contraModal.html',
                backdrop: 'static',
                keyboard: false,
                controller: function contraModalController(MasterService, CustomService, $scope, $filter, $uibModalInstance){
                    
                    $scope.contra = {};
                    $scope.contra.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    $scope.contra.refDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    refreshPicker();
                    initController();
                    
                    function initController(){
                        VouchersService.readVoucherNumber({type:'contra'}).then(function(res){
                            if(res.data.number){
                                if(res.data.number === 'empty'){
                                    swal("","Enter contra voucher number format in setting page.");
                                } else{
                                    $scope.contra.invoiceNumber = res.data.number;
                                }
                            }
                        });

                        MasterService.readLedgerGroup(activeObj).then(function(res){
                            $scope.ledgerGroups = res.data;
                            var bankLed = CustomService.getObject($scope.ledgerGroups, "name", "Bank Accounts");
                            groupRecrusion(bankLed);
                            var cashLed = CustomService.getObject($scope.ledgerGroups, "name", "Cash-in-hand");
                            groupRecrusion(cashLed);
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
                                $scope.contra.finYear = res.data[res.data.findIndex(x => x.status == true)]._id;
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
                                $scope.contra.ledgerFrom = opt.attr('id');
                            }else{
                                $scope.contra.ledgerFrom = undefined;
                            }
                        });
                    });

                    $(function(){
                        $('#ledger_list1').on('input',function(){
                            var opt = $('option[value="'+$(this).val()+'"]');
                            if(opt.attr('id')){
                                $scope.contra.ledgerTo = opt.attr('id');
                            }else{
                                $scope.contra.ledgerTo = undefined;
                            }
                        });
                    });

                    $scope.saveContra = function(){
                        if($scope.contra.amount > 0){
                            if(($scope.contra.ledgerFrom) && ($scope.contra.ledgerTo)){
                                $scope.contra.refDate = angular.element($('#refDate')).val();
                                if(angular.element($('#transDate')).val()){
                                    $scope.contra.transDate = new Date(angular.element($('#transDate')).val());
                                }
                                VouchersService.saveContra($scope.contra).then(function(res){
                                    loadDefault();
                                    $scope.close();
                                });
                            } else{
                                swal("", "Invalid Ledgers");
                            }
                        } else{
                            swal("", "Contra Amount is too low");
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
                title:"Are you sure ?", text:"You will not be able to recover this contra !", type:"warning", confirmButtonText:"Yes, delete it !", confirmButtonColor:'#7AC29A', showCancelButton:true, cancelButtonText:"Cancel", cancelButtonColor:'#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    deleteJournal(vou);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    swal("Contra bill not deleted !");
                }
            })
        }

        function deleteJournal(vou){
            swal({title:"Deleting", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
            VouchersService.removeContra(vou).then(function(res){
                swal.close();
                if(res.data.status == 'Deleted'){
                    loadDefault();
                    swal("Contra is deleted","You will not be able to recover this contra !");
                } else{
                    swal("Contra is not deleted");
                }
            });
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