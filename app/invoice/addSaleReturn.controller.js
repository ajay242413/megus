(function(){
    'use strict';
    angular.module('app').controller('AddSaleReturn.IndexController', addSaleReturnController);

    function addSaleReturnController(ClientService, MasterService, SettingService, UserService, InventoryService, VouchersService, $scope, $state, $filter, $uibModal){

        var vm=this, activeObj={active:true}, companyStateCode;
        vm.spName = ['Stock Point', 'Serial Number'];
        loadDefault();

        function loadDefault(){
            $scope.salesReturn = {};
            vm.products = [];
            $scope.product = {};
            $scope.salesReturn.totalQuantity = 0;
            $scope.grossAmount = 0;
            $scope.salesReturn.netValue = 0;
            $scope.checkProduct = 0;
            $scope.preError = '';
            $scope.salesReturn.ledgerEntry = {};
            vm.IMEINumber = [];
            vm.IMEINumber1 = [];
            vm.IMEIindex = [];
            initController();
        }

        function initController(){
            ClientService.readClient(activeObj).then(function(res){
                if(res.data){
                    $scope.clients =res.data;
                    refreshPicker();
                }
            });

            MasterService.readSalePoint(activeObj).then(function(res){
                if(res.data){
                    $scope.salePoints = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductItem(activeObj).then(function(res){
                if(res.data){
                    $scope.productItems = res.data;
                    $scope.prodItemClone = res.data;
                }
            });

            MasterService.readFinancialYear(activeObj).then(function(res){
                if(res.data){
                    $scope.finYears = res.data;
                    if(res.data.length){
                        $scope.salesReturn.ledgerEntry.finYear = $scope.finYears[$scope.finYears.findIndex(x => x.status == true)]._id;
                        $scope.salesReturn.ledgerEntry.date = $scope.salesReturn.ledgerEntry.finYear;
                    }
                }
            });

            MasterService.readProductName(activeObj).then(function(res){
                if(res.data){
                    $scope.categories = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductName(activeObj).then(function(res){
                if(res.data){
                    $scope.categories = res.data;
                    refreshPicker();
                }
            });

            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].company){
                        companyStateCode = res.data[0].company.state.gstCode;
                    }
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            vm.spName[0] = res.data[0].format.stockPoint;
                        }
                        if(res.data[0].format.serial){
                            vm.spName[1] = res.data[0].format.serial;
                        }
                    }
                    if(res.data[0].default){
                        if(res.data[0].default.stockPoint){
                            var spInd = $scope.salePoints.findIndex(x => x._id == res.data[0].default.stockPoint);
                            if(spInd >= 0){
                                $scope.salesReturn.salePoint = res.data[0].default.stockPoint;
                            }
                        }
                    }
                }
                if(!companyStateCode){
                    $scope.preError = $scope.preError + 'select State in setting page.\n';
                }
                refreshPicker();
                genetrateNumber();
            });

            InventoryService.readInventoryCode().then(function(res){
                if(res.data){
                    $scope.salesReturn.code = res.data.code;
                }
            });
        }

        function genetrateNumber(){
            $scope.salesReturn.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            InventoryService.readSalesReturnInvoice().then(function(res){
                if(res.data.salesReturn){
                    if(res.data.salesReturn == 'empty'){
                        $scope.preError = $scope.preError + 'Enter sale return bill format in setting page.\n';
                    } else{
                        $scope.salesReturn.invoiceNumber = res.data.salesReturn;
                    }
                }
                if($scope.preError != ''){
                    sweetAlertWarning('DATA NOT FOUND', $scope.preError);
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function() { 
                $('.selectpicker').selectpicker("refresh"); 
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }
        
        function sweetAlertWarning(tle, err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        $scope.back = function(){
            $state.go('invoice.saleReturn', null, {reload:true});
        }

        $scope.clientChange = function(){
            $scope.showSCGST = false;
            $scope.showIGST = false;
            if($scope.salesReturn.party){
                var cliInd = $scope.clients.findIndex(x => x._id == $scope.salesReturn.party);
                if($scope.clients[cliInd].creditDays){
                    $scope.salesReturn.creditDays = $scope.clients[cliInd].creditDays;
                } else{
                    $scope.salesReturn.creditDays = undefined;
                }
                VouchersService.readLedgerId({refId: $scope.clients[cliInd]._id}).then(function(res){
                    $scope.ledgerId = res.data;
                    if($scope.ledgerId.length != 0){
                        $scope.salesReturn.ledgerEntry.ledgerId = $scope.ledgerId[0]._id;
                    }
                });
                UserService.getDealerAuthorID({refId: $scope.clients[cliInd]._id}).then(function(res){
                    $scope.salesReturn.dealerUserID = res.data[0]._id;
                    readSalesItems();
                });
                if(companyStateCode == $scope.clients[cliInd].state.gstCode){
                    $scope.showSCGST = true;
                    $scope.showIGST = false;
                } else{
                    $scope.showIGST = true;
                    $scope.showSCGST = false;
                }
            }
        }

        function readSalesItems(){
            $scope.purchaseItems = [];
            if($scope.salesReturn.party){
                InventoryService.readSalesItems({authorID: $scope.salesReturn.dealerUserID}).then(function(res){
                    $scope.purchaseItems = res.data;
                });
            }
        }

        $scope.categoryChange = function(){
            $scope.prodItemClone = [];
            if($scope.category.length){
                for(var i=0; i<$scope.category.length; i++){
                    for(var j=0; j<$scope.productItems.length; j++){
                        if($scope.category[i] == $scope.productItems[j].prodName._id){
                            $scope.prodItemClone.push($scope.productItems[j]);
                        }
                    }
                }
            } else{
                $scope.prodItemClone = $scope.productItems;
            }
        }

        $scope.itemChange = function(){
            vm.IMEINumber = [];
            vm.IMEINumber1 = [];
            vm.IMEIindex =[];
            var checkItem = 0;
            for (var i=0; i<vm.products.length; i++){
                if(vm.products[i].nameId == $scope.product.nameId){
                    checkItem = 1;
                }
            }
            if(checkItem == 0){
                var itemIndex = $scope.productItems.findIndex(x => x.itemName == $scope.product.nameId);
                if(itemIndex >= 0){
                    $scope.product.quantity = 1;
                    $scope.product.cost = $scope.productItems[itemIndex].sellPrice;
                    $scope.product.sgst = $scope.productItems[itemIndex].prodName.type.taxRate / 2;
                    $scope.product.igst = $scope.productItems[itemIndex].prodName.type.taxRate;
                    delete $scope.product['IMEINumber'];
                    $scope.valueChange();
                }else{
                    $scope.product.quantity = 0;
                    $scope.product.cost = 0;
                    $scope.product.sgst = 0;
                    $scope.product.igst = 0;
                    delete $scope.product['IMEINumber'];
                    $scope.valueChange();
                }
            } else{
                swal('', 'Already Item Exist');
                $scope.product.nameId = '';
            }
        }

        $scope.valueChange = function(){
            if($scope.product.igst == 0){
                $scope.product.total = $scope.product.quantity * $scope.product.cost;
            } else{
                $scope.product.total = ((($scope.product.quantity * $scope.product.cost) * $scope.product.igst) / 100) + ($scope.product.quantity * $scope.product.cost);
            }
            // if($scope.showSCGST == true){
            //     $scope.product.total = (2 * ((($scope.product.quantity * $scope.product.cost) * $scope.product.sgst)) / 100) + ($scope.product.quantity * $scope.product.cost);
            // }
            // else{
            //     $scope.product.total = ((($scope.product.quantity * $scope.product.cost) * $scope.product.igst) / 100) + ($scope.product.quantity * $scope.product.cost);
            // }
            $scope.product.total = $scope.product.total.toFixed(2);
            $scope.salesReturn.totalQuantity = $scope.product.quantity;
            $scope.grossAmount = $scope.product.total;
            $scope.salesReturn.netValue = $scope.grossAmount;
            for(var i=0; i<vm.products.length; i++){
                $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                $scope.salesReturn.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.salesReturn.totalQuantity);
                $scope.salesReturn.netValue = $scope.grossAmount;
            }
        }

        $scope.addProduct = function(){
            $scope.checkProduct = 0;
            if(($scope.salesReturn.party) && ($scope.product.nameId) && ($scope.product.quantity > 0) && ($scope.product.cost > 0) && ($scope.product.sgst > 0) && ($scope.product.igst > 0)){
                var purIndex = $scope.purchaseItems.findIndex(x => x.name.itemName == $scope.product.nameId);
                if($scope.purchaseItems[purIndex].quantity >= $scope.product.quantity){
                    var itemIndex = $scope.productItems.findIndex(x => x.itemName == $scope.product.nameId);
                    if($scope.productItems[itemIndex].IMEINumLen){
                        if(vm.IMEINumber.length != $scope.product.quantity){
                            $scope.checkProduct = 1;
                        }
                    }
                    if($scope.checkProduct == 0){
                        $scope.disableInput = true;
                        vm.products.push($scope.product);
                        if($scope.showSCGST == true){
                            vm.products[vm.products.length - 1]['cgst'] = $scope.product.sgst;
                            delete vm.products[vm.products.length - 1]['igst'];
                        } else{
                            delete vm.products[vm.products.length - 1]['sgst'];
                        }
                        vm.products[vm.products.length - 1]['name'] = $scope.productItems[itemIndex]._id;
                        vm.products[vm.products.length - 1]['id'] = $scope.productid;
                        if($scope.productItems[itemIndex].IMEINumLen){
                            vm.products[vm.products.length - 1]['IMEINumber'] = vm.IMEINumber1;
                        }
                        $scope.product = {};
                        vm.IMEINumber = [];
                        vm.IMEINumber1 = [];
                        vm.IMEIindex = [];
                    }else{
                        swal('', 'Select ' + vm.spName[1]);
                        $scope.checkProduct = 1;
                    }
                } else{
                    swal('', 'Adjust Quantity Size');
                    $scope.checkProduct = 1;
                }
            } else{
                swal('', 'Select Dealer and Item');
                $scope.checkProduct = 1;
            }
        }

        $scope.getProduct = function(){
            return 'display';
        }

        $scope.deleteProduct = function(index){
            vm.products.splice(index,1);
            $scope.grossAmount = 0;
            $scope.salesReturn.totalQuantity = 0;
            $scope.salesReturn.netValue = 0;
            for(var i=0; i<vm.products.length; i++){
                $scope.salesReturn.totalQuantity = $scope.salesReturn.totalQuantity + vm.products[i].quantity;
                $scope.grossAmount = $scope.grossAmount + vm.products[i].total;
                $scope.salesReturn.netValue = $scope.grossAmount;
            }
            if(vm.products.length == 0){
                $scope.disableInput = false;
            }
        }

        $scope.openIMEInoDialog = function(prod){
            var itemIndex = $scope.productItems.findIndex(x => x.itemName == prod.nameId);
            if(itemIndex >= 0){
                if($scope.productItems[itemIndex].IMEINumLen){
                    var productItem=$scope.productItems[itemIndex], purIndex=$scope.purchaseItems.findIndex(x => x.name.itemName == prod.nameId);
                    if($scope.purchaseItems[purIndex].quantity >= prod.quantity){
                        var itemIMEI = $scope.purchaseItems[purIndex].IMEINumber;
                        var modalInstance = $uibModal.open({
                            templateUrl: 'IMEInoContent.html',
                            backdrop: 'static',
                            keyboard: false,
                            controller: function IMEInoController($scope, $uibModalInstance) {
                                $scope.spName = vm.spName;
                                $scope.prodIte = productItem;
                                $scope.IMEINumber = [];
                                $scope.IMEINumber1 = [];
                                $scope.selectedIMEI = [];
                                $scope.itemIMEIno = itemIMEI.map(a => a.IMEI);
                                $scope.quantity = prod.quantity;
                                $scope.imeiInputType = true;
                                
                                if(vm.IMEINumber.length){
                                    if(vm.IMEIindex.length){
                                        $scope.IMEINumber = vm.IMEINumber;
                                    } else{
                                        $scope.selectedIMEI = angular.copy(vm.IMEIindex);
                                        $scope.IMEINumber1 = vm.IMEINumber;
                                        $scope.imeiInputType = false;
                                    }
                                }
                                if($scope.IMEINumber){
                                    if($scope.quantity < $scope.IMEINumber.length){
                                        $scope.IMEINumber.splice($scope.quantity);
                                    }
                                }
                                if($scope.IMEINumber1){
                                    if($scope.quantity < $scope.IMEINumber1.length){
                                        $scope.IMEINumber1.splice($scope.quantity);
                                    }
                                }
                                refreshPicker1();

                                function refreshPicker1(){
                                    angular.element(document).ready(function(){ 
                                        $('.selectpicker').selectpicker("refresh"); 
                                    });
                                }

                                $scope.$watch('imeiInputType',function(){
                                    $scope.selectedIMEI = angular.copy(vm.IMEIindex);
                                    refreshPicker1();
                                });
                            

                                $scope.getNumber = function(num) {
                                    return new Array(num);   
                                }

                                $scope.close = function(){
                                    $uibModalInstance.close();
                                }

                                $scope.selectIMEI = function(selectedIMEI){
                                    vm.IMEIindex = angular.copy(selectedIMEI);
                                    $scope.IMEINumber = [];
                                    vm.IMEINumber1 = [];
                                    for (var i = 0; i < selectedIMEI.length; i++){
                                        $scope.IMEINumber[i] = $scope.itemIMEIno[selectedIMEI[i]];
                                        vm.IMEINumber1[i] = itemIMEI[selectedIMEI[i]];
                                    }
                                }
                                
                                $scope.save = function(){
                                    var result = Object.keys($scope.IMEINumber).map(function(key) {
                                        var s = $scope.IMEINumber[key];
                                        return Object.keys(s).map(function(key1) {
                                            return s[key1];
                                        });
                                    });
                                    vm.IMEINumber = result;
                                    $scope.close();
                                }

                                $scope.searchIMEI = function(imei,pid,ind){
                                    var index = [];
                                    for( var i = 0; i < $scope.itemIMEIno.length; i++){
                                        if(JSON.stringify($scope.itemIMEIno[i]).includes(imei)){
                                            index.push(i);
                                        }
                                    }
                                    if(index.length == 1){
                                        for(var i = 0; i < $scope.itemIMEIno[index[0]].length; i++) {
                                            $scope.IMEINumber1[pid][i] = $scope.itemIMEIno[index[0]][i];
                                        }
                                    }
                                }

                                $scope.saveIMEI = function(){
                                    var result = Object.keys($scope.IMEINumber1).map(function(key){
                                        var s = $scope.IMEINumber1[key];
                                        return Object.keys(s).map(function(key1) {
                                            return s[key1];
                                        });
                                    });
                                    var duplicateImei=[], invalidIMEI=[];
                                    vm.IMEINumber1 = [];
                                    for(var i = 0; i < result.length; i++){
                                        var imeiInd = $scope.itemIMEIno.findIndex(x => JSON.stringify(x) === JSON.stringify(result[i]));                                       
                                        if(imeiInd < 0){
                                            invalidIMEI.push(result[i]);
                                        } else{
                                            for(var j=0; j<result[i].length; j++){
                                                var che = 0;
                                                for(var k=0; k<result.length; k++){
                                                    if(JSON.stringify(result[k]).includes(result[i][j])){
                                                        che = che + 1;
                                                    }
                                                }
                                                if(che > 1){
                                                    duplicateImei.push(result[i][j]);
                                                } else{
                                                    vm.IMEINumber1[i] = itemIMEI[imeiInd];
                                                }
                                            }
                                        }
                                    }
                                    if((duplicateImei.length == 0) && (invalidIMEI.length == 0)){
                                        vm.IMEINumber = result;
                                        $scope.close();
                                    } else{
                                        var error = '';
                                        if(duplicateImei.length){
                                            error = 'DUPLICATION: \n';
                                            for(var i=0; i<duplicateImei.length; i++){
                                                error = error + duplicateImei[i] + '\n';
                                            }
                                        }
                                        if(invalidIMEI.length){
                                            error = error + 'INVALID: \n';
                                            for(var i=0; i<invalidIMEI.length; i++){
                                                error = error + invalidIMEI[i] + '\n';
                                            }
                                        }
                                        swal('IMEI ERROR', error); 
                                    }
                                }
                            }
                        });
                    } else {
                        swal('', 'Quantity is too high,Total is '+$scope.purchaseItems[purIndex].quantity);
                    }
                }
            } else {
                swal('Warning', 'No Matching Product Item found');
            }
        }

        $scope.adjusTotal = function(){
            if($scope.salesReturn.rndOFF){
                $scope.salesReturn.netValue = parseFloat($scope.grossAmount) + parseFloat($scope.salesReturn.rndOFF);
            } else{
                $scope.salesReturn.netValue = $scope.grossAmount;
            }
        }

        $scope.saveSalesReturn = function(){
            if($scope.product.nameId){
                $scope.addProduct();
            }
            var checkSer = 0;
            for(var i=0; i<vm.products.length; i++){
                var itemIndex = $scope.productItems.findIndex(x => x._id == vm.products[i].name);
                if($scope.productItems[itemIndex].IMEINumLen){
                    if(vm.products[i].IMEINumber){
                        if(vm.products[i].IMEINumber.length != vm.products[i].quantity){
                            checkSer = 1;
                        }
                    } else{
                        checkSer = 1;
                    }
                }
            }
            if(($scope.checkProduct == 0) && (checkSer == 0)){
                if(vm.products.length == 0){
                    swal('Warning', 'Add Items');
                }else{
                    swal({title:'Save Sales Return', showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                    $scope.salesReturn.item = vm.products;
                    $scope.salesReturn.ledgerEntry.credit = $scope.salesReturn.netValue;
                    InventoryService.saveSalesReturn($scope.salesReturn).then(function(res){
                        if(res.data){
                            swal.close();
                            $scope.cancelSalesReturn();
                        }
                    });
                }
            }else{
                swal('Warning', 'Enter Details Correctly');
            }
        }

        $scope.cancelSalesReturn = function(){
            $state.reload();
        }
    }
}());