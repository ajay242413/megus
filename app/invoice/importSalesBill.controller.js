(function() {
    'use strict';
    angular.module('app').controller('ImportSalesBill.IndexController', importSalesBillController);

    function importSalesBillController(ClientService, MasterService, InventoryService, SettingService, ExcelService, VouchersService, UserService, $scope, $state, $filter){

        var vm = this,activeObj = {active: true},companyStateCode;
        $scope.spName = ["Stock Point","Serial Number"];
        $scope.user = $scope.rootUser;
        $scope.preError = "";
        $scope.total = 0;
        $scope.valid = 0;
        $scope.validSaleBills = [];
        loadDefault();

        function loadDefault(){
            initController();
        }

        function initController(){
            ClientService.readClient(activeObj).then(function(res) {
                $scope.clients =res.data;
            });

            MasterService.readSalePoint(activeObj).then(function(res){
                $scope.salePoints = res.data;
            });

            MasterService.readProductItem(activeObj).then(function(res){
                $scope.productItems = res.data;
            });

            MasterService.readFinancialYear(activeObj).then(function(res) {
                if(res.data.length != 0){
                    $scope.finYear = res.data[res.data.findIndex(x => x.status == 1)]._id;
                }
            });

            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].company){
                        companyStateCode = res.data[0].company.state.gstCode;
                    }
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName[0] = res.data[0].format.stockPoint;
                        }
                        if(res.data[0].format.serial){
                            $scope.spName[1] = res.data[0].format.serial;
                        }
                    }
                }
                if(!companyStateCode){
                    $scope.preError = $scope.preError + 'Select State in setting page.\n';
                }
                genetrateNumber();
            });

            InventoryService.readPurchaseItems().then(function(res){
                $scope.purchaseItems = res.data;
            });

            VouchersService.readLedgerId().then(function(res) {
                $scope.ledgerids = res.data;
            });

            UserService.getDealerAuthorID({authorID: $scope.user.authorID}).then(function(res) {
                $scope.userids = res.data;
            });

            InventoryService.readInventoryCode().then(function(res){
                if(res.data){
                    $scope.inventCode = res.data.code;
                }
            });
        }

        function genetrateNumber(){
            $scope.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            InventoryService.readSalesInvoice().then(function(res){
                if(res.data.sale){
                    if(res.data.sale === 'empty'){
                        $scope.preError = $scope.preError + 'Enter sale bill format in setting page.\n';
                    } else{
                        $scope.invoiceNumber = res.data.sale;
                    }
                }
                if($scope.preError != ""){
                    sweetAlertWarning('DATA NOT FOUND',$scope.preError);
                }
            });
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
            $state.go('invoice.sales',null,{reload: true});
        }

        $scope.upload = function(){
            $scope.total = 0;
            $scope.valid = 0;
            var file = $scope.excelSheet;
            swal({
                title: "Validating",
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                imageUrl: '../images/200px/gear.gif'
            });
            if(file){
                var reader = new FileReader();
                reader.onload = function(e){
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if(excelData.length > 0){
                        // validateSales(excelData);
                        billValidation(excelData);
                    }else{
                        swal.close();
                        swal("","Data Not Found");
                    }
                }
                reader.onerror = function(ex){
                    swal.close();
                    swal("","Internal Error");
                }
                reader.readAsBinaryString(file);
            } else{
                swal.close();
            }
        }

        function billValidation(excelData){
            console.log(excelData);
        }
        
        // function validateSales(ed){
        //     $scope.validSaleBills = [];
        //     var salesInvoiceno = ed.map(a => a['Invoice No']);
        //     var uniqueSaleInvono = salesInvoiceno.filter(function(item, pos){
        //         if(item){
        //             return salesInvoiceno.indexOf(item)== pos;
        //         }
        //     });
        //     var invoiceBills = [];
        //     var saleBillReport = [];
        //     var noIMEIitem = [];
        //     loop1:
        //         for(var a = 0; a < uniqueSaleInvono.length; a++){
        //             var invoDate,dealer,result,item = [],errorMsg = "",errorInd,salepoint = {},saleReport = [];
        //             var edInd = ed.findIndex(x => ((x['Invoice No'] == uniqueSaleInvono[a]) && (x['Invoice Date']) && (x['Dealer Name'])));
        //             if(edInd >= 0){
        //                 if(ed[edInd]['Invoice Date']){
        //                     invoDate = ed[edInd]['Invoice Date'];
        //                 } else{
        //                     errorMsg = "Invoice Date Not Found";
        //                 }
        //                 if(ed[edInd]['Dealer Name']){
        //                     $scope.cliInd = $scope.clients.findIndex(x => x.name == ed[edInd]['Dealer Name']);
        //                     if($scope.cliInd >= 0){
        //                         dealer = ed[edInd]['Dealer Name'];
        //                     } else{
        //                         errorMsg = "Dealer Name is Wrong"; 
        //                     }
        //                 } else{
        //                     errorMsg = "Dealer Name Not Found";
        //                 }
        //             } else{
        //                 errorMsg = "Invoice Date and Dealer Name are Not Found";
        //             }
        //             if((invoDate) && (dealer)){
        //                 loop2:
        //                     for(var b = 0; b < ed.length; b++){
        //                         if(uniqueSaleInvono[a] == ed[b]['Invoice No']){
        //                             if((invoDate == ed[b]['Invoice Date']) && (dealer == ed[b]['Dealer Name'])){
        //                                 if(ed[b]['Item Code']){
        //                                     var itmInd =  $scope.productItems.findIndex(x => x.itemCode == ed[b]['Item Code']);
        //                                     if(itmInd >= 0){
        //                                         if($scope.productItems[itmInd].prodName.IMEINumCount){
        //                                             var imeiNumber = [];
        //                                             if(ed[b]['IMEI Number']){
        //                                                 var imeiSplit = ed[b]['IMEI Number'].split("/");
        //                                                 if($scope.productItems[itmInd].prodName.IMEINumCount == imeiSplit.length){
        //                                                     for(var c = 0; c < imeiSplit.length; c++){
        //                                                         var imei = imeiSplit[c].toString().replace(/[\s]/g, '');
        //                                                         if(imei.match(/^[0-9]+$/) != null){
        //                                                             if(imei.length == $scope.productItems[itmInd].IMEINumLen){
        //                                                                 imeiSplit[c] = imei;
        //                                                             } else{
        //                                                                 errorMsg = $scope.spName[1] + " Length Missmatched";
        //                                                                 saleReport.push(ed[b]);
        //                                                                 saleReport[saleReport.length - 1].status = errorMsg;
        //                                                                 continue loop2;
        //                                                             }
        //                                                         } else{
        //                                                             errorMsg = $scope.spName[1] + " is not a Number";
        //                                                             saleReport.push(ed[b]);
        //                                                             saleReport[saleReport.length - 1].status = errorMsg;
        //                                                             continue loop2;
        //                                                         }
        //                                                     }
        //                                                 } else{
        //                                                     errorMsg = "Check " + $scope.spName[1] + " Number Count";
        //                                                     saleReport.push(ed[b]);
        //                                                     saleReport[saleReport.length - 1].status = errorMsg;
        //                                                     continue loop2;
        //                                                 }
        //                                                 if(salepoint._id){
        //                                                     var imeiMatch = false;
        //                                                     var purItmInd = $scope.purchaseItems.findIndex(x => ((x.name._id == $scope.productItems[itmInd]._id) && (x.salePoint._id == salepoint._id)));
        //                                                     if(purItmInd >= 0){
        //                                                         for(var e = 0; e < $scope.purchaseItems[purItmInd].IMEINumber.length; e++){
        //                                                             var imeiMat = 0;
        //                                                             for(var f = 0; f < imeiSplit.length; f++){
        //                                                                 if($scope.purchaseItems[purItmInd].IMEINumber[e].IMEI.includes(imeiSplit[f])){
        //                                                                     imeiMat = imeiMat + 1;
        //                                                                 }
        //                                                             }
        //                                                             if(imeiMat == imeiSplit.length){
        //                                                                 imeiNumber = $scope.purchaseItems[purItmInd].IMEINumber[e];
        //                                                                 imeiMatch = true;
        //                                                                 break;
        //                                                             }
        //                                                         }
        //                                                     }
        //                                                     if(!imeiMatch){
        //                                                         errorMsg = $scope.spName[1] + " is not in the " + $scope.spName[0] + " (" + salepoint.name + ")";
        //                                                         saleReport.push(ed[b]);
        //                                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                                         continue loop2;
        //                                                     }
        //                                                 } else{
        //                                                     var imeiMatch = false;
        //                                                     loop3:
        //                                                         for(var d = 0; d < $scope.purchaseItems.length; d++){
        //                                                             if($scope.purchaseItems[d].name._id == $scope.productItems[itmInd]._id){
        //                                                                 for(var e = 0; e < $scope.purchaseItems[d].IMEINumber.length; e++){
        //                                                                     var imeiMat = 0;
        //                                                                     for(var f = 0; f < imeiSplit.length; f++){
        //                                                                         if($scope.purchaseItems[d].IMEINumber[e].IMEI.includes(imeiSplit[f])){
        //                                                                             imeiMat = imeiMat + 1;
        //                                                                         }
        //                                                                     }
        //                                                                     if(imeiMat == imeiSplit.length){
        //                                                                         imeiNumber = $scope.purchaseItems[d].IMEINumber[e];
        //                                                                         imeiMatch = true;
        //                                                                         if(!salepoint._id){
        //                                                                             salepoint = $scope.purchaseItems[d].salePoint;
        //                                                                         }
        //                                                                         break loop3;
        //                                                                     }
        //                                                                 }
        //                                                             }
        //                                                         }
        //                                                     if(!imeiMatch){
        //                                                         errorMsg = $scope.spName[1] + " is Not in the Stock";
        //                                                         saleReport.push(ed[b]);
        //                                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                                         continue loop2;
        //                                                     }
        //                                                 }
        //                                             } else{
        //                                                 errorMsg = $scope.spName[1] + " Not Found";
        //                                                 saleReport.push(ed[b]);
        //                                                 saleReport[saleReport.length - 1].status = errorMsg;
        //                                                 continue loop2;
        //                                             }
        //                                             var invoItmInd = item.findIndex(x => x.name == $scope.productItems[itmInd]._id);
        //                                             if(invoItmInd < 0){
        //                                                 if(ed[b].Value){
        //                                                     if(companyStateCode == $scope.clients[$scope.cliInd].state.gstCode){
        //                                                         var SGST = parseInt($scope.productItems[itmInd].outputTax) / 2;
        //                                                         var rate = (100 * parseInt(ed[b].Value)) / (parseInt($scope.productItems[itmInd].outputTax) + 100);
        //                                                         item.push({name: $scope.productItems[itmInd]._id, cost: rate, sgst: SGST, cgst: SGST, total: 0, quantity: 1, IMEINumber: [], 'rate': parseInt(ed[b].Value)});
        //                                                         item[item.length - 1].IMEINumber.push(imeiNumber);
        //                                                     } else{
        //                                                         var IGST = parseInt($scope.productItems[itmInd].outputTax);
        //                                                         var rate = (100 * parseInt(ed[b].Value)) / (parseInt($scope.productItems[itmInd].outputTax) + 100);
        //                                                         item.push({name: $scope.productItems[itmInd]._id, cost: rate, igst: IGST, total: 0, quantity: 1, IMEINumber: [], 'rate': parseInt(ed[b].Value)});
        //                                                         item[item.length - 1].IMEINumber.push(imeiNumber);
        //                                                     }
        //                                                 } else{
        //                                                     errorMsg = "Value is Not Found";
        //                                                     saleReport.push(ed[b]);
        //                                                     saleReport[saleReport.length - 1].status = errorMsg;
        //                                                     continue loop2;
        //                                                 }
        //                                             } else{
        //                                                 item[invoItmInd].quantity = item[invoItmInd].quantity + 1;
        //                                                 item[invoItmInd].IMEINumber.push(imeiNumber);
        //                                             }
        //                                             saleReport.push(ed[b]);
        //                                             if(errorMsg == ""){
        //                                                 saleReport[saleReport.length - 1]['status'] = "SUCCESS";
        //                                             } else{
        //                                                 saleReport[saleReport.length - 1]['status'] = "FAILED";
        //                                             }
        //                                         } else{
        //                                             if(ed[b].Quantity){
        //                                                 if(salepoint._id){
        //                                                     var imeiMatch = false;
        //                                                     var purItmInd = $scope.purchaseItems.findIndex(x => ((x.name._id == $scope.productItems[itmInd]._id) && (x.salePoint._id == salepoint._id)));
        //                                                     if(purItmInd >= 0){
        //                                                         var noIMEIitmInd = noIMEIitem.findIndex(x => ((x.item == $scope.productItems[itmInd]._id) && (x.salepoint == salepoint._id)));
        //                                                         if(noIMEIitmInd >= 0){
        //                                                             noIMEIitem[noIMEIitmInd].quantity = parseInt(ed[b].Quantity) + parseInt(noIMEIitem[noIMEIitmInd].quantity);
        //                                                             if($scope.purchaseItems[purItmInd].quantity >= noIMEIitem[noIMEIitmInd].quantity){
        //                                                                 imeiMatch = true;
        //                                                             }
        //                                                         } else{
        //                                                             noIMEIitem.push({item: $scope.productItems[itmInd]._id,'salepoint': salepoint._id,quantity: parseInt(ed[b].Quantity)});
        //                                                             if($scope.purchaseItems[purItmInd].quantity >= ed[b].Quantity){
        //                                                                 imeiMatch = true;
        //                                                             }
        //                                                         }
        //                                                     } else{
        //                                                         errorMsg = "Item is not in the" + $scope.spName[0] + " (" + salepoint.name + ")";
        //                                                         saleReport.push(ed[b]);
        //                                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                                         continue loop2;
        //                                                     }
        //                                                     if(!imeiMatch){
        //                                                         errorMsg = "quantity is too low in a stock";
        //                                                         saleReport.push(ed[b]);
        //                                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                                         continue loop2;
        //                                                     }
        //                                                 } else{
        //                                                     var imeiMatch = false;
        //                                                     loop3:
        //                                                         for(var d = 0; d < $scope.purchaseItems.length; d++){
        //                                                             if($scope.purchaseItems[d].name._id == $scope.productItems[itmInd]._id){
        //                                                                 noIMEIitem.push({item: $scope.productItems[itmInd]._id,'salepoint': $scope.purchaseItems[d].salePoint._id,quantity: parseInt(ed[b].Quantity)});
        //                                                                 salepoint = $scope.purchaseItems[d].salePoint;
        //                                                                 if($scope.purchaseItems[d].quantity >= ed[b].Quantity){
        //                                                                     imeiMatch = true;
        //                                                                     break loop3;
        //                                                                 }
        //                                                             }
        //                                                         }
        //                                                     if(!imeiMatch){
        //                                                         errorMsg = "quantity is too low in a stock";
        //                                                         saleReport.push(ed[b]);
        //                                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                                         continue loop2;
        //                                                     }
        //                                                 }
        //                                                 var invoItmInd = item.findIndex(x => x.name == $scope.productItems[itmInd]._id);
        //                                                 if(invoItmInd < 0){
        //                                                     if(ed[b].Value){
        //                                                         if(companyStateCode == $scope.clients[$scope.cliInd].state.gstCode){
        //                                                             var SGST = parseInt($scope.productItems[itmInd].outputTax) / 2;
        //                                                             var rate = (100 * parseInt(ed[b].Value)) / ((parseInt(ed[b].Quantity) * (parseInt($scope.productItems[itmInd].outputTax) + 100)));
        //                                                             var withTax = parseInt(ed[b].Value) / parseInt(ed[b].Quantity);
        //                                                             item.push({name: $scope.productItems[itmInd]._id, cost: rate, sgst: SGST, cgst: SGST, total: 0, quantity: parseInt(ed[b].Quantity), 'rate': withTax});
        //                                                         } else{
        //                                                             var rate = (100 * parseInt(ed[b].Value)) / ((parseInt(ed[b].Quantity) * (parseInt($scope.productItems[itmInd].outputTax) + 100)));
        //                                                             var withTax = parseInt(ed[b].Value) / parseInt(ed[b].Quantity);
        //                                                             item.push({name: $scope.productItems[itmInd]._id, cost: rate, igst: parseInt($scope.productItems[itmInd].outputTax), total: 0, quantity: parseInt(ed[b].Quantity), 'rate': withTax});
        //                                                         }
        //                                                     } else{
        //                                                         errorMsg = "Value Not Found";
        //                                                         saleReport.push(ed[b]);
        //                                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                                         continue loop2;
        //                                                     }
        //                                                 } else{
        //                                                     item[invoItmInd].quantity = parseInt(item[invoItmInd].quantity) + parseInt(ed[b].Quantity);
        //                                                 }
        //                                                 saleReport.push(ed[b]);
        //                                                 if(errorMsg == ""){
        //                                                     saleReport[saleReport.length - 1]['status'] = "SUCCESS";
        //                                                 } else{
        //                                                     saleReport[saleReport.length - 1]['status'] = "FAILED";
        //                                                 }
        //                                             } else{
        //                                                 errorMsg = "Quantity Not Found";
        //                                                 saleReport.push(ed[b]);
        //                                                 saleReport[saleReport.length - 1].status = errorMsg;
        //                                                 continue loop2;
        //                                             }
        //                                         }
        //                                     } else{
        //                                         errorMsg = "ItemCode Wrong";
        //                                         saleReport.push(ed[b]);
        //                                         saleReport[saleReport.length - 1].status = errorMsg;
        //                                         continue loop2;
        //                                     }
        //                                 } else{
        //                                     errorMsg = "ItemCode Not Found";
        //                                     saleReport.push(ed[b]);
        //                                     saleReport[saleReport.length - 1].status = errorMsg;
        //                                     continue loop2;
        //                                 }
        //                             } else{
        //                                 errorMsg = "Invoice Date or Dealer Name are Not Found";
        //                                 saleReport.push(ed[b]);
        //                                 saleReport[saleReport.length - 1].status = errorMsg;
        //                                 continue loop2;
        //                             }
        //                         }
        //                     }
        //             } else{
        //                 saleReport = invalidStatement(ed,uniqueSaleInvono[a],errorMsg);
        //             }
        //             if(errorMsg == ""){
        //                 var gross = 0;
        //                 var totQty = 0;
        //                 for(var i = 0; i < item.length; i++) {
        //                     item[i].total = parseInt(item[i].quantity) * parseInt(item[i].rate);
        //                     gross = parseInt(gross) + parseInt(item[i].total);
        //                     totQty = parseInt(totQty) + parseInt(item[i].quantity)
        //                 }
        //                 var ledid = $scope.ledgerids.findIndex(x => x.refId._id == $scope.clients[$scope.cliInd]._id);
        //                 var delid =  $scope.userids.findIndex(x => x.refID == $scope.clients[$scope.cliInd]._id);
        //                 invoiceBills.push({party: $scope.clients[$scope.cliInd]._id, code: $scope.inventCode,ledgerID: $scope.ledgerids[ledid]._id, dealerID: $scope.userids[delid]._id, salePoint: salepoint._id, billno: uniqueSaleInvono[a], invoiceNumber: $scope.invoiceNumber, invoiceDate: $filter('date')(new Date(), "yyyy-MM-dd"), billDate: $filter('date')(new Date(invoDate), "yyyy-MM-dd"),item: item, totalQuantity: totQty, netValue: gross});
        //                 var invoNoSplit = $scope.invoiceNumber.split("/");
        //                 $scope.invoiceNumber = "";
        //                 $scope.inventCode = $scope.inventCode + 1;
        //                 for(var i = 0; i < invoNoSplit.length; i++){
        //                     if(i == invoNoSplit.length-1){
        //                         var inc = parseInt(invoNoSplit[i]) + 1;
        //                         $scope.invoiceNumber = $scope.invoiceNumber + inc;
        //                     } else{
        //                         $scope.invoiceNumber = $scope.invoiceNumber + invoNoSplit[i] + '/';
        //                     }
        //                 }
        //             } else{
        //                 for(var i = 0; i < saleReport.length; i++) {
        //                     if(saleReport[i].status == 'SUCCESS'){
        //                         saleReport[i].status = 'FAILED';
        //                     }
        //                 }
        //             }
        //             saleBillReport = saleBillReport.concat(saleReport);
        //         }
        //     ExcelService.exportXLSX('bills','sale_bill_report',saleBillReport);
        //     $scope.total = uniqueSaleInvono.length;
        //     $scope.valid = invoiceBills.length;
        //     $scope.validSaleBills = invoiceBills;
        //     $scope.$apply();
        //     swal.close();
        // }

        function invalidStatement(ed,invono,msg){
            var report = [];
            for(let i = 0; i < ed.length; i++){
                if(ed[i]['Invoice No'] == invono){
                    report.push(ed[i]);
                    report[report.length - 1]['status'] = msg;
                }
            }
            return report;
        }

        $scope.saveSaleBills = function(){
            console.log($scope.validSaleBills);
            // if($scope.validSaleBills.length){
            //     swal({
            //         title: "Saving",
            //         showCancelButton: false,
            //         showConfirmButton: false,
            //         allowOutsideClick: false,
            //         allowEscapeKey: false,
            //         imageUrl: '../images/200px/gear.gif'
            //     });
            //     InventoryService.saveSalesBills({'bills': $scope.validSaleBills,finYear: $scope.finYear}).then(function(res){
            //         swal.close();
            //         $state.reload();
            //     });
            // }
        }
    }
}());