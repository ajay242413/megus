(function() {
    'use strict';
    angular.module('app').controller('ViewTransfer.IndexController', viewTransferController);

    function viewTransferController(InventoryService, SettingService, ExcelService, $state, $scope, $stateParams) {

        if($stateParams.obj == null){
            $state.go('invoice.stockTransfer',null,{reload: true});
        } else{
            InventoryService.readInventoryById({id: $stateParams.obj._id}).then(function(res){
                if(res.data){
                    $scope.invoiceData = res.data;
                    set();
                }
            });
        }

        function set(){
            $scope.data = angular.copy($scope.invoiceData);
            $scope.spName = ["Stock Point","Serial Number"];

            SettingService.readSetting().then(function(res) {
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName[0] = res.data[0].format.stockPoint;
                        }
                        if(res.data[0].format.serial){
                            $scope.spName[1] = res.data[0].format.serial;
                        }
                    }
                }
            });
        }

        $scope.back = function(){
            $state.go('invoice.stockTransfer',null,{reload: true});
        }

        $scope.excelAlert = function(){
            swal({
                title: "Choose Item Mode",
                // text: "Your will not be able to recover this purchase bill!",
                type: "info",
                animation: true,
                confirmButtonText: "NO " + $scope.spName[1],
                confirmButtonColor: '#7AC29A',
                showCancelButton: true,
                cancelButtonText: $scope.spName[1],
                cancelButtonColor: '#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    var Items = [];
                    for(var i = 0; i < $scope.data.item.length; i++) {
                        Items.push({
                            Invoice_Date: $scope.data.invoiceDate,
                            Invoice_Number: $scope.data.invoiceNumber,
                            Item_Name: $scope.data.item[i].name.itemName, 
                            Rate: $scope.data.item[i].cost,
                            Qty: $scope.data.item[i].quantity, 
                            Total: $scope.data.item[i].total
                        });
                        Items[Items.length - 1][$scope.spName[0] + '_From'] = $scope.data.source.name;
                        Items[Items.length - 1][$scope.spName[0] + '_To'] = $scope.data.salePoint.name;
                    }
                    Items.push({ 
                        Qty: 'Net_Value', 
                        Total: $scope.data.netValue
                    });
                    ExcelService.exportXLSX('Items',$scope.data.invoiceNumber,Items);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    var Items = [];
                    for(var i = 0; i < $scope.data.item.length; i++){
                        if($scope.data.item[i].IMEINumber){
                            for(var j = 0; j < $scope.data.item[i].IMEINumber.length; j++){
                                Items.push({
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Item_Name: $scope.data.item[i].name.itemName, 
                                    Rate: $scope.data.item[i].cost, 
                                    Qty: 1,
                                    Total: $scope.data.item[i].cost
                                });
                                Items[Items.length - 1][$scope.spName[1]] = $scope.data.item[i].IMEINumber[j].IMEI.join(' / ');
                                Items[Items.length - 1][$scope.spName[0] + '_From'] = $scope.data.source.name;
                                Items[Items.length - 1][$scope.spName[0] + '_To'] = $scope.data.salePoint.name;
                            }
                        }else{
                            Items.push({
                                Invoice_Date: $scope.data.invoiceDate,
                                Invoice_Number: $scope.data.invoiceNumber,
                                Item_Name: $scope.data.item[i].name.itemName, 
                                Rate: $scope.data.item[i].cost,
                                Qty: $scope.data.item[i].quantity, 
                                Total: $scope.data.item[i].total
                            });
                            Items[Items.length - 1][$scope.spName[0] + '_From'] = $scope.data.source.name;
                            Items[Items.length - 1][$scope.spName[0] + '_To'] = $scope.data.salePoint.name;
                        }
                    }
                    Items.push({ 
                        Qty: 'Net_value', 
                        Total: $scope.data.netValue
                    });
                    ExcelService.exportXLSX('Items',$scope.data.invoiceNumber,Items);
                }
            })
        }
    }
}());