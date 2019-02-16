(function(){
    'use strict';
    angular.module('app').controller('PurchaseDc.IndexController', purchaseDcController);

    function purchaseDcController(SettingService, InventoryService, $state, $scope, $uibModal, DTOptionsBuilder, DTColumnDefBuilder){

        var vm = this;
        loadDefault();

        function loadDefault(){
            $scope.spName = "Stock Point";
            $scope.showaction = false;
            $scope.dtInstance = {};
            $scope.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(6).notSortable().withClass('all')];
            $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
            initController();
        }

        function initController(){
            SettingService.readSetting().then(function(res) {
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName = res.data[0].format.stockPoint;
                        }
                    }
                }
            });

        	InventoryService.readInventory({type: 'pdc'}).then(function(res){
                $scope.result = res.data;
            });
        }

        $scope.newPurchaseDc = function(){
        	$state.go('invoice.addPurchaseDc');
        }

        $scope.showAction = function(){
            if($scope.showaction){
                $scope.showaction = false;
            } else{
                $scope.showaction = true;
            }
        }
        
        $scope.moveToBill = function(res){
            if(res.totalQuantity != 0){
                $state.go('invoice.dcPurchaseBill', {obj: res});
            } else{
                swal('', 'Quantity is Zero');
            }
        }

        $scope.deleteAlert = function(invo){
            swal({
                title: "Are you sure ?",
                text: "You will not be able to recover this dc bill !",
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
                    swal("DC bill not deleted !");
                }
            })
        }
        
        function deleteInvoice(invoice){
            if(invoice.invenID.length){
                showSoldIMEI(invoice.invenID);
            } else{
                swal({title:"Deleting", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
                InventoryService.readInventoryById({id: invoice._id}).then(function(res){
                    if(res.data){
                        InventoryService.removeBrandPurchaseDcInvoice(res.data).then(function(res){
                            if(res.data){
                                swal.close();
                                loadDefault();
                                swal("DC bill is deleted", "You will not be able to recover this dc bill !");
                            }
                        });
                    }
                });
            }
        }

        $scope.editInvoice = function(invoice){
            if(invoice.invenID.length){
                showSoldIMEI(invoice.invenID);
            } else {
                $state.go('invoice.editInvoice',{obj: invoice,menu2: 'purchaseDc'},{reload: true});
            }
        }

        $scope.viewInvoice = function(invoice){
            $state.go('invoice.viewInvoice',{obj: invoice,menu2: 'purchaseDc'},{reload: true});
        }

        function showSoldIMEI(invoices){
            var modalInstance = $uibModal.open({
                templateUrl: 'soldInvoices.html',
                backdrop: 'static',
                keyboard: false,
                controller: function soldInvoicesController($scope, $uibModalInstance){
                    $scope.invoices = invoices;
                    
                    $scope.close = function() {
                        $uibModalInstance.close();
                    };
                }
            });
        }
    }
}());