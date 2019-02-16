(function() {
    'use strict';
    angular.module('app').controller('StockTransfer.IndexController', stockTransferController);

    function stockTransferController(InventoryService, SettingService, $state, $scope, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        $scope.user = $scope.rootUser;
        $scope.spName = ["Stock Point","Serial Number"];
        $scope.showaction = false;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('searching', true)
            .withOption('ordering', false)
            .withOption('paging', true)
            .withOption('lengthMenu', [50, 100, 150, 200])
            .withOption('lengthChange', true)
            .withPaginationType('full_numbers', true)
            .withOption('responsive', true)
            .withOption('info', false);
        loadDefault();

        function loadDefault(){
            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName[0] = res.data[0].format.stockPoint;
                        }
                    }
                }
            });

        	InventoryService.readInventory({'type': 't'}).then(function(res){
                $scope.result = res.data;
            });
        }

        $scope.showAction = function(){
            if($scope.showaction){
                $scope.showaction = false;
            } else{
                $scope.showaction = true;
                vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(7).notSortable()];
            }
        }

        $scope.addNewTransfer = function(){
        	$state.go('invoice.addStockTransfer',null,{reload: true});
        }

        $scope.deleteAlert = function(invo){
            swal({
                title: "Are you sure ?",
                text: "You will not be able to recover this stock transfer bill !",
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
                    swal("Stock Transfer bill not deleted !");
                }
            })
        }
        
        function deleteInvoice(invoice){
            swal({
                title: "Deleting",
                showCancelButton: false,
                showConfirmButton: false,
                imageUrl: '../images/200px/spinner.gif'
            });
            InventoryService.removeStockTransfer(invoice).then(function(res){
                if(res.data){
                    swal.close();
                    if(res.data.status){
                        loadDefault();
                        swal("Stock Transfer bill is deleted","You will not be able to recover this stock transfer bill !");
                    } else{
                        showSoldIMEI(res.data);
                    }
                }
            });
        }

        function showSoldIMEI(invo){
            var modalInstance = $uibModal.open({
                templateUrl: 'soldInvoices.html',
                backdrop: 'static',
                keyboard: false,
                controller: function soldInvoicesController($scope, $uibModalInstance){
                    $scope.invoices = invo;
                    $scope.close = function() {
                        $uibModalInstance.close();
                    };
                }
            });
        }

        $scope.editInvoice = function(invoice){
            // $state.go('invoice.editInvoice',{obj: invoice,menu2: 'purchase'},{reload: true});
        }

        $scope.viewInvoice = function(invoice){
            $state.go('invoice.viewTransfer',{obj: invoice,menu2: 'stockTransfer'},{reload: true});
        }
    }
}());