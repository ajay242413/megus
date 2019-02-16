(function() {
    'use strict';
    angular.module('app').controller('Purchase.IndexController', purchaseController);

    function purchaseController(InventoryService, SettingService, VouchersService, $state, $scope, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        $scope.user = $scope.rootUser;
        $scope.showaction = false;
        $scope.dtInstance = {};
        $scope.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(10).notSortable().withClass('all')];
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();
        $scope.spName = "Stock Point";

        function loadDefault(){
            SettingService.readSetting().then(function(res) {
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName = res.data[0].format.stockPoint;
                        }
                    }
                }
            });

        	InventoryService.readInventory({'type': 'p'}).then(function(res){
                $scope.result = res.data;
            });
        }

        $scope.showAction = function(){
            if($scope.showaction){
                $scope.showaction = false;
            } else{
                $scope.showaction = true;
            }
        }

        $scope.addNewPurchase = function(){
        	$state.go('invoice.addPurchase',null,{reload: true});
        }

        $scope.purAck = function(){
            $state.go('invoice.purchaseAcknowledgement',null,{reload: true});
        }

        $scope.deleteAlert = function(invo){
            swal({
                title: "Are you sure ?",
                text: "You will not be able to recover this purchase bill !",
                type: "warning",
                confirmButtonText: "Yes, delete it !",
                confirmButtonColor: '#7AC29A',
                showCancelButton: true,
                cancelButtonText: "Cancel",
                cancelButtonColor: '#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    deleteInvoice(invo);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    swal("Purchase bill not deleted !");
                }
            })
        }
        
        function deleteInvoice(invoice){
            swal({title:"Deleting", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
            InventoryService.readInventoryById({id: invoice._id}).then(function(res){
                if(res.data){
                    if($scope.user.userType == 'd'){
                        InventoryService.removeRDSpurchaseInvoice(res.data).then(function(res){
                            if(res.data){
                                swal.close();
                                if(res.data.status){
                                    loadDefault();
                                    swal("Purchase bill is deleted", "You will not be able to recover this purchase bill !");
                                } else{
                                    showSoldIMEI(res.data);
                                }
                            }
                        });
                    } else{
                        InventoryService.removeBrandPurchaseInvoice(res.data).then(function(res){
                            if(res.data){
                                swal.close();
                                if(res.data.status){
                                    loadDefault();
                                    swal("Purchase bill is deleted", "You will not be able to recover this purchase bill !");
                                } else{
                                    showSoldIMEI(res.data.invoice, res.data.rj);
                                }
                            }
                        });
                    }
                }
            });
        }

        function showSoldIMEI(invo, rjs){
            var modalInstance = $uibModal.open({
                templateUrl: 'soldInvoices.html',
                backdrop: 'static',
                keyboard: false,
                controller: function soldInvoicesController($scope, $uibModalInstance){
                    $scope.invoices = invo;
                    $scope.rjs = rjs;
                    $scope.title = "";
                    $scope.showInvoices = false;
                    $scope.showRJ = false;
                    if(invo.length){
                        $scope.showInvoices = true;
                        $scope.title = "Invoices";
                    }
                    if(rjs.length){
                        $scope.showRJ = true;
                        if($scope.title == ""){
                            $scope.title = "RJ";
                        } else{
                            $scope.title = "Invoices and RJ";
                        }
                    }
                    $scope.close = function() {
                        $uibModalInstance.close();
                    };
                }
            });
        }

        $scope.editInvoice = function(invoice){
            swal({title:"Checking Reference Journal", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
            VouchersService.readRJinvoice({id:invoice._id, credit:1}).then(function(res){
                swal.close();
                if(res.data.length){
                    showSoldIMEI([],res.data);
                } else{
                    $state.go('invoice.editInvoice',{obj: invoice,menu2: 'purchase'},{reload: true});
                }
            });
        }

        $scope.viewInvoice = function(invoice){
            $state.go('invoice.viewInvoice',{obj: invoice,menu2: 'purchase'},{reload: true});
        }
    }
}());