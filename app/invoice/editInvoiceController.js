(function() {
    'use strict';
    angular.module('app').controller('EditInvoice.IndexController', editInvoiceController);

    function editInvoiceController(SettingService, InventoryService, ExcelService, $state, $scope, $stateParams) {

        if($stateParams.obj == null){
            $state.go('invoice.sales',null,{reload: true});
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
            $scope.items = angular.copy($scope.data.item);
            $scope.grossAmount = parseFloat($scope.data.netValue);
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
            } else{
                $scope.partyName = "Supplier";
            }

            if($scope.data.rndOFF){
                $scope.data.rndOFF = parseFloat($scope.data.rndOFF);
            }
            
            if($scope.items[0].sgst){
                $scope.showSCGST = true;
                $scope.showIGST = false;
            } else{
                $scope.showIGST = true;
                $scope.showSCGST = false;
            }
            assignItem();
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

        function assignItem(){
            $scope.grossAmount = 0;
            for(var i=0; i<$scope.items.length; i++){
                if($scope.items[i].igst){
                    $scope.items[i].irate = (parseFloat($scope.items[i].quantity) * (parseFloat($scope.items[i].cost * $scope.items[i].igst) / 100)).toFixed(2);
                } else{
                    $scope.items[i].srate = (parseFloat($scope.items[i].quantity) * (parseFloat($scope.items[i].cost * $scope.items[i].sgst) / 100)).toFixed(2);
                }
                $scope.grossAmount = (parseFloat($scope.grossAmount) + parseFloat($scope.items[i].total)).toFixed(2);
            }
        }

        $scope.valueChange = function(index){
            var changed = false;
            if($scope.showSCGST){
                changed = true;
                if(($scope.items[index].cost == null)){
                    $scope.items[index].cost = 0;
                }
                if(($scope.items[index].sgst == 0) || ($scope.items[index].sgst == null)){
                    $scope.items[index].sgst = 0;
                }
                $scope.items[index].total = (2 * ((($scope.items[index].quantity * $scope.items[index].cost) * $scope.items[index].sgst)) / 100) + ($scope.items[index].quantity * $scope.items[index].cost).toFixed(2);
                $scope.items[index].srate = ($scope.items[index].quantity * (parseFloat($scope.items[index].cost * $scope.items[index].sgst) / 100)).toFixed(2);
                $scope.items[index].crate = $scope.items[index].srate;
                $scope.items[index].cgst = $scope.items[index].sgst;
               
            } else{
                changed = true;
                if(($scope.items[index].cost == null)){
                    $scope.items[index].cost = 0;
                }
                if(($scope.items[index].igst == 0) || (!$scope.items[index].igst == null)){
                    $scope.items[index].igst = 0;
                }
                $scope.items[index].total = ((($scope.items[index].quantity * $scope.items[index].cost) * $scope.items[index].igst) / 100) + ($scope.items[index].quantity * $scope.items[index].cost).toFixed(2);
                $scope.items[index].irate = ($scope.items[index].quantity * (parseFloat($scope.items[index].cost * $scope.items[index].igst) / 100)).toFixed(2);
            }
            if(changed){
                $scope.items[index].total = ($scope.items[index].total).toFixed(2);
                $scope.grossAmount = 0;
                $scope.data.netValue = 0;
                $scope.data.grossValue = 0;
                if($scope.showSCGST){
                    $scope.data.SGST = 0;
                    for(var i = 0; i < $scope.items.length; i++){
                        $scope.data.grossValue = parseFloat($scope.data.grossValue) + parseFloat($scope.items[i].quantity) * parseFloat($scope.items[i].cost).toFixed(2);
                        $scope.grossAmount = (parseFloat($scope.items[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.data.netValue = $scope.grossAmount;
                        $scope.data.SGST = (parseFloat($scope.data.SGST) + parseFloat($scope.items[i].srate)).toFixed(2);
                    }
                    $scope.data.CGST = $scope.data.SGST;
                } else{
                    $scope.data.IGST = 0;
                    for(var i = 0; i < $scope.items.length; i++){
                        $scope.data.grossValue = parseFloat($scope.data.grossValue) + parseFloat($scope.items[i].quantity) * parseFloat($scope.items[i].cost).toFixed(2);
                        $scope.grossAmount = (parseFloat($scope.items[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.data.IGST = (parseFloat($scope.data.IGST) + parseFloat($scope.items[i].irate)).toFixed(2);
                        $scope.data.netValue = $scope.grossAmount;
                    }
                }
                $scope.data.netValue = $scope.data.netValue + $scope.adjusAmount;
                $scope.data.netValue = parseFloat($scope.data.netValue).toFixed(2);
            }
            if($scope.data.netValue == $scope.invoiceData.netValue){
                $scope.data.rndOFF = $scope.invoiceData.rndOFF;
            }
        }

        $scope.adjusTotal = function(){
            if($scope.data.rndOFF){
                if(($scope.data.rndOFF < 1) && ($scope.data.rndOFF > -1)){
                    $scope.data.netValue = (parseFloat($scope.grossAmount) + parseFloat($scope.data.rndOFF)).toFixed(2);
                } else{
                    swal("","Value must be less than 1 and greater than -1");
                    $scope.data.rndOFF = 0;
                }
            } else{
                $scope.data.netValue = $scope.grossAmount;
                if($scope.data.netValue == $scope.invoiceData.netValue){
                    if($scope.invoiceData.rndOFF){
                        $scope.data.netValue = parseFloat($scope.data.netValue) - parseFloat($scope.invoiceData.rndOFF);
                    }
                }
            }
        }

        $scope.updateInvoice = function(){
            var check = 0;
            for(var i = 0; i < $scope.items.length; i++) {
                if(($scope.items[i].total == null) || ($scope.items[i].total <= 0)){
                    check = 1;
                }
            }
            if(check == 0){
                swal({
                    title: "Updating",
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    imageUrl: '../images/200px/spinner.gif'
                });
                $scope.data.item = $scope.items;
                if($scope.showSCGST){
                    $scope.data.oldValue = {netValue:$scope.invoiceData.netValue, grossValue:$scope.invoiceData.grossValue, SGST:$scope.invoiceData.SGST};
                } else{
                    $scope.data.oldValue = {netValue:$scope.invoiceData.netValue, grossValue:$scope.invoiceData.grossValue, IGST:$scope.invoiceData.IGST};
                }
                InventoryService.updateInvoice($scope.data).then(function(res) {
                    swal.close();
                    $scope.back();
                });
            } else{
                swal('','Value Missed');
            }
        }

        $scope.excelAlert = function(){
            swal({
                title: "Choose Item Mode",
                // text: "Your will not be able to recover this purchase bill!",
                type: "info",
                animation: true,
                confirmButtonText: "No " + $scope.spName[1],
                confirmButtonColor: '#7AC29A',
                showCancelButton: true,
                cancelButtonText: $scope.spName[1],
                cancelButtonColor: '#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    var purItems = [];
                    if($scope.items[0].sgst){
                        if($stateParams.menu2 ==  'purchase'){
                            for(var i = 0; i < $scope.items.length; i++) {
                                purItems.push({
                                    Supplier: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Purchase_Bill_No: $scope.data.billno,
                                    Purchase_Date: $scope.data.billDate,
                                    Item_Name: $scope.items[i].name.itemName, 
                                    Qty: $scope.items[i].quantity, 
                                    Rate: $scope.items[i].cost, 
                                    SGST: $scope.items[i].sgst, 
                                    CGST: $scope.items[i].cgst, 
                                    Net_Value: $scope.items[i].total
                                });
                            }
                        }else{
                            for(var i = 0; i < $scope.items.length; i++) {
                                purItems.push({
                                    Party_Name: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Reference_Bill_No: $scope.data.billno,
                                    Reference_Date: $scope.data.billDate,
                                    Item_Name: $scope.items[i].name.itemName, 
                                    Qty: $scope.items[i].quantity, 
                                    Rate: $scope.items[i].cost, 
                                    SGST: $scope.items[i].sgst, 
                                    CGST: $scope.items[i].cgst, 
                                    Net_Value: $scope.items[i].total
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
                            for(var i = 0; i < $scope.items.length; i++) {
                                purItems.push({
                                    Supplier: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Purchase_Bill_No: $scope.data.billno,
                                    Purchase_Date: $scope.data.billDate,
                                    Item_Name: $scope.items[i].name.itemName, 
                                    Qty: $scope.items[i].quantity, 
                                    Rate: $scope.items[i].cost, 
                                    IGST: $scope.items[i].igst, 
                                    Net_Value: $scope.items[i].total
                                });
                            }
                        } else{
                            for(var i = 0; i < $scope.items.length; i++) {
                                purItems.push({
                                    Party_Name: $scope.data.party.name,
                                    Invoice_Date: $scope.data.invoiceDate,
                                    Invoice_Number: $scope.data.invoiceNumber,
                                    Reference_Bill_No: $scope.data.billno,
                                    Reference_Date: $scope.data.billDate,
                                    Item_Name: $scope.items[i].name.itemName, 
                                    Qty: $scope.items[i].quantity, 
                                    Rate: $scope.items[i].cost, 
                                    IGST: $scope.items[i].igst, 
                                    Net_Value: $scope.items[i].total
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
                    if($scope.items[0].sgst){
                        if($stateParams.menu2 ==  'purchase'){
                            for(var i = 0; i < $scope.items.length; i++){
                                if($scope.items[i].IMEINumber){
                                    var total = (2 * (((1 * $scope.items[i].cost) * $scope.items[i].sgst)) / 100) + ($scope.items[i].quantity * $scope.items[i].cost);
                                    for(var j = 0; j < $scope.items[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Supplier: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Purchase_Bill_No: $scope.data.billno,
                                            Purchase_Date: $scope.data.billDate,
                                            Item_Name: $scope.items[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.items[i].cost, 
                                            SGST: $scope.items[i].sgst, 
                                            CGST: $scope.items[i].cgst,
                                            Net_Value: total
                                            // IMEI: $scope.items[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] =   $scope.items[i].IMEINumber[j].IMEI.join(' / ');
                                    }
                                }else{
                                    purItems.push({
                                        Supplier: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Purchase_Bill_No: $scope.data.billno,
                                        Purchase_Date: $scope.data.billDate,
                                        Item_Name: $scope.items[i].name.itemName, 
                                        Qty: $scope.items[i].quantity, 
                                        Rate: $scope.items[i].cost, 
                                        SGST: $scope.items[i].sgst, 
                                        CGST: $scope.items[i].cgst,
                                        Net_Value: $scope.items[i].total
                                    });
                                }
                            }
                        } else{
                            for(var i = 0; i < $scope.items.length; i++){
                                if($scope.items[i].IMEINumber){
                                    var total = (2 * (((1 * $scope.items[i].cost) * $scope.items[i].sgst)) / 100) + ($scope.items[i].quantity * $scope.items[i].cost);
                                    for(var j = 0; j < $scope.items[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Party_Name: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Reference_Bill_No: $scope.data.billno,
                                            Reference_Date: $scope.data.billDate,
                                            Item_Name: $scope.items[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.items[i].cost, 
                                            SGST: $scope.items[i].sgst, 
                                            CGST: $scope.items[i].cgst,
                                            Net_Value: total
                                            // IMEI: $scope.items[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] =   $scope.items[i].IMEINumber[j].IMEI.join(' / ');
                                    }
                                }else{
                                    purItems.push({
                                        Party_Name: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Reference_Bill_No: $scope.data.billno,
                                        Reference_Date: $scope.data.billDate,
                                        Item_Name: $scope.items[i].name.itemName, 
                                        Qty: $scope.items[i].quantity, 
                                        Rate: $scope.items[i].cost, 
                                        SGST: $scope.items[i].sgst, 
                                        CGST: $scope.items[i].cgst,
                                        Net_Value: $scope.items[i].total
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
                            for(var i = 0; i < $scope.items.length; i++){
                                if($scope.items[i].IMEINumber){
                                    var total = ((($scope.items[i].quantity * $scope.items[i].cost) * $scope.items[i].igst) / 100) + ($scope.items[i].quantity * $scope.items[i].cost);
                                    for(var j = 0; j < $scope.items[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Supplier: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Purchase_Bill_No: $scope.data.billno,
                                            Purchase_Date: $scope.data.billDate,
                                            Item_Name: $scope.items[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.items[i].cost,  
                                            IGST: $scope.items[i].igst,
                                            Net_Value: total
                                            // IMEI: $scope.items[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] =   $scope.items[i].IMEINumber[j].IMEI.join(' / ');
                                    }
                                }else{
                                    purItems.push({
                                        Supplier: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Purchase_Bill_No: $scope.data.billno,
                                        Purchase_Date: $scope.data.billDate,
                                        Item_Name: $scope.items[i].name.itemName, 
                                        Qty: $scope.items[i].quantity, 
                                        Rate: $scope.items[i].cost, 
                                        IGST: $scope.items[i].igst, 
                                        Net_Value: $scope.items[i].total
                                    });
                                }
                            }
                        } else{
                            for(var i = 0; i < $scope.items.length; i++){
                                if($scope.items[i].IMEINumber){
                                    var total = ((($scope.items[i].quantity * $scope.items[i].cost) * $scope.items[i].igst) / 100) + ($scope.items[i].quantity * $scope.items[i].cost);
                                    for(var j = 0; j < $scope.items[i].IMEINumber.length; j++){
                                        purItems.push({
                                            Party_Name: $scope.data.party.name,
                                            Invoice_Date: $scope.data.invoiceDate,
                                            Invoice_Number: $scope.data.invoiceNumber,
                                            Reference_Bill_No: $scope.data.billno,
                                            Reference_Date: $scope.data.billDate,
                                            Item_Name: $scope.items[i].name.itemName, 
                                            Qty: 1, 
                                            Rate: $scope.items[i].cost, 
                                            IGST: $scope.items[i].igst, 
                                            Net_Value: total
                                            // IMEI: $scope.items[i].IMEINumber[j].IMEI.join(' / ')
                                        });
                                        purItems[purItems.length - 1][$scope.spName[1]] =   $scope.items[i].IMEINumber[j].IMEI.join(' / ');   
                                    }
                                }else{
                                    purItems.push({
                                        Party_Name: $scope.data.party.name,
                                        Invoice_Date: $scope.data.invoiceDate,
                                        Invoice_Number: $scope.data.invoiceNumber,
                                        Reference_Bill_No: $scope.data.billno,
                                        Reference_Date: $scope.data.billDate,
                                        Item_Name: $scope.items[i].name.itemName, 
                                        Qty: $scope.items[i].quantity, 
                                        Rate: $scope.items[i].cost, 
                                        IGST: $scope.items[i].igst, 
                                        Net_Value: $scope.items[i].total
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