(function() {
    'use strict';
    angular.module('app').controller('AckPurchase.IndexController', ackPurchaseController);

    function ackPurchaseController(MasterService, InventoryService, SettingService, ExcelService, CustomService, $state, $scope, $filter, $stateParams) {

        var vm = this, getActiveObj={"active": true};
        $scope.spName = ["Stock Point", "Serial Number"];
        var check = 0;
        $scope.errormsg = "";
        if(!$stateParams.obj){
            $state.go('invoice.purchaseAcknowledgement',null,{reload: true});
        } else{
            InventoryService.readInventoryById({id: $stateParams.obj._id}).then(function(res){
                if(res.data){
                    $scope.purchaseItems = res.data;
                    loadDefault();
                }
            });
        }

        function loadDefault(){
            $scope.purchase = {};
            $scope.purchase.item = [];
            initController();
        }

        function initController(){
            MasterService.readSalePoint(getActiveObj).then(function(res){
                $scope.salePoints = res.data;
                if($scope.salePoints.length == 0){
                    $scope.errormsg = $scope.errormsg + "Add " + $scope.spName[0] + " In Master General Page.\n"
                }
                angular.element(document).ready(function() {
                    $('.selectpicker').selectpicker("refresh");
                });
            });

            MasterService.readSupplier(getActiveObj).then(function(res){
                $scope.suppliers = res.data;
                check = check + 1;
                if(check == 3){
                    assignValues();
                }
            });


            MasterService.readProductItem(getActiveObj).then(function(res){
                $scope.productItems = res.data;
                assignItem();
            });

            MasterService.readFinancialYear(getActiveObj).then(function(res) {
                $scope.finYears = res.data;
                var finInd = $scope.finYears.findIndex(x => x.status === true);
                if(($scope.finYears.length == 0) || (finInd > 0)){
                    $scope.errormsg = $scope.errormsg + "Add Financial Year In Master Accounts Page.\n";
                } else{
                    check = check + 1;
                    if(check == 3){
                        assignValues();
                    }
                    $scope.purchase.finYear = $scope.finYears[$scope.finYears.findIndex(x => x.status == true)]._id;
                }
                loadLedger();
            });

            function loadLedger(){
                MasterService.readLedgerGroup(getActiveObj).then(function(res) {
                    $scope.ledger = CustomService.getObject(res.data, "name", "Sundry Creditors");
                    if(!$scope.ledger){
                        $scope.errormsg = $scope.errormsg + "Ledger Group('sundry creditors') not found !!!"
                        warningmsg();
                    } else {
                        check = check + 1;
                        if(check == 3){
                            assignValues();
                        }
                    }
                    genetrateNumber();
                });
            }

            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName[0] = res.data[0].format.stockPoint;
                        }
                        if(res.data[0].format.serial){
                            $scope.spName[1] = res.data[0].format.serial;
                        }
                    }
                    if(res.data[0].default){
                        if(res.data[0].default.stockPoint){
                            var spInd = $scope.salePoints.findIndex(x => x._id == res.data[0].default.stockPoint);
                            if(spInd >= 0){
                                $scope.purchase.salePoint = res.data[0].default.stockPoint;
                            }
                        }
                    }
                }
                angular.element(document).ready(function(){
                    $('.selectpicker').selectpicker("refresh");
                });
            });

            InventoryService.readInventoryCode().then(function(res){
                if(res.data){
                    $scope.purchase.code = res.data.code;
                }
            });
        }

        function genetrateNumber(){
            $scope.purchase.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            InventoryService.readPurchaseInvoice().then(function(res){
                if(res.data.purchase){
                    if(res.data.purchase === 'empty'){
                        $scope.errormsg = $scope.errormsg + 'Enter purchase bill format in setting page.';
                    } else{
                        $scope.purchase.invoiceNumber = res.data.purchase;
                    }
                    if($scope.errormsg != ""){
                        sweetAlertWarning('DATA NOT FOUND',$scope.errormsg);
                    }
                }
            });
        }

        function assignValues(){
            var supIndex = $scope.suppliers.findIndex(x => x.code == 200001);
            if(supIndex >= 0){
                $scope.purchase.party = $scope.suppliers[supIndex]._id;
                $scope.supplierName = $scope.suppliers[supIndex].name;
            }else{
                SettingService.readBrandCompanyProfile().then(function(res){
                    if(res.data){
                        $scope.brandComInfo = res.data[0].company;
                        $scope.supplier = {};
                        $scope.supplier.name = $scope.brandComInfo.name;
                        $scope.supplierName = $scope.brandComInfo.name;
                        $scope.supplier.code = 200001;
                        $scope.supplier.gstin = $scope.brandComInfo.gstin;
                        $scope.supplier.email = $scope.brandComInfo.email;
                        $scope.supplier.panID = $scope.brandComInfo.pan;
                        if($scope.brandComInfo.phone1){
                            $scope.supplier.mobNum = [$scope.brandComInfo.phone1];
                        }
                        if($scope.brandComInfo.phone2){
                            $scope.supplier.mobNum.push($scope.brandComInfo.phone1);
                        }
                        $scope.supplier.state = $scope.brandComInfo.state._id;
                        if($scope.finYears){
                            $scope.supplier.finYear = $scope.purchase.finYear;
                        }
                        if($scope.ledger){
                            $scope.supplier.ledger = $scope.ledger._id;
                        }
                        if($scope.supplier){
                            MasterService.saveSupplier($scope.supplier).then(function(res) {
                                $scope.purchase.party = res.data._id;
                            });
                        }
                    }
                });
            }
            $scope.purchase.billno = $scope.purchaseItems.invoiceNumber;
            $scope.purchase.billDate = $filter('date')($scope.purchaseItems.invoiceDate, "dd-MM-yyyy");
            $scope.purchase.ackID = $scope.purchaseItems._id;
            $scope.purchase.totalQuantity = $scope.purchaseItems.totalQuantity;
            $scope.purchase.netValue = $scope.purchaseItems.netValue;
            $scope.purchase.grossValue = $scope.purchaseItems.grossValue;
            $scope.purchase.category = [];
            $scope.purchase.paymentType = $scope.purchaseItems.paymentType;
            for(var i=0; i<$scope.purchaseItems.category.length; i++){
                $scope.purchase.category.push($scope.purchaseItems.category[i]._id);
            }
            if($scope.purchaseItems.item[0].igst){
                $scope.purchase.IGST = $scope.purchaseItems.IGST;
                $scope.showIGST = true;
                $scope.showSCGST = false;
            }else{
                $scope.purchase.SGST = $scope.purchaseItems.SGST;
                $scope.purchase.CGST = $scope.purchaseItems.CGST;
                $scope.showSCGST = true;
                $scope.showIGST = false;
            }
        }

        function assignItem(){
            for(var i=0; i<$scope.purchaseItems.item.length; i++){
                $scope.purchase.item[i] = angular.copy($scope.purchaseItems.item[i]);
                if($scope.purchaseItems.item[i].igst){
                    $scope.purchaseItems.item[i].irate = ($scope.purchaseItems.item[i].quantity * (parseFloat($scope.purchaseItems.item[i].cost * $scope.purchaseItems.item[i].igst) / 100));
                } else{
                    $scope.purchaseItems.item[i].srate = ($scope.purchaseItems.item[i].quantity * (parseFloat($scope.purchaseItems.item[i].cost * $scope.purchaseItems.item[i].sgst) / 100));
                }
                $scope.purchase.item[i].name = $scope.productItems[$scope.productItems.findIndex(x => x._id == $scope.purchaseItems.item[i].name._id)]._id;
                delete $scope.purchase.item[i]._id;
            }
        }

        function sweetAlertWarning(tle,err){
            swal({
                title: tle,
                text: err,
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok!',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }

        $scope.back = function(){
            $state.go('invoice.purchaseAcknowledgement',null,{reload: true});
        }
        
        $scope.save = function(){
            if($scope.errormsg != ""){
                sweetAlertWarning('DATA NOT FOUND',$scope.errormsg);
            } else {
                if($scope.purchase.party && $scope.purchase.salePoint){
                    swal({
                        title: "Save Purchase",
                        showCancelButton: false,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        imageUrl: '../images/200px/spinner.gif'
                    });
                    InventoryService.savePurchaseAck($scope.purchase).then(function(res) {
                        if(res.data){
                            swal.close();
                            $state.go('invoice.purchaseAcknowledgement',null,{reload: true});
                        }
                    });
                } else{
                    swal('','Loading Supplier or Select ' + $scope.spName[0]);
                }
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
                    if($scope.purchaseItems.item[0].sgst){
                        for(var i = 0; i < $scope.purchaseItems.item.length; i++){
                            purItems.push({
                                Supplier: $scope.supplierName,
                                Invoice_Date: $scope.purchase.invoiceDate,
                                Invoice_Number: $scope.purchase.invoiceNumber,
                                Purchase_Bill_No: $scope.purchaseItems.invoiceNumber,
                                Purchase_Date: $scope.purchaseItems.invoiceDate,
                                Item_Name: $scope.purchaseItems.item[i].name.itemName, 
                                Qty: $scope.purchaseItems.item[i].quantity, 
                                Rate: $scope.purchaseItems.item[i].cost, 
                                SGST: $scope.purchaseItems.item[i].sgst, 
                                CGST: $scope.purchaseItems.item[i].cgst,
                                Net_Value: $scope.purchaseItems.item[i].total
                            });
                        }
                        purItems.push({ 
                            CGST: ''
                        });
                        purItems.push({ 
                            CGST: 'Total', 
                            Net_Value: $scope.data.netValue
                        });
                    }else{
                        for(var i = 0; i < $scope.purchaseItems.item.length; i++){
                            purItems.push({
                                Supplier: $scope.supplierName,
                                Invoice_Date: $scope.purchase.invoiceDate,
                                Invoice_Number: $scope.purchase.invoiceNumber,
                                Purchase_Bill_No: $scope.purchaseItems.invoiceNumber,
                                Purchase_Date: $scope.purchaseItems.invoiceDate,
                                Item_Name: $scope.purchaseItems.item[i].name.itemName, 
                                Qty: $scope.purchaseItems.item[i].quantity, 
                                Rate: $scope.purchaseItems.item[i].cost, 
                                IGST: $scope.purchaseItems.item[i].igst, 
                                Net_Value: $scope.purchaseItems.item[i].total
                            });
                        }
                        purItems.push({ 
                            IGST: ''
                        });
                        purItems.push({ 
                            IGST: 'Total', 
                            Net_Value: $scope.purchase.netValue
                        });
                    }
                    ExcelService.exportXLSX('Items',$scope.purchase.invoiceNumber,purItems);
                }
            }).catch(function(isCancel){
                if(isCancel){
                    var purItems = [];
                    if($scope.purchaseItems.item[0].sgst){
                        for(var i = 0; i < $scope.purchaseItems.item.length; i++){
                            if($scope.purchaseItems.item[i].IMEINumber){
                                var total = (2 * (((1 * $scope.purchaseItems.item[i].cost) * $scope.purchaseItems.item[i].sgst)) / 100) + ($scope.purchaseItems.item[i].quantity * $scope.purchaseItems.item[i].cost);
                                for(var j = 0; j < $scope.purchaseItems.item[i].IMEINumber.length; j++){
                                    purItems.push({
                                        Supplier: $scope.supplierName,
                                        Invoice_Date: $scope.purchase.invoiceDate,
                                        Invoice_Number: $scope.purchase.invoiceNumber,
                                        Purchase_Bill_No: $scope.purchaseItems.invoiceNumber,
                                        Purchase_Date: $scope.purchaseItems.invoiceDate,
                                        Item_Name: $scope.purchaseItems.item[i].name.itemName, 
                                        Qty: 1, 
                                        Rate: $scope.purchaseItems.item[i].cost, 
                                        SGST: $scope.purchaseItems.item[i].sgst, 
                                        CGST: $scope.purchaseItems.item[i].cgst,
                                        Net_Value: total
                                        // IMEI: $scope.purchaseItems.item[i].IMEINumber[j].IMEI.join(' / ')
                                    });
                                    purItems[purItems.length - 1][$scope.spName[1]] = $scope.purchaseItems.item[i].IMEINumber[j].IMEI.join(' / ');
                                }
                            }else{
                                purItems.push({
                                    Supplier: $scope.supplierName,
                                    Invoice_Date: $scope.purchase.invoiceDate,
                                    Invoice_Number: $scope.purchase.invoiceNumber,
                                    Purchase_Bill_No: $scope.purchaseItems.invoiceNumber,
                                    Purchase_Date: $scope.purchaseItems.invoiceDate,
                                    Item_Name: $scope.purchaseItems.item[i].name.itemName, 
                                    Qty: $scope.purchaseItems.item[i].quantity, 
                                    Rate: $scope.purchaseItems.item[i].cost, 
                                    SGST: $scope.purchaseItems.item[i].sgst, 
                                    CGST: $scope.purchaseItems.item[i].cgst,
                                    Net_Value: $scope.purchaseItems.item[i].total
                                });
                            }
                            purItems.push({ 
                                CGST: ''
                            });
                            purItems.push({ 
                                CGST: 'Total', 
                                Net_Value: $scope.purchase.netValue
                            });
                        }
                    }else{
                        for(var i = 0; i < $scope.purchaseItems.item.length; i++){
                            if($scope.purchaseItems.item[i].IMEINumber){
                                var total = ((($scope.purchaseItems.item[i].quantity * $scope.purchaseItems.item[i].cost) * $scope.purchaseItems.item[i].igst) / 100) + ($scope.purchaseItems.item[i].quantity * $scope.purchaseItems.item[i].cost);
                                for(var j = 0; j < $scope.purchaseItems.item[i].IMEINumber.length; j++){
                                    purItems.push({
                                        Supplier: $scope.supplierName,
                                        Invoice_Date: $scope.purchase.invoiceDate,
                                        Invoice_Number: $scope.purchase.invoiceNumber,
                                        Purchase_Bill_No: $scope.purchaseItems.invoiceNumber,
                                        Purchase_Date: $scope.purchaseItems.invoiceDate,
                                        Item_Name: $scope.purchaseItems.item[i].name.itemName, 
                                        Qty: 1, 
                                        Rate: $scope.purchaseItems.item[i].cost,  
                                        IGST: $scope.purchaseItems.item[i].igst,
                                        Net_Value: total
                                        // IMEI: $scope.purchaseItems.item[i].IMEINumber[j].IMEI.join(' / ')
                                    });
                                    purItems[purItems.length - 1][$scope.spName[1]] = $scope.purchaseItems.item[i].IMEINumber[j].IMEI.join(' / ');  
                                }
                            }else{
                                purItems.push({
                                    Supplier: $scope.supplierName,
                                    Invoice_Date: $scope.purchase.invoiceDate,
                                    Invoice_Number: $scope.purchase.invoiceNumber,
                                    Purchase_Bill_No: $scope.purchaseItems.invoiceNumber,
                                    Purchase_Date: $scope.purchaseItems.invoiceDate,
                                    Item_Name: $scope.purchaseItems.item[i].name.itemName, 
                                    Qty: $scope.purchaseItems.item[i].quantity, 
                                    Rate: $scope.purchaseItems.item[i].cost, 
                                    IGST: $scope.purchaseItems.item[i].igst, 
                                    Net_Value: $scope.purchaseItems.item[i].total
                                });
                            }
                        }
                        purItems.push({ 
                            IGST: ''
                        });
                        purItems.push({ 
                            IGST: 'Total', 
                            Net_Value: $scope.purchase.netValue
                        });
                    }
                    ExcelService.exportXLSX('Items',$scope.purchase.invoiceNumber,purItems);
                }
            })
        }
    }
}());