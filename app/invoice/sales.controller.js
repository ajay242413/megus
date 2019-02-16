(function() {
    'use strict';
    angular.module('app').controller('Sales.IndexController', salesController);

    function salesController(SettingService, InventoryService, UserService, VouchersService, $state, $scope, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        $scope.user = $scope.rootUser;
        $scope.showaction = false;
        $scope.spName = "Stock Point";
        vm.dtInstance = {};
        vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(10).notSortable().withClass('all')];
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 150, 200]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

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

        	InventoryService.readInventory({'type': 's'}).then(function(res){
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

        $scope.addNewSales = function(){
            if($scope.user.userType == 'b'){
                $state.go('invoice.addSales',null,{reload: true});
            } else{
                $state.go('invoice.rdsSales',null,{reload: true});
            }
        }

        $scope.saleBill = function(){
            $state.go('invoice.importSalesBill',null,{reload: true});
        }

        $scope.deleteAlert = function(invo){
            swal({
                title:"Are you sure ?", text:"You will not be able to recover this sale bill !", type:"warning", confirmButtonText:"Yes, delete it !", confirmButtonColor:'#7AC29A', showCancelButton:true, cancelButtonText:"Cancel", cancelButtonColor:'#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    deleteInvoice(invo);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    swal("Sale bill not deleted !");
                }
            })
        }
        
        function deleteInvoice(invoice){
            swal({title:"Deleting", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
            InventoryService.readInventoryById({id: invoice._id}).then(function(res){
                if(res.data){
                    var invoi = res.data;
                    if($scope.user.userType == 'd'){
                        UserService.getDealerAuthorID({refId: invoice.party._id}).then(function(res) {
                            invoi.dealerUserID = res.data;
                            InventoryService.removeRDSsaleInvoice(invoi).then(function(res){
                                if(res.data){
                                    swal.close();
                                    if(res.data.status == 'Deleted'){
                                        loadDefault();
                                        swal("Sale bill is deleted","You will not be able to recover this sale bill !");
                                    } else{
                                        swal("Sale bill is not deleted","Some imei are activated");
                                    }
                                }
                            });
                        });
                    } else{
                        if(invoi.ack){
                            swal.close();
                            swal("Sale bill not deleted","This bill was acknowledged");
                        } else{
                            VouchersService.readRJinvoice({id:invoice._id, debit:1}).then(function(res){
                                swal.close();
                                if(res.data.length){
                                    showSoldIMEI([],res.data);
                                } else{
                                    InventoryService.removeBrandSaleInvoice(invoi).then(function(res){
                                        if(res.data){
                                            swal.close();
                                            loadDefault();
                                            swal("Sale bill is deleted","You will not be able to recover this sale bill !");
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }

        $scope.editInvoice = function(invoice){
            swal({title:"Checking Reference Journal", showCancelButton:false, showConfirmButton:false, imageUrl:'../images/200px/spinner.gif'});
            VouchersService.readRJinvoice({id:invoice._id, debit:1}).then(function(res){
                swal.close();
                if(res.data.length){
                    showSoldIMEI([],res.data);
                } else{
                    $state.go('invoice.editInvoice',{obj: invoice,menu2: 'sales'},{reload: true});
                }
            });
        }

        $scope.viewInvoice = function(invoice){
            $state.go('invoice.viewInvoice',{obj: invoice,menu2: 'sales'},{reload: true});
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
    }
}());