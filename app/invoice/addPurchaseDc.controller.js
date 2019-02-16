(function() {
    'use strict';
    angular.module('app').controller('AddPurchaseDc.IndexController', addPurchaseDcController);

    function addPurchaseDcController(MasterService, InventoryService, SettingService, $state, $scope, $rootScope, $filter, $uibModal){

        var vm=this, activeObj={active:true}, companyStateCode, invoDate, imeiNumber=[], imeiNumber1=[], imeiNumber1=[], productid = 0;
        vm.spName = ['Stock Point', 'Serial Number'];
        loadDefault();

        function loadDefault(){
            $scope.purchase = {};
            $scope.product = {};
            $scope.selected = {};
            $scope.product.nameId = {};
            vm.products = [];
            $scope.purchase.totalQuantity = 0;
            $scope.grossAmount = 0;
            $scope.purchase.netValue = 0;
            $scope.purchase.grossValue = 0;
            $scope.purchase.CGST = 0;
            $scope.purchase.SGST = 0;
            $scope.purchase.IGST = 0;
            $scope.preError = '';
            initController();
            refreshPicker();
        }

        function initController(){
            MasterService.readSupplier(activeObj).then(function(res){
                if(res.data){
                    $scope.suppliers = res.data;
                    refreshPicker();
                }
            });

            MasterService.readSalePoint(activeObj).then(function(res){
                if(res.data){
                    $scope.salePoints = res.data;
                    if($scope.salePoints.length == 0){
                        $scope.preError = $scope.preError + 'Add' + vm.spName[0] + ' In Master General Page.\n';
                    }
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
                                        $scope.purchase.salePoint = res.data[0].default.stockPoint;
                                    }
                                }
                            }
                        }
                        if(!companyStateCode){
                            $scope.preError = $scope.preError + 'Select State in setting page.\n';
                        }
                        refreshPicker();
                        genetrateNumber();
                    });
                    refreshPicker();
                }
            });

            MasterService.readProductItem(activeObj).then(function(res){
                if(res.data){
                    $scope.productItems = res.data;
                    $scope.prodItemClone = [];
                }
            });

            MasterService.readProductName(activeObj).then(function(res){
                if(res.data){
                    $scope.categories = res.data;
                    refreshPicker();
                }
            });


            MasterService.readFinancialYear(activeObj).then(function(res){
                if(res.data){
                    $scope.finYears = res.data;
                    if($scope.finYears.length != 0){
                        $scope.purchase.finYear = $scope.finYears[$scope.finYears.findIndex(x => x.status == true)]._id;
                    }
                }
            });

            InventoryService.readInventoryCode().then(function(res){
                if(res.data){
                    $scope.purchase.code = res.data.code;
                }
            });
        }

        function genetrateNumber(){
            $scope.purchase.invoiceDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            invoDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            InventoryService.readInvoiceNumber({type:'pdc'}).then(function(res){
                if(res.data.invoice){
                    if(res.data.invoice == 'empty'){
                        $scope.preError = $scope.preError + 'Enter purchase dc bill format in setting page.\n';
                    } else{
                        $scope.purchase.invoiceNumber = res.data.invoice;
                    }
                    if($scope.preError != ''){
                        sweetAlertWarning('DATA NOT FOUND',$scope.preError);
                    }
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker('refresh');
                // $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        function sweetAlertWarning(tle,err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        $scope.back = function(){
            $state.go('invoice.purchaseDc', null , {reload:true});
        }

        $scope.supplierChange = function(){
            $scope.showSCGST = false;
            $scope.showIGST = false;
            var supIndex = $scope.suppliers.findIndex(x => x._id == $scope.purchase.party);
            if(supIndex >= 0){
                if(companyStateCode == $scope.suppliers[supIndex].state.gstCode){
                    $scope.showSCGST = true;
                    $scope.showIGST = false;
                } else{
                    $scope.showIGST = true;
                    $scope.showSCGST = false;
                }
            }
        }

        $scope.categoryChange = function(){
            $scope.prodItemClone = [];
            if($scope.purchase.category.length){
                for(var i = 0; i < $scope.purchase.category.length; i++){
                    for(var j = 0; j < $scope.productItems.length; j++){
                        if($scope.purchase.category[i] == $scope.productItems[j].prodName._id){
                            $scope.prodItemClone.push($scope.productItems[j]);
                        }
                    }
                }
            } else{
                $scope.prodItemClone = $scope.productItems;
            }
            refreshPicker();
        }

        $scope.itemChange = function(selected){
            vm.IMEINumber = [];
            if(selected){
                $scope.product.nameId = selected;
                var checkItem = 0;
                for(var i=0; i<vm.products.length; i++){
                    if(vm.products[i].nameId == $scope.product.nameId.title){
                        checkItem = 1;
                    }
                }
                if(checkItem == 0){
                    $scope.product.quantity = 1;
                    $scope.product.cost = $scope.product.nameId.originalObject.costPrice;
                    $scope.product.sgst = $scope.product.nameId.originalObject.prodName.type.taxRate / 2;
                    $scope.product.igst = $scope.product.nameId.originalObject.prodName.type.taxRate;
                    delete $scope.product['IMEINumber'];
                    $scope.valueChange();
                } else{
                    swal('', 'Already Item Exist');
                    $rootScope.$broadcast('angucomplete-alt:clearInput', 'aa1');
                    $scope.product.nameId = {};
                }
            } else{
                $scope.product.nameId = {};
                $scope.product.quantity = 0;
                $scope.product.cost = 0;
                $scope.product.sgst = 0;
                $scope.product.igst = 0;
                $scope.product.srate = 0;
                $scope.product.irate = 0;
                $scope.valueChange(); 
            }
        }

        $scope.valueChange = function(qty){
            $scope.purchase.rndOFF = 0;
            if(qty){
                vm.IMEINumber = [];
            }
            if($scope.showSCGST == true){
                if($scope.product.quantity && $scope.product.cost && $scope.product.sgst){
                    $scope.product.srate = ((parseFloat($scope.product.quantity) * (parseFloat($scope.product.cost) * parseFloat($scope.product.sgst))) / 100).toFixed(2);
                    $scope.product.total = ((2 * parseFloat($scope.product.srate)) + (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost))).toFixed(2);
                    $scope.purchase.grossValue = (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost)).toFixed(2);
                    $scope.purchase.totalQuantity = $scope.product.quantity;
                } else{
                    $scope.product.srate = 0;
                    $scope.product.total = 0;
                    $scope.purchase.grossValue = 0;
                    $scope.purchase.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.product.total;
                $scope.purchase.SGST = $scope.product.srate;
                for(var i = 0; i < vm.products.length; i++){
                    if($scope.selected.id != vm.products[i].id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.purchase.SGST = (parseFloat($scope.purchase.SGST) + parseFloat(vm.products[i].srate)).toFixed(2);
                    } else{
                        if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                            $scope.grossAmount = (parseFloat($scope.selected.total) + parseFloat($scope.grossAmount)).toFixed(2);
                            $scope.purchase.totalQuantity = parseFloat($scope.selected.quantity) + parseFloat($scope.purchase.totalQuantity);
                            $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost);
                            $scope.purchase.SGST = (parseFloat($scope.purchase.SGST) + parseFloat($scope.selected.srate)).toFixed(2);
                        }
                    }
                }
                $scope.purchase.netValue = $scope.grossAmount;
            } else{
                if($scope.product.quantity && $scope.product.cost && $scope.product.igst){
                    $scope.product.irate = ((parseFloat($scope.product.quantity) * (parseFloat($scope.product.cost) * parseFloat($scope.product.igst))) / 100).toFixed(2);
                    $scope.product.total = (parseFloat($scope.product.irate) + (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost))).toFixed(2);
                    $scope.purchase.grossValue = (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost)).toFixed(2);
                    $scope.purchase.totalQuantity = $scope.product.quantity;
                } else{
                    $scope.product.irate = 0;
                    $scope.product.total = 0;
                    $scope.purchase.grossValue = 0;
                    $scope.purchase.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.product.total;
                $scope.purchase.IGST = $scope.product.irate;
                for(var i = 0; i < vm.products.length; i++){
                    if($scope.selected.id != vm.products[i].id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.purchase.IGST = (parseFloat($scope.purchase.IGST) + parseFloat(vm.products[i].irate)).toFixed(2);
                    } else{
                        $scope.grossAmount = (parseFloat($scope.selected.total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat($scope.selected.quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost);
                        $scope.purchase.IGST = (parseFloat($scope.purchase.IGST) + parseFloat($scope.selected.irate)).toFixed(2);
                    }
                }
                $scope.purchase.netValue = $scope.grossAmount;
            }
        }

        $scope.addProduct = function(){
            $scope.checkIMEI = 0;
            if(($scope.purchase.party) && ($scope.purchase.salePoint) && ($scope.product.nameId.title) && ($scope.product.quantity > 0) && ($scope.product.cost > 0) && ($scope.product.total > 0)){
                if($scope.product.nameId.originalObject.IMEINumLen){
                    if(vm.IMEINumber.length != $scope.product.quantity){
                        $scope.checkIMEI = 1;
                    }
                }
                if($scope.checkIMEI === 0){
                    $scope.disableSupplier = true;
                    vm.products.push($scope.product);
                    if($scope.showSCGST == true){
                        $scope.purchase.CGST = $scope.purchase.SGST;
                        vm.products[vm.products.length - 1]['cgst'] = $scope.product.sgst;
                        $scope.purchase.IGST = undefined;
                        delete vm.products[vm.products.length - 1]['igst'];
                        delete vm.products[vm.products.length - 1]['irate'];
                    } else{
                        $scope.purchase.SGST = undefined;
                        $scope.purchase.CGST = undefined;
                        delete vm.products[vm.products.length - 1]['sgst'];
                        delete vm.products[vm.products.length - 1]['srate'];
                    }
                    if($scope.product.nameId.originalObject.IMEINumLen){
                        vm.products[vm.products.length - 1]['IMEINumber'] = vm.IMEINumber;
                        imeiNumber = imeiNumber.concat(imeiNumber1);
                    }
                    vm.products[vm.products.length - 1]['name'] = $scope.product.nameId.originalObject._id;
                    vm.products[vm.products.length - 1]['id'] = productid;
                    vm.products[vm.products.length - 1]['nameId'] = $scope.product.nameId.title;
                    productid = productid + 1;
                    $scope.product = {};
                    $scope.$broadcast('angucomplete-alt:clearInput', 'aa1');  
                    $scope.product.nameId = {};
                    vm.IMEINumber = [];
                } else{
                    swal('', vm.spName[1] + ' Missing');
                }
            }else{
                sweetAlertWarning('Data Not Found', 'Select Supplier, ' + vm.spName[0] + ', and Item');
                $scope.checkIMEI = 1;
            }
        }

        $scope.getProduct = function(product){
            if($scope.selected.id == product.id){
                return 'edit';
            } else{
                return 'display';
            }
        }

        $scope.editProduct = function(product){
            $scope.selected = angular.copy(product);
            if($scope.selected.IMEINumber){
                vm.IMEINumber1 = $scope.selected.IMEINumber;
            }
        }

        $scope.selectedItemChange = function(nameId){
            delete $scope.selected['IMEINumber'];
            vm.IMEINumber1 = [];
            if(nameId){
                $scope.selected.nameId = nameId;
                var checkItem = 0;
                for(var i = 0; i < vm.products.length; i++){
                    if(vm.products[i].nameId == $scope.selected.nameId.title){
                        checkItem = 1;
                    }
                }
                if($scope.product.nameId.title == $scope.selected.nameId.title){
                    checkItem = 1;
                }
                if(checkItem == 0){
                    $scope.selected.quantity = 1;
                    $scope.selected.cost = $scope.selected.nameId.originalObject.sellPrice;
                    $scope.selected.name = $scope.selected.nameId.originalObject._id;
                    $scope.selected.sgst = $scope.selected.nameId.originalObject.prodName.type.taxRate / 2;
                    $scope.selected.igst = $scope.selected.nameId.originalObject.prodName.type.taxRate;
                    $scope.selectedValueChange();
                } else{
                    $scope.$broadcast('angucomplete-alt:clearInput', 'aa2');
                    $scope.selected.nameId = {};
                    swal('', 'Already Item Exist');
                }
            } else{
                $scope.selected.nameId = {};
                $scope.selected.name = '';
                $scope.selected.quantity = 0;
                $scope.selected.cost = 0;
                $scope.selected.sgst = 0;
                $scope.selected.igst = 0;
                $scope.selected.srate = 0;
                $scope.selected.irate = 0;
                $scope.selectedValueChange();
            }
        }

        $scope.selectedQuantityChange = function(){
            delete $scope.selected['IMEINumber'];
            vm.IMEINumber1 = [];
            $scope.selectedValueChange();
        }

        $scope.selectedValueChange = function(){
            $scope.purchase.rndOFF = 0;
            if($scope.showSCGST){
                if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                    $scope.selected.srate = ((parseFloat($scope.selected.quantity) * (parseFloat($scope.selected.cost) * parseFloat($scope.selected.sgst))) / 100).toFixed(2);
                    $scope.selected.total = ((2 * parseFloat($scope.selected.srate)) + (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost))).toFixed(2);
                    $scope.purchase.grossValue = (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost)).toFixed(2);
                    $scope.purchase.totalQuantity = $scope.selected.quantity;
                } else{
                    $scope.selected.srate = 0;
                    $scope.selected.total = 0;
                    $scope.purchase.grossValue = 0;
                    $scope.purchase.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.selected.total;
                $scope.purchase.SGST = $scope.selected.srate;
                for(var i = 0; i < vm.products.length; i++){
                    if(vm.products[i].id != $scope.selected.id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.purchase.SGST = (parseFloat($scope.purchase.SGST) + parseFloat(vm.products[i].srate)).toFixed(2);
                    }
                }
                if($scope.product.quantity && $scope.product.cost && $scope.product.sgst){
                    $scope.grossAmount = (parseFloat($scope.product.total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.purchase.totalQuantity = parseFloat($scope.product.quantity) + parseFloat($scope.purchase.totalQuantity);
                    $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.product.quantity) * parseFloat($scope.product.cost);
                    $scope.purchase.SGST = (parseFloat($scope.purchase.SGST) + parseFloat($scope.product.srate)).toFixed(2);
                }
                $scope.purchase.netValue = $scope.grossAmount;
            } else{
                if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                    $scope.selected.irate = ((parseFloat($scope.selected.quantity) * (parseFloat($scope.selected.cost) * parseFloat($scope.selected.igst))) / 100).toFixed(2);
                    $scope.selected.total = (parseFloat($scope.selected.irate) + (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost))).toFixed(2);
                    $scope.purchase.grossValue = (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost)).toFixed(2);
                    $scope.purchase.totalQuantity = $scope.selected.quantity;
                } else{
                    $scope.selected.irate = 0;
                    $scope.selected.total = 0;
                    $scope.purchase.grossValue = 0;
                    $scope.purchase.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.selected.total;
                $scope.purchase.IGST = $scope.selected.irate;
                for(var i = 0; i < vm.products.length; i++){
                    if($scope.selected.id != vm.products[i].id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.purchase.IGST = (parseFloat($scope.purchase.IGST) + parseFloat(vm.products[i].irate)).toFixed(2);
                    }
                }
                if($scope.product.quantity && $scope.product.cost && $scope.product.igst){
                    $scope.grossAmount = (parseFloat($scope.product.total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.purchase.totalQuantity = parseFloat($scope.product.quantity) + parseFloat($scope.purchase.totalQuantity);
                    $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.product.quantity) * parseFloat($scope.product.cost);
                    $scope.purchase.IGST = (parseFloat($scope.purchase.IGST) + parseFloat($scope.product.irate)).toFixed(2);
                }
                $scope.purchase.netValue = $scope.grossAmount;
            }
        }

        $scope.saveProduct = function(){
            if(($scope.selected.name) && ($scope.selected.quantity) && ($scope.selected.cost > 0) && ($scope.selected.total > 0)){
                var itemIndex = $scope.prodItemClone.findIndex(x => x._id == $scope.selected.name);
                var prodIndex = vm.products.findIndex(x => x.id == $scope.selected.id);
                if(prodIndex >= 0){
                    var checkIMEI = 0;
                    if(scope.prodItemClone[itemIndex].IMEINumLen){
                        if(vm.IMEINumber1.length != $scope.selected.quantity){
                            checkIMEI = 1;
                        }
                    }
                    if(checkIMEI == 0){
                        vm.products[prodIndex] = $scope.selected;
                        if($scope.showSCGST == true){
                            $scope.purchase.CGST = $scope.purchase.SGST;
                            vm.products[prodIndex]['cgst'] = $scope.selected.sgst;
                            $scope.purchase.IGST = undefined;
                            delete vm.products[prodIndex]['igst'];
                            delete vm.products[prodIndex]['irate'];
                        } else{
                            $scope.purchase.SGST = undefined;
                            $scope.purchase.CGST = undefined;
                            delete vm.products[prodIndex]['sgst'];
                            delete vm.products[prodIndex]['srate'];
                        }
                        if($scope.prodItemClone[itemIndex].IMEINumLen){
                            vm.products[vm.products.length - 1]['IMEINumber'] = vm.IMEINumber1;
                            imeiNumber = imeiNumber.filter(x => x.id != prod.id);
                            imeiNumber = imeiNumber.concat(imeiNumber2);
                        }
                        vm.products[prodIndex]['name'] = $scope.prodItemClone[itemIndex]._id;
                        vm.products[prodIndex]['nameId'] = $scope.prodItemClone[itemIndex].itemName + $scope.prodItemClone[itemIndex].name;
                        $scope.selected = {};
                        $scope.$broadcast('angucomplete-alt:clearInput', 'aa2');
                        vm.IMEINumber1 = [];
                    } else{

                    }
                }
            } else{
                swal('', 'Select Item \ Model Name, Quantity, Rate and GST');
            }
        }

        $scope.cancelProduct = function(){
            $scope.selected = {};
        }

        $scope.deleteProduct = function(index){
            imeiNumber = imeiNumber.filter(function( obj ) {
                return obj.id !== vm.products[index].id;
            });
            vm.products.splice(index,1);
            $scope.purchase.rndOFF = 0;
            if($scope.product.cost > 0){
                $scope.valueChange();
            } else{
                $scope.grossAmount = 0;
                $scope.purchase.totalQuantity = 0;
                $scope.purchase.netValue = 0;
                $scope.purchase.grossValue = 0;
                if($scope.showSCGST == true){
                    $scope.purchase.SGST = (0).toFixed(2);
                    for(var i = 0; i < vm.products.length; i++){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.purchase.netValue = $scope.grossAmount;
                        $scope.purchase.SGST = parseFloat($scope.purchase.SGST) + parseFloat(vm.products[i].srate);
                    }
                    $scope.purchase.CGST = $scope.purchase.SGST;
                } else{
                    $scope.purchase.IGST = (0).toFixed(2);
                    for(var i = 0; i < vm.products.length; i++){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.purchase.netValue = $scope.grossAmount;
                        $scope.purchase.IGST = parseFloat($scope.purchase.IGST) + parseFloat(vm.products[i].irate);
                    }
                }
            }
            if(vm.products.length == 0){
                $scope.disableSupplier = false;
            }
        }

        $scope.adjusTotal = function(){
            if($scope.purchase.rndOFF){
                if(($scope.purchase.rndOFF < 1) && ($scope.purchase.rndOFF > -1)){
                    $scope.purchase.netValue = (parseFloat($scope.grossAmount) + parseFloat($scope.purchase.rndOFF)).toFixed(2);
                } else{
                    swal('', 'Value must be less than 1 and greater than -1');
                    $scope.purchase.rndOFF = 0;
                }
            } else{
                $scope.purchase.netValue = $scope.grossAmount;
            }
        }

        $scope.openIMEInoDialog = function(prod){
            if($scope.product.nameId.title){
                if($scope.product.nameId.originalObject.IMEINumLen){
                    var productItem = $scope.product.nameId.originalObject;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'IMEInoContent.html',
                        backdrop: 'static',
                        keyboard: false,
                        controller: function IMEInoController($scope, $uibModalInstance){

                            $scope.spName = vm.spName;
                            $scope.prodIte = productItem;
                            $scope.quantity = prod.quantity;
                            $scope.IMEINumber = [];
                            var imno1=imeiNumber1.map(a => a.imno);

                            for(var i=0; i<$scope.quantity; i++){
                                $scope.IMEINumber[i] = [];
                            }

                            if(vm.IMEINumber.length){
                                $scope.IMEINumber = vm.IMEINumber.map(a => a.IMEI);
                            }


                            $scope.getNumber = function(num){
                                return new Array(num);   
                            }

                            $scope.saveImei = function(){
                                imeiNumber1 = [];
                                $scope.IMEINumber1 = [];
                                var imeiError = "", imno=imeiNumber.map(a => a.imno);
                                for(var i=0; i<$scope.IMEINumber.length; i++){
                                    var validIMEI = [];
                                    for(var j=0; j<$scope.IMEINumber[i].length; j++){
                                        var imei = $scope.IMEINumber[i][j].toString().replace(/[\s]/g, '');
                                        // if(imei.match(/^[0-9]+$/) != null){
                                        if(imei.length === $scope.prodIte.IMEINumLen){
                                            if((imno1.indexOf(imei) < 0) && (imno.indexOf(imei) < 0)){
                                                validIMEI.push(imei);
                                                imeiNumber1.push({id:productid,imno:imei});
                                            } else{
                                                imeiError = imeiError + imei + ' -> already imei exist, ';
                                            }
                                        } else{
                                            imeiError = imeiError + imei + ' -> length not exist ,';
                                        }
                                        // }  else{
                                        //     imeiError = imeiError + imei + ' -> invalid Numbers ,';
                                        // }
                                    }
                                    if(validIMEI.length === $scope.prodIte.prodName.IMEINumCount){
                                        $scope.IMEINumber1.push({IMEI: validIMEI, pp:invoDate});
                                    }
                                }
                                if($scope.IMEINumber1.length === $scope.quantity){
                                    vm.IMEINumber = $scope.IMEINumber1;
                                    $scope.close();
                                } else{
                                    swal('Invalid ' + vm.spName[1], imeiError);
                                }
                            }

                            $scope.close = function(){
                                $uibModalInstance.close();
                            }
                        }
                    });
                }
            } else {
                swal('', 'No Matching Product Item found');
            }
        }

        $scope.openEditedIMEInoDialog = function(prod){
            if($scope.selected.name){
                var itemIndex = $scope.prodItemClone.findIndex(x => x._id == $scope.selected.name);
                if(itemIndex >= 0){
                    if($scope.prodItemClone[itemIndex].IMEINumLen){
                        var productItem = $scope.prodItemClone[itemIndex];
                        var modalInstance = $uibModal.open({
                            templateUrl: 'IMEInoContent.html',
                            backdrop: 'static',
                            keyboard: false,
                            controller: function IMEInoController($scope, $uibModalInstance){

                                $scope.spName = vm.spName;
                                $scope.prodIte = productItem;
                                $scope.quantity = prod.quantity;
                                $scope.IMEINumber = [];
                                var imno1 = imeiNumber1.filter(x => x.id != prod.id);

                                for(var i=0; i<$scope.quantity; i++){
                                    $scope.IMEINumber[i] = [];
                                }

                                if(vm.IMEINumber1.length){
                                    $scope.IMEINumber = vm.IMEINumber1.map(a => a.IMEI);
                                }


                                $scope.getNumber = function(num){
                                    return new Array(num);   
                                }

                                $scope.saveImei = function(){
                                    imeiNumber2 = [];
                                    $scope.IMEINumber1 = [];
                                    var imeiError = "", imno=imeiNumber.map(a => a.imno);
                                    for(var i=0; i<$scope.IMEINumber.length; i++){
                                        var validIMEI = [];
                                        for(var j=0; j<$scope.IMEINumber[i].length; j++){
                                            var imei = $scope.IMEINumber[i][j].toString().replace(/[\s]/g, '');
                                            // if(imei.match(/^[0-9]+$/) != null){
                                                if(imei.length === $scope.prodIte.IMEINumLen){
                                                    if((imno1.indexOf(imei) < 0) && (imno.indexOf(imei) < 0)){
                                                        validIMEI.push(imei);
                                                        imeiNumber2.push({id:prod.id,imno:imei});
                                                    } else{
                                                        imeiError = imeiError + imei + ' -> already imei exist, ';
                                                    }
                                                } else{
                                                    imeiError = imeiError + imei + ' -> length not exist ,';
                                                }
                                            // }  else{
                                            //     imeiError = imeiError + imei + ' -> invalid Numbers ,';
                                            // }
                                        }
                                        if(validIMEI.length === $scope.prodIte.prodName.IMEINumCount){
                                            $scope.IMEINumber1.push({IMEI: validIMEI, pp:invoDate});
                                        }
                                    }
                                    if($scope.IMEINumber1.length === $scope.quantity){
                                        vm.IMEINumber1 = $scope.IMEINumber1;
                                        $scope.close();
                                    } else{
                                        swal('Invalid ' + vm.spName[1], imeiError);
                                    }
                                }

                                $scope.close = function(){
                                    $uibModalInstance.close();
                                }
                            }
                        });
                    }
                } else{
                    swal('', 'No Matching Product Item found');
                }
            } else {
                swal('', 'Select Item / Model');
            }
        }

        $scope.savePurchase = function(){
            if(!$scope.selected.name){
                if($scope.preError != ''){
                    sweetAlertWarning('DATA NOT FOUND', $scope.preError);
                } else{
                    var checkNumber = 0;
                    if($scope.product.nameId.title){
                        $scope.addProduct();
                    }
                    for (var i = 0; i < vm.products.length; i++) {
                        var itemIndex = $scope.productItems.findIndex(x => x._id == vm.products[i].name);
                        if($scope.productItems[itemIndex].IMEINumLen){
                            if(vm.products[i].IMEINumber.length != vm.products[i].quantity){
                                checkNumber = 1;
                            }
                        }
                    }
                    if(checkNumber == 0){
                        if(vm.products.length == 0){
                            swal('', 'Add Item');
                        } else if($scope.checkIMEI == 0){
                            $scope.purchase.item = vm.products;
                            $scope.purchase.itemClone = vm.products;
                            if(imeiNumber.length){
                                swal({text:"Validating " + vm.spName[1], showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                                InventoryService.IMEIduplication({uploadIMEI:imeiNumber.map(a => a.imno)}).then(function(res){
                                    swal.close();
                                    if(res.data.length){
                                        var duplicateIMEI = '';
                                        var imno = imeiNumber.map(a => a.imno);
                                        for(var i=0; i<res.data.length; i++){
                                            for(var j=0; j<res.data[i].IMEI.length; j++){
                                                if(imno.indexOf(res.data[i].IMEI[j]) >= 0){
                                                    duplicateIMEI = duplicateIMEI + res.data[i].IMEI[j] + '; ';
                                                }
                                            }
                                        }
                                        swal('Duplicate IMEI', duplicateIMEI);
                                    } else{
                                        savePurchase();
                                    }
                                });
                            }
                        } else{
                            swal('', 'Add Last Item');
                        }
                    } else{
                        swal('', vm.spName[1] + ' is not equal to quantity');
                    }
                }
            } else{
                swal('', 'Save Editing Item \ Model');
            }
        }

        function savePurchase(){
            swal({text:"Save Purchase", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
            InventoryService.savePurchaseDc($scope.purchase).then(function(res){
                if(res.data){
                    swal.close();
                    $scope.cancelPurchase();
                }
            });
        }

        $scope.cancelPurchase = function(){
            $state.reload();
        }
    }
})();