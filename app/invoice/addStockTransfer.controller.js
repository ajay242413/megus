(function(){
    'use strict';
    angular.module('app').controller('AddStockTransfer.IndexController', addStockTransferController);

    function addStockTransferController(MasterService, InventoryService, SettingService, $state, $scope, $filter, $uibModal){

        var vm=this, getActiveObj={active:true};
        vm.spName = ["Stock Point","Serial Number"];
        loadDefault();

        function loadDefault(){
            $scope.transfer = {};
            $scope.products = [];
            $scope.product = {};
            $scope.product.nameId = {};
            $scope.selected = {};
            $scope.category = [];
            $scope.preError = "";
            $scope.transfer.totalQuantity = 0;
            $scope.transfer.netValue = 0;
            $scope.productid = 0;
            vm.IMEINumber = [];
            vm.IMEINumber1 = [];
            vm.IMEIindex = [];
            initController();
        }

        function initController(){
            MasterService.readSalePoint(getActiveObj).then(function(res){
                $scope.salePoints = res.data;
                if(res.data.length){
                    SettingService.readSetting().then(function(res){
                        if(res.data.length){
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
                                        $scope.transfer.source = res.data[0].default.stockPoint;
                                        $scope.sourceChange();
                                    }
                                }
                            }
                        }
                        refreshPicker();
                    });
                } else{
                    $scope.preError = $scope.preError + "Add" + vm.spName[0] + " In Master General Page.\n";
                }
                genetrateNumber();
            });

            MasterService.readProductItem(getActiveObj).then(function(res){
                $scope.productItems = res.data;
                $scope.prodItemClone = [];
            });

            MasterService.readProductName(getActiveObj).then(function(res) {
                $scope.categories = res.data;
                refreshPicker();
            });

            InventoryService.readInventoryCode().then(function(res){
                if(res.data){
                    $scope.transfer.code = res.data.code;
                }
            });
        }

        function genetrateNumber(){
            $scope.transfer.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            InventoryService.readStockTransferInvoice().then(function(res){
                if(res.data.transfer){
                    if(res.data.transfer === 'empty'){
                        $scope.preError = $scope.preError + 'Enter stock transfer bill format in setting page.\n';
                    } else{
                        $scope.transfer.invoiceNumber = res.data.transfer;
                    }
                    if($scope.preError != ""){
                        sweetAlertWarning('DATA NOT FOUND',$scope.preError);
                    }
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function() { 
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        function sweetAlertWarning(tle,err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        $scope.back = function(){
            $state.go('invoice.stockTransfer',null,{reload: true});
        }

        $scope.sourceChange = function(){
            $scope.purchaseItems = [];
            if($scope.transfer.source){
                InventoryService.readPurchaseItems({'salePoint': $scope.transfer.source}).then(function(res){
                    if(res.data){
                        $scope.purchaseItems = res.data;
                        $scope.categoryChange();
                    }
                });
            }
            refreshPicker();
        }

        $scope.categoryChange = function(){
            $scope.prodItemClone = [];
            if($scope.category.length){
                for(var i = 0; i < $scope.category.length; i++){
                    for(var j = 0; j < $scope.productItems.length; j++){
                        if($scope.category[i] == $scope.productItems[j].prodName._id){
                            var purIndex = $scope.purchaseItems.findIndex(x => x.name._id == $scope.productItems[j]._id);
                            if(purIndex >= 0){
                                $scope.prodItemClone.push($scope.productItems[j]);
                            }
                        }
                    }
                }
            }
        }

        $scope.itemChange = function(selected){
            vm.IMEINumber = [];
            vm.IMEINumber1 = [];
            vm.IMEIindex = [];
            var checkItem = 0;
            $scope.checkProduct = 0;
            if(selected){
                $scope.product.nameId = selected;
                for(var i=0; i<$scope.products.length; i++){
                    if($scope.products[i].nameId == $scope.product.nameId.title){
                        checkItem = 1;
                        $scope.checkProduct = 1;
                    }
                }
                if(checkItem == 0){
                    $scope.product.quantity = 1;
                    $scope.product.cost = $scope.product.nameId.originalObject.costPrice;
                    delete $scope.product['IMEINumber'];
                    $scope.valueChange();
                } else{
                    swal('', 'Already Item Exist');
                    $scope.$broadcast('angucomplete-alt:clearInput');
                    $scope.product.nameId = {};
                    $scope.checkProduct = 0;
                }
            } else{
                $scope.product.nameId = {};
                $scope.product.quantity = 0;
                $scope.product.cost = 0;
                delete $scope.product['IMEINumber'];
                $scope.valueChange();
            }
        }

        $scope.valueChange = function(){
            $scope.product.total =  $scope.product.quantity * $scope.product.cost;
            $scope.transfer.totalQuantity = $scope.product.quantity;
            $scope.transfer.netValue = $scope.product.total;
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.transfer.netValue = parseFloat($scope.products[i].total) + parseFloat($scope.transfer.netValue);
                $scope.transfer.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.transfer.totalQuantity);
            }
        }

        $scope.addProduct = function(){
            $scope.checkProduct = 0;
            if(($scope.transfer.salePoint) && ($scope.product.nameId.title) && ($scope.product.total > 0)){
                var purIndex = $scope.purchaseItems.findIndex(x => x.name._id == $scope.product.nameId.originalObject._id);
                if($scope.purchaseItems[purIndex].quantity >= $scope.product.quantity){
                    if($scope.product.nameId.originalObject.IMEINumLen){
                        if(vm.IMEINumber.length != $scope.product.quantity){
                            $scope.checkProduct = 1;
                        }
                    }
                    if($scope.checkProduct == 0){
                        $scope.disableInput = true;
                        $scope.products.push($scope.product);
                        $scope.products[$scope.products.length - 1]['name'] = $scope.product.nameId.originalObject._id;
                        if($scope.product.nameId.originalObject.IMEINumLen){
                            $scope.products[$scope.products.length - 1]['IMEINumber'] = vm.IMEINumber1;
                        }
                        $scope.products[$scope.products.length - 1]['nameId'] = $scope.product.nameId.title;
                        $scope.product = {};
                        $scope.product.nameId = {};
                        $scope.$broadcast('angucomplete-alt:clearInput');
                        vm.IMEINumber = [];
                        vm.IMEINumber1 = [];
                        vm.IMEIindex = [];
                    } else{
                        swal('', 'Select ' + vm.spName[1]);
                    }
                } else{
                    swal('', 'Adjus Item Quantity');
                    $scope.checkProduct = 1;
                }
            } else{
                swal('', 'Select '+ vm.spName[1] + ' TO and Item');
                $scope.checkProduct = 1;
            }
        }

        $scope.getProduct = function(prod){
            return 'display';
        }

        $scope.deleteProduct = function(index){
            $scope.products.splice(index,1);
            $scope.transfer.totalQuantity = 0;
            $scope.transfer.netValue = 0;
            for (var i = 0; i < $scope.products.length; i++) {
                $scope.transfer.totalQuantity = $scope.transfer.totalQuantity + $scope.products[i].quantity;
                $scope.transfer.netValue = $scope.transfer.netValue + $scope.products[i].total;
            }
            if($scope.products.length == 0){
                $scope.disableInput = false;
            }
        }

        $scope.openIMEInoDialog = function(prod, sn, index){
            if($scope.product.nameId.title){
                prod.nameId = $scope.product.nameId;
                if(prod.nameId.originalObject.IMEINumLen){
                    var productItem=prod.nameId.originalObject, purIndex=$scope.purchaseItems.findIndex(x => x.name._id == prod.nameId.originalObject._id);

                    if($scope.purchaseItems[purIndex].quantity >= prod.quantity){
                        var itemIMEI = $scope.purchaseItems[purIndex].IMEINumber;
                        var modalInstance = $uibModal.open({
                            templateUrl: 'IMEInoContent.html',
                            backdrop: 'static',
                            keyboard: false,
                            controller: function IMEInoController($scope, $uibModalInstance){
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
                                    angular.element(document).ready(function() { 
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
                                    var result = Object.keys($scope.IMEINumber1).map(function(key) {
                                        var s = $scope.IMEINumber1[key];
                                        return Object.keys(s).map(function(key1) {
                                            return s[key1];
                                        });
                                    });
                                    var duplicateImei = [];
                                    var invalidIMEI = [];
                                    vm.IMEINumber1 = [];
                                    for(var i = 0; i < result.length; i++){
                                        var imeiInd = $scope.itemIMEIno.findIndex(x => JSON.stringify(x) === JSON.stringify(result[i]));                                       
                                        if(imeiInd < 0){
                                            invalidIMEI.push(result[i]);
                                        } else{
                                            for(var j = 0; j < result[i].length; j++){
                                                var che = 0;
                                                for(var k = 0; k < result.length; k++){
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
                                        var error = "";
                                        if(duplicateImei.length){
                                            error = "DUPLICATION: \n";
                                            for(var i = 0; i < duplicateImei.length; i++) {
                                                error = error + duplicateImei[i] + '\n';
                                            }
                                        }
                                        if(invalidIMEI.length){
                                            error = error + "INVALID: \n";
                                            for(var i = 0; i < invalidIMEI.length; i++) {
                                                error = error + invalidIMEI[i] + '\n';
                                            }
                                        }
                                        sweetAlertWarning('IMEI ERROR',error); 
                                    }
                                }
                            }
                        });
                    } else {
                        sweetAlertWarning('Missing Values', 'Quantity is too high,Total is ' + $scope.purchaseItems[purIndex].quantity);
                    }
                }
            } else {
                sweetAlertWarning('Warning', 'No Matching Product Item found');
            }
        }

        $scope.saveTransfer = function(){
            if($scope.product.nameId.title){
                $scope.addProduct();
            }
            var checkSer = 0;
            for(var i=0; i<$scope.products.length; i++){
                var itemIndex = $scope.productItems.findIndex(x => x._id == $scope.products[i].name);
                if($scope.productItems[itemIndex].IMEINumLen){
                    if($scope.products[i].IMEINumber){
                        if($scope.products[i].IMEINumber.length != $scope.products[i].quantity){
                            checkSer = 1;
                        }
                    } else{
                        checkSer = 1;
                    }
                }
            }
            if(($scope.checkProduct == 0) && (checkSer == 0)){
                if($scope.products.length == 0){
                    swal('', 'Add Item');
                } else{
                    swal({title:"Saving", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                    $scope.transfer['item'] = $scope.products;
                    InventoryService.saveStockTransfer($scope.transfer).then(function(res){
                        if(res.data){
                            swal.close();
                            $scope.cancelTransfer();
                        }
                    });
                }
            } else{
                swal('Warning', 'Enter Data Properly');
            }
        }

        $scope.cancelTransfer = function(){
            $state.reload();
        }
    }
})();