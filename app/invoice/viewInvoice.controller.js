(function() {
    'use strict';
    angular.module('app').controller('ViewInvoice.IndexController', viewInvoiceController);

    function viewInvoiceController(InventoryService, SettingService, ExcelService, $state, $scope, $stateParams) {

        if($stateParams.obj == null){
            $state.go('invoice.purchase',null,{reload: true});
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
            $scope.grossAmount = angular.copy($scope.data.netValue);
            $scope.adjusAmount = 0;
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
            
            if($stateParams.menu2 ==  'sales'){
                $scope.partyName = "Client";
                // $scope.showPurchase = true;
            } else{
                $scope.partyName = "Supplier";
                // $scope.showPurchase = false;
            }
            
            if($scope.data.item[0].sgst){
                $scope.showSCGST = true;
                $scope.showIGST = false;
            } else{
                $scope.showIGST = true;
                $scope.showSCGST = false;
            }
        }

        $scope.back = function(){
            if($stateParams.menu2 ==  'purchase'){
                $state.go('invoice.purchase',null,{reload: true});
            } else if($stateParams.menu2 ==  'sales'){
                $state.go('invoice.sales',null,{reload: true});
            } else{
                $state.go('invoice.purchaseDc',null,{reload: true});
            }
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
                    var purItems = [];
                    if($scope.data.item[0].sgst){
                        if($stateParams.menu2 ==  'purchase'){
                            for(var i = 0; i < $scope.data.item.length; i++) {
                                purItems.push({
                                    Supplier: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Purchase_Bill_No: $scope.data.billno,
                                    Purchase_Date: $scope.data.billDate,
                                    Item_Name: $scope.data.item[i].name.itemName, 
                                    Qty: $scope.data.item[i].quantity, 
                                    Rate: $scope.data.item[i].cost, 
                                    SGST: $scope.data.item[i].sgst, 
                                    CGST: $scope.data.item[i].cgst, 
                                    Net_Value: $scope.data.item[i].total
                                });
                            }
                        }else{
                            for(var i = 0; i < $scope.data.item.length; i++) {
                                purItems.push({
                                    Party_Name: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Reference_Bill_No: $scope.data.billno,
                                    Reference_Date: $scope.data.billDate,
                                    Item_Name: $scope.data.item[i].name.itemName, 
                                    Qty: $scope.data.item[i].quantity, 
                                    Rate: $scope.data.item[i].cost, 
                                    SGST: $scope.data.item[i].sgst, 
                                    CGST: $scope.data.item[i].cgst, 
                                    Net_Value: $scope.data.item[i].total
                                });
                            }   
                        }
                        purItems.push({ 
                            CGST: ''
                        });
                        purItems.push({ 
                            CGST: 'Total', 
                            Net_Value: $scope.data.netValue
                        });
                    }else{
                        if($stateParams.menu2 ==  'purchase'){
                            for(var i = 0; i < $scope.data.item.length; i++) {
                                purItems.push({
                                    Supplier: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Purchase_Bill_No: $scope.data.billno,
                                    Purchase_Date: $scope.data.billDate,
                                    Item_Name: $scope.data.item[i].name.itemName, 
                                    Qty: $scope.data.item[i].quantity, 
                                    Rate: $scope.data.item[i].cost, 
                                    IGST: $scope.data.item[i].igst, 
                                    Net_Value: $scope.data.item[i].total
                                });
                            }
                        } else{
                            for(var i = 0; i < $scope.data.item.length; i++) {
                                purItems.push({
                                    Party_Name: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Reference_Bill_No: $scope.data.billno,
                                    Reference_Date: $scope.data.billDate,
                                    Item_Name: $scope.data.item[i].name.itemName, 
                                    Qty: $scope.data.item[i].quantity, 
                                    Rate: $scope.data.item[i].cost, 
                                    IGST: $scope.data.item[i].igst, 
                                    Net_Value: $scope.data.item[i].total
                                });
                            }
                        }
                        purItems.push({ 
                            IGST: ''
                        });
                        purItems.push({ 
                            IGST: 'Total', 
                            Net_Value: $scope.data.netValue
                        });
                    }
                    ExcelService.exportXLSX('Items',$scope.data.invoiceNumber,purItems);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    var purItems = [];
                    if($scope.data.item[0].sgst){
                        if($stateParams.menu2 ==  'purchase'){
                            for(var i = 0; i < $scope.data.item.length; i++){
                                if($scope.data.item[i].IMEINumber){
                                    var total = (2 * (((1 * $scope.data.item[i].cost) * $scope.data.item[i].sgst)) / 100) + ($scope.data.item[i].quantity * $scope.data.item[i].cost);
                                    for(var j = 0; j < $scope.data.item[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Supplier: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Purchase_Bill_No: $scope.data.billno,
                                            Purchase_Date: $scope.data.billDate,
                                            Item_Name: $scope.data.item[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.data.item[i].cost, 
                                            SGST: $scope.data.item[i].sgst, 
                                            CGST: $scope.data.item[i].cgst,
                                            Net_Value: total
                                            // IMEI: $scope.data.item[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] = $scope.data.item[i].IMEINumber[j].IMEI.join(' / ');
                                    }
                                }else{
                                    purItems.push({
                                        Supplier: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Purchase_Bill_No: $scope.data.billno,
                                        Purchase_Date: $scope.data.billDate,
                                        Item_Name: $scope.data.item[i].name.itemName, 
                                        Qty: $scope.data.item[i].quantity, 
                                        Rate: $scope.data.item[i].cost, 
                                        SGST: $scope.data.item[i].sgst, 
                                        CGST: $scope.data.item[i].cgst,
                                        Net_Value: $scope.data.item[i].total
                                    });
                                }
                            }
                        } else{
                            for(var i = 0; i < $scope.data.item.length; i++){
                                if($scope.data.item[i].IMEINumber){
                                    var total = (2 * (((1 * $scope.data.item[i].cost) * $scope.data.item[i].sgst)) / 100) + ($scope.data.item[i].quantity * $scope.data.item[i].cost);
                                    for(var j = 0; j < $scope.data.item[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Party_Name: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Reference_Bill_No: $scope.data.billno,
                                            Reference_Date: $scope.data.billDate,
                                            Item_Name: $scope.data.item[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.data.item[i].cost, 
                                            SGST: $scope.data.item[i].sgst, 
                                            CGST: $scope.data.item[i].cgst,
                                            Net_Value: total
                                            // IMEI: $scope.data.item[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] = $scope.data.item[i].IMEINumber[j].IMEI.join(' / ');
                                    }
                                }else{
                                    purItems.push({
                                        Party_Name: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Item_Name: $scope.data.item[i].name.itemName,
                                        Reference_Bill_No: $scope.data.billno,
                                        Reference_Date: $scope.data.billDate,
                                        Qty: $scope.data.item[i].quantity, 
                                        Rate: $scope.data.item[i].cost, 
                                        SGST: $scope.data.item[i].sgst, 
                                        CGST: $scope.data.item[i].cgst,
                                        Net_Value: $scope.data.item[i].total
                                    });
                                }
                            }
                        }
                        purItems.push({ 
                            CGST: ''
                        });
                        purItems.push({ 
                            CGST: 'Total', 
                            Net_Value: $scope.data.netValue
                        });
                    }else{
                        if($stateParams.menu2 ==  'purchase'){
                            for(var i = 0; i < $scope.data.item.length; i++){
                                if($scope.data.item[i].IMEINumber){
                                    var total = ((($scope.data.item[i].quantity * $scope.data.item[i].cost) * $scope.data.item[i].igst) / 100) + ($scope.data.item[i].quantity * $scope.data.item[i].cost);
                                    for(var j = 0; j < $scope.data.item[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Supplier: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Purchase_Bill_No: $scope.data.billno,
                                            Purchase_Date: $scope.data.billDate,
                                            Item_Name: $scope.data.item[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.data.item[i].cost,  
                                            IGST: $scope.data.item[i].igst,
                                            Net_Value: total
                                            // IMEI: $scope.data.item[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] = $scope.data.item[i].IMEINumber[j].IMEI.join(' / ');
                                    }
                                }else{
                                    purItems.push({
                                        Supplier: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Purchase_Bill_No: $scope.data.billno,
                                        Purchase_Date: $scope.data.billDate,
                                        Item_Name: $scope.data.item[i].name.itemName, 
                                        Qty: $scope.data.item[i].quantity, 
                                        Rate: $scope.data.item[i].cost, 
                                        IGST: $scope.data.item[i].igst, 
                                        Net_Value: $scope.data.item[i].total
                                    });
                                }
                            }
                        } else{
                            for(var i = 0; i < $scope.data.item.length; i++){
                                if($scope.data.item[i].IMEINumber){
                                    var total = ((($scope.data.item[i].quantity * $scope.data.item[i].cost) * $scope.data.item[i].igst) / 100) + ($scope.data.item[i].quantity * $scope.data.item[i].cost);
                                    for(var j = 0; j < $scope.data.item[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Party_Name: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Reference_Bill_No: $scope.data.billno,
                                            Reference_Date: $scope.data.billDate,
                                            Item_Name: $scope.data.item[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.data.item[i].cost, 
                                            IGST: $scope.data.item[i].igst, 
                                            Net_Value: total
                                            // IMEI: $scope.data.item[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] = $scope.data.item[i].IMEINumber[j].IMEI.join(' / ');  
                                    }
                                }else{
                                    purItems.push({
                                        Party_Name: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Reference_Bill_No: $scope.data.billno,
                                        Reference_Date: $scope.data.billDate,
                                        Item_Name: $scope.data.item[i].name.itemName, 
                                        Qty: $scope.data.item[i].quantity, 
                                        Rate: $scope.data.item[i].cost, 
                                        IGST: $scope.data.item[i].igst, 
                                        Net_Value: $scope.data.item[i].total
                                    });
                                }
                            }
                        }
                        purItems.push({ 
                            IGST: ''
                        });
                        purItems.push({ 
                            IGST: 'Total', 
                            Net_Value: $scope.data.netValue
                        });
                    }
                    ExcelService.exportXLSX('Items',$scope.data.invoiceNumber,purItems);
                }
            })
        }
    }
}());