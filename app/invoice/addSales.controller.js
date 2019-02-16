(function() {
    'use strict';
	angular.module('app').controller('AddSales.IndexController', addSalesController);

    function addSalesController(InventoryService, MasterService, SettingService, ClientService, UserService, $state, $scope, $filter, $uibModal){

        var vm=this, getActiveObj={active:true}, companyStateCode;
        vm.cancelSales = cancelSales;
        loadDefault();

        function loadDefault(){
            vm.spName = ['Stock Point', 'Serial Number'];
            $scope.sales = {};
            vm.products = [];
            $scope.product = {};
            $scope.selected = {};
            $scope.product.nameId = {};
            $scope.sales.category = [];
            $scope.sales.totalQuantity = 0;
            $scope.grossAmount = 0;
            $scope.sales.netValue = 0;
            $scope.sales.grossValue = 0;
            $scope.grossAmount = 0;
            $scope.sales.CGST = 0;
            $scope.sales.SGST = 0;
            $scope.sales.IGST = 0;
            $scope.checkProduct = 0;
            $scope.productid = 0;
            $scope.preError = '';
            vm.salePointChange = salePointChange;
            initController();
        }

        function initController(){            
            MasterService.readSalePoint(getActiveObj).then(function(res){
                if(res.data){
                    $scope.salePoints = res.data;
                    refreshPicker();
                }
            });

            ClientService.readClient(getActiveObj).then(function(res){
                if(res.data){
                    $scope.clients = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductItem(getActiveObj).then(function(res){
                if(res.data){
                    $scope.productItems = res.data;
                }
            });

            MasterService.readFinancialYear(getActiveObj).then(function(res){
                $scope.finYears = res.data;
                if(res.data.length != 0){
                    $scope.sales.finYear = $scope.finYears[$scope.finYears.findIndex(x => x.status == 1)]._id;
                }
            });

            MasterService.readProductName(getActiveObj).then(function(res){
                if(res.data){
                    $scope.categories = res.data;
                }
                refreshPicker();
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
                                $scope.sales.salePoint =  res.data[0].default.stockPoint;
                                salePointChange();
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
                    $scope.sales.code = res.data.code;
                }
            });
        }

        function genetrateNumber(){
            $scope.sales.invoiceDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            angular.element($('#billDate')).val($filter('date')(new Date(), 'yyyy-MM-dd'));
            InventoryService.readSalesInvoice().then(function(res){
                if(res.data.sale){
                    if(res.data.sale === 'empty'){
                        $scope.preError = $scope.preError + 'Enter sale bill format in setting page.\n';
                    } else{
                        $scope.sales.invoiceNumber = res.data.sale;
                        $scope.sales.billno = res.data.sale;
                    }
                }
                if($scope.preError != ''){
                    sweetAlertWarning('DATA NOT FOUND', $scope.preError);
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){ 
                $('.selectpicker').selectpicker('refresh'); 
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        function sweetAlertWarning(tle, err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        $scope.back = function(){
            $state.go('invoice.sales',null,{reload: true});
        }

        $scope.clientChange = function(){
            $scope.showSCGST = false;
            $scope.showIGST = false;
            if($scope.sales.party){
                var cliInd = $scope.clients.findIndex(x => x._id == $scope.sales.party);
                UserService.getDealerAuthorID({refId: $scope.clients[cliInd]._id}).then(function(res){
                    $scope.sales.dealerUserID = res.data;
                });
                if(companyStateCode == $scope.clients[cliInd].shippingAddress.state.gstCode){
                    $scope.showSCGST = true;
                    $scope.showIGST = false;
                }else{
                    $scope.showIGST = true;
                    $scope.showSCGST = false;
                }
                if($scope.clients[cliInd].creditDays){
                    $scope.sales.creditDays = $scope.clients[cliInd].creditDays;
                } else{
                    $scope.sales.creditDays = undefined;
                }
            }
        }

        function salePointChange(){
            $scope.purchaseItems = [];
            if($scope.sales.salePoint){
                InventoryService.readPurchaseItems({salePoint: $scope.sales.salePoint}).then(function(res){
                    if(res.data){
                        $scope.purchaseItems = res.data;
                        $scope.categoryChange();$
                    }
                });
            }
        }

        $scope.categoryChange = function(){
            $scope.prodItemClone = [];
            if($scope.sales.category.length){
                for(var i = 0; i < $scope.sales.category.length; i++){
                    for(var j = 0; j < $scope.productItems.length; j++){
                        if($scope.sales.category[i] == $scope.productItems[j].prodName._id){
                            var purIndex = $scope.purchaseItems.findIndex(x => x.name._id == $scope.productItems[j]._id);
                            if(purIndex >= 0){
                                $scope.prodItemClone.push($scope.productItems[j]);
                            }
                        }
                    }
                }
            }
        }

        $scope.itemChange = function(nameId){
            vm.IMEINumber = [];
            vm.IMEINumber1 = [];
            vm.boxNumber = [];
            delete $scope.product['IMEINumber'];
            if(nameId){
                $scope.product.nameId = nameId;
                var checkItem = 0;
                for (var i = 0; i < vm.products.length; i++) {
                    if(vm.products[i].nameId == $scope.product.nameId.title){
                        checkItem = 1;
                    }
                }
                if($scope.selected.name == $scope.product.nameId.originalObject._id){
                    checkItem = 1;
                }
                if(checkItem == 0){
                    $scope.product.quantity = 1;
                    $scope.product.cost = $scope.product.nameId.originalObject.sellPrice;
                    $scope.product.sgst = $scope.product.nameId.originalObject.prodName.type.taxRate / 2;
                    $scope.product.igst = $scope.product.nameId.originalObject.prodName.type.taxRate;
                    $scope.valueChange();
                } else{
                    $scope.$broadcast('angucomplete-alt:clearInput', 'aa1');
                    $scope.product.nameId = {};
                    swal('', 'Already Item Exist');
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

        $scope.valueChange = function(){
            $scope.sales.rndOFF = 0;
            if($scope.showSCGST == true){
                if($scope.product.quantity && $scope.product.cost && $scope.product.sgst){
                    $scope.product.srate = ((parseFloat($scope.product.quantity) * (parseFloat($scope.product.cost) * parseFloat($scope.product.sgst))) / 100).toFixed(2);
                    $scope.product.total = ((2 * parseFloat($scope.product.srate)) + (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost))).toFixed(2);
                    $scope.sales.grossValue = (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost)).toFixed(2);
                    $scope.sales.totalQuantity = $scope.product.quantity;
                } else{
                    $scope.product.srate = 0;
                    $scope.product.total = 0;
                    $scope.sales.grossValue = 0;
                    $scope.sales.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.product.total;
                $scope.sales.SGST = $scope.product.srate;
                for(var i = 0; i < vm.products.length; i++){
                    if($scope.selected.id != vm.products[i].id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.sales.SGST = (parseFloat($scope.sales.SGST) + parseFloat(vm.products[i].srate)).toFixed(2);
                    } else{
                        if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                            $scope.grossAmount = (parseFloat($scope.selected.total) + parseFloat($scope.grossAmount)).toFixed(2);
                            $scope.sales.totalQuantity = parseFloat($scope.selected.quantity) + parseFloat($scope.sales.totalQuantity);
                            $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost);
                            $scope.sales.SGST = (parseFloat($scope.sales.SGST) + parseFloat($scope.selected.srate)).toFixed(2);
                        }
                    }
                }
                $scope.sales.netValue = $scope.grossAmount;
            } else{
                if($scope.product.quantity && $scope.product.cost && $scope.product.igst){
                    $scope.product.irate = ((parseFloat($scope.product.quantity) * (parseFloat($scope.product.cost) * parseFloat($scope.product.igst))) / 100).toFixed(2);
                    $scope.product.total = (parseFloat($scope.product.irate) + (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost))).toFixed(2);
                    $scope.sales.grossValue = (parseFloat($scope.product.quantity) * parseFloat($scope.product.cost)).toFixed(2);
                    $scope.sales.totalQuantity = $scope.product.quantity;
                } else{
                    $scope.product.irate = 0;
                    $scope.product.total = 0;
                    $scope.sales.grossValue = 0;
                    $scope.sales.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.product.total;
                $scope.sales.IGST = $scope.product.irate;
                for(var i = 0; i < vm.products.length; i++){
                    if($scope.selected.id != vm.products[i].id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.sales.IGST = (parseFloat($scope.sales.IGST) + parseFloat(vm.products[i].irate)).toFixed(2);
                    } else{
                        $scope.grossAmount = (parseFloat($scope.selected.total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat($scope.selected.quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost);
                        $scope.sales.IGST = (parseFloat($scope.sales.IGST) + parseFloat($scope.selected.irate)).toFixed(2);
                    }
                }
                $scope.sales.netValue = $scope.grossAmount;
            }
        }

        $scope.addProduct = function(){
            $scope.checkProduct = 0;
            if(($scope.sales.party) && ($scope.sales.salePoint) && ($scope.product.nameId.title) && ($scope.product.quantity > 0) && ($scope.product.cost > 0) && ($scope.product.total > 0)){
                var purIndex = $scope.purchaseItems.findIndex(x => x.name._id == $scope.product.nameId.originalObject._id);
                if($scope.purchaseItems[purIndex].quantity >= $scope.product.quantity){
                    if($scope.product.nameId.originalObject.IMEINumLen){
                        if(vm.IMEINumber.length != $scope.product.quantity){
                            $scope.checkProduct = 1;
                        }
                    }
                    if($scope.checkProduct == 0){
                        $scope.disableInput = true;
                        vm.products.push($scope.product);
                        if($scope.showSCGST == true){
                            $scope.sales.CGST = $scope.sales.SGST;
                            vm.products[vm.products.length - 1]['cgst'] = $scope.product.sgst;
                            $scope.sales.IGST = undefined;
                            delete vm.products[vm.products.length - 1]['igst'];
                            delete vm.products[vm.products.length - 1]['irate'];
                        } else{
                            $scope.sales.SGST = undefined;
                            $scope.sales.CGST = undefined;
                            delete vm.products[vm.products.length - 1]['sgst'];
                            delete vm.products[vm.products.length - 1]['srate'];
                        }
                        if($scope.product.nameId.originalObject.IMEINumLen){
                            vm.products[vm.products.length - 1]['IMEINumber'] = vm.IMEINumber1;
                            vm.products[vm.products.length - 1]['boxNumber'] = vm.boxNumber;
                        }
                        vm.products[vm.products.length - 1]['name'] = $scope.product.nameId.originalObject._id;
                        vm.products[vm.products.length - 1]['nameId'] = $scope.product.nameId.title;
                        vm.products[vm.products.length - 1]['id'] = $scope.productid;
                        $scope.product = {};
                        $scope.product.nameId = {};
                        $scope.$broadcast('angucomplete-alt:clearInput', 'aa1');
                        vm.IMEINumber = [];
                        vm.IMEINumber1 = [];
                        vm.boxNumber = [];
                        $scope.productid = $scope.productid + 1;
                    }else{
                        swal('', 'Select ' + vm.spName[1]);
                        $scope.checkProduct = 1;
                    }
                } else{
                    swal('', 'Adjust Quantity Size');
                    $scope.checkProduct = 1;
                }
            } else{
                swal('', 'Select Client, ' + vm.spName[0] + ' and Item');
                $scope.checkProduct = 1;
            }
            refreshPicker();
        }

        $scope.getProduct = function(product){
            if($scope.selected.id == product.id){
                return 'edit'
            } else{
                return 'display';
            }
        }

        $scope.editProduct = function(product){
            $scope.selected = product;
            if($scope.selected['IMEINumber']){
                vm.IMEINumberClone = $scope.selected['IMEINumber'];
                vm.IMEINumberClone1 = $scope.selected['IMEINumber'];
                vm.boxNumberClone = $scope.selected['boxNumber'];
            }
        }

        
        $scope.selectedItemChange = function(nameId){
            vm.IMEINumberClone = [];
            vm.IMEINumberClone1 = [];
            vm.boxNumberClone = [];
            delete $scope.selected['IMEINumber'];
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
            vm.IMEINumberClone = [];
            vm.IMEINumberClone1 = [];
            vm.boxNumberClone = [];
            delete $scope.selected['IMEINumber'];
            $scope.selectedValueChange();
        }

        $scope.selectedValueChange = function(){
            $scope.sales.rndOFF = 0;
            if($scope.showSCGST){
                if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                    $scope.selected.srate = ((parseFloat($scope.selected.quantity) * (parseFloat($scope.selected.cost) * parseFloat($scope.selected.sgst))) / 100).toFixed(2);
                    $scope.selected.total = ((2 * parseFloat($scope.selected.srate)) + (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost))).toFixed(2);
                    $scope.sales.grossValue = (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost)).toFixed(2);
                    $scope.sales.totalQuantity = $scope.selected.quantity;
                } else{
                    $scope.selected.srate = 0;
                    $scope.selected.total = 0;
                    $scope.sales.grossValue = 0;
                    $scope.sales.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.selected.total;
                $scope.sales.SGST = $scope.selected.srate;
                for(var i = 0; i < vm.products.length; i++){
                    if(vm.products[i].id != $scope.selected.id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.sales.SGST = (parseFloat($scope.sales.SGST) + parseFloat(vm.products[i].srate)).toFixed(2);
                    }
                }
                if($scope.product.quantity && $scope.product.cost && $scope.product.sgst){
                    $scope.grossAmount = (parseFloat($scope.product.total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.sales.totalQuantity = parseFloat($scope.product.quantity) + parseFloat($scope.sales.totalQuantity);
                    $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat($scope.product.quantity) * parseFloat($scope.product.cost);
                    $scope.sales.SGST = (parseFloat($scope.sales.SGST) + parseFloat($scope.product.srate)).toFixed(2);
                }
                $scope.sales.netValue = $scope.grossAmount;
            } else{
                if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                    $scope.selected.irate = ((parseFloat($scope.selected.quantity) * (parseFloat($scope.selected.cost) * parseFloat($scope.selected.igst))) / 100).toFixed(2);
                    $scope.selected.total = (parseFloat($scope.selected.irate) + (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost))).toFixed(2);
                    $scope.sales.grossValue = (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost)).toFixed(2);
                    $scope.sales.totalQuantity = $scope.selected.quantity;
                } else{
                    $scope.selected.irate = 0;
                    $scope.selected.total = 0;
                    $scope.sales.grossValue = 0;
                    $scope.sales.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.selected.total;
                $scope.sales.IGST = $scope.selected.irate;
                for(var i = 0; i < vm.products.length; i++){
                    if($scope.selected.id != vm.products[i].id){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.sales.IGST = (parseFloat($scope.sales.IGST) + parseFloat(vm.products[i].irate)).toFixed(2);
                    }
                }
                if($scope.product.quantity && $scope.product.cost && $scope.product.igst){
                    $scope.grossAmount = (parseFloat($scope.product.total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.sales.totalQuantity = parseFloat($scope.product.quantity) + parseFloat($scope.sales.totalQuantity);
                    $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat($scope.product.quantity) * parseFloat($scope.product.cost);
                    $scope.sales.IGST = (parseFloat($scope.sales.IGST) + parseFloat($scope.product.irate)).toFixed(2);
                }
                $scope.sales.netValue = $scope.grossAmount;
            }
        }

        $scope.cancelProduct = function(){
            $scope.selected = {};
        }

        $scope.saveProduct = function(){
            var checkProduct = 0;
            if(($scope.selected.name) && ($scope.selected.quantity) && ($scope.selected.cost) && ($scope.selected.total)){
                var itemIndex=$scope.prodItemClone.findIndex(x => x._id == $scope.selected.name), purIndex=$scope.purchaseItems.findIndex(x => x.name._id == $scope.selected.name);
                if($scope.purchaseItems[purIndex].quantity >= $scope.selected.quantity){
                    if($scope.prodItemClone[itemIndex].IMEINumLen){
                        if(vm.IMEINumberClone.length != $scope.selected.quantity){
                            checkProduct = 1;
                        }
                    }
                    if(checkProduct == 0){
                        var prodIndex = vm.products.findIndex(x => x.id == $scope.selected.id);
                        if(prodIndex >= 0){
                            vm.products[prodIndex] = $scope.selected;
                            if($scope.showSCGST == true){
                                $scope.sales.CGST = $scope.sales.SGST;
                                vm.products[prodIndex]['cgst'] = $scope.selected.sgst;
                                $scope.sales.IGST = undefined;
                                delete vm.products[prodIndex]['igst'];
                                delete vm.products[prodIndex]['irate'];
                            } else{
                                $scope.sales.SGST = undefined;
                                $scope.sales.CGST = undefined;
                                delete vm.products[prodIndex]['sgst'];
                                delete vm.products[prodIndex]['srate'];
                            }
                            if($scope.prodItemClone[itemIndex].IMEINumLen){
                                vm.products[prodIndex]['IMEINumber'] = vm.IMEINumberClone1;
                                vm.products[prodIndex]['boxNumber'] = vm.boxNumberClone;
                            }
                            vm.products[prodIndex]['name'] = $scope.prodItemClone[itemIndex]._id;
                            vm.products[prodIndex]['nameId'] = $scope.prodItemClone[itemIndex].itemName + $scope.prodItemClone[itemIndex].name;
                            $scope.selected = {};
                            $scope.$broadcast('angucomplete-alt:clearInput', 'aa2');
                            vm.IMEINumberClone = [];
                            vm.IMEINumberClone1 = [];
                            vm.boxNumberClone = [];
                        }
                    } else{
                        swal('', 'Select ' + vm.spName[1]);
                    }
                } else{
                    swal('', 'Adjust Quantity Size');
                }
            } else{
                swal('', 'Select Item \ Model Name, Quantity, Rate and GST');
            }
        }

        $scope.deleteProduct = function(index){
            vm.products.splice(index,1);
            $scope.sales.rndOFF = 0;
            if($scope.product.cost > 0){
                $scope.valueChange();
            } else{
                $scope.grossAmount = 0;
                $scope.sales.totalQuantity = 0;
                $scope.sales.netValue = 0;
                $scope.sales.grossValue = 0;
                if($scope.showSCGST == true){
                    $scope.sales.SGST = (0).toFixed(2);
                    for(var i = 0; i < vm.products.length; i++){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.sales.netValue = $scope.grossAmount;
                        $scope.sales.SGST = parseFloat($scope.sales.SGST) + parseFloat(vm.products[i].srate);
                    }
                    $scope.sales.CGST = $scope.sales.SGST;
                } else{
                    $scope.sales.IGST = (0).toFixed(2);
                    for(var i = 0; i < vm.products.length; i++){
                        $scope.grossAmount = (parseFloat(vm.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sales.totalQuantity = parseFloat(vm.products[i].quantity) + parseFloat($scope.sales.totalQuantity);
                        $scope.sales.grossValue = parseFloat($scope.sales.grossValue) + parseFloat(vm.products[i].quantity) * parseFloat(vm.products[i].cost);
                        $scope.sales.netValue = $scope.grossAmount;
                        $scope.sales.IGST = parseFloat($scope.sales.IGST) + parseFloat(vm.products[i].irate);
                    }
                }
            }
            if(vm.products.length == 0){
                $scope.disableInput = false;
                refreshPicker();
            }
        }

        $scope.openIMEInoDialog = function(prod){
            if($scope.product.nameId.title){
                if($scope.product.nameId.originalObject.IMEINumLen){
                    var salepoint=$scope.sales.salePoint, productItem=$scope.product.nameId.originalObject, purIndex=$scope.purchaseItems.findIndex(x => x.name._id == $scope.product.nameId.originalObject._id);
                    if($scope.purchaseItems[purIndex].quantity >= prod.quantity){
                        var modalInstance = $uibModal.open({
                            templateUrl: 'IMEInoContent.html',
                            backdrop: 'static',
                            keyboard: false,
                            controller: function IMEInoController(InventoryService, $scope, $uibModalInstance, $filter){
                                $scope.spName = vm.spName;
                                $scope.prodIte = productItem;
                                var imeis=[], cartnoCopy=[];
                                $scope.boxNumber = [];
                                controllerPicker();

                                InventoryService.readIMEIboxNumber({item: productItem._id,sp: salepoint}).then(function(res){
                                    if(res.data.length){
                                        imeis = res.data[0].IMEINumber;
                                        var unique = [];
                                        imeis.map(a => a.boxno).forEach(function(i){
                                            if(i){
                                                if(!unique[i]){
                                                    unique[i] = true;
                                                }
                                            }
                                        });
                                        $scope.boxNumber = Object.keys(unique);
                                    }
                                    controllerPicker();
                                });
                                $scope.selectedIMEI = vm.IMEINumber;
                                $scope.imeiNumbers = vm.IMEINumber;
                                $scope.cartno = vm.boxNumber;
                                
                                function controllerPicker(){
                                    angular.element(document).ready(function(){ 
                                        $('.selectpicker').selectpicker("refresh");
                                    });
                                }

                                $scope.close = function(){
                                    $uibModalInstance.close();
                                }

                                $scope.selectBoxno = function(){
                                    var selectIMEI1 = [], selectIMEI2 = [];
                                    $scope.imeiNumbers = [];
                                    for(var i = 0;i < $scope.cartno.length; i++){
                                        var cartMatch = false;
                                        for(var j = 0;j < cartnoCopy.length; j++){
                                            if($scope.cartno[i] == cartnoCopy[j]){
                                                cartMatch = true;
                                            }
                                        }
                                        if(cartMatch){
                                            var result2=[], result1=[];
                                            result2 = imeis.filter(obj => {
                                                return obj.boxno == $scope.cartno[i]
                                            });
                                            $scope.imeiNumbers = $scope.imeiNumbers.concat(result2);
                                            result1 = $scope.selectedIMEI.filter(obj => {
                                                return obj.boxno == $scope.cartno[i]
                                            });
                                            if(result1.length == result2.length){
                                                selectIMEI1 = selectIMEI1.concat(result1);
                                            } else{
                                                var result3 = [];
                                                for(var j = 0; j < result1.length; j++) {
                                                    for(var k = 0; k < result2.length; k++) {
                                                        if(JSON.stringify(result1[j].IMEI) == JSON.stringify(result2[k].IMEI)){
                                                            result3.push(result1[j]);
                                                            break;
                                                        }
                                                    }
                                                }
                                                selectIMEI1 = selectIMEI1.concat(result3);
                                            }
                                        } else {
                                            var result = [];
                                            result = imeis.filter(obj => {
                                                return obj.boxno == $scope.cartno[i]
                                            });
                                            $scope.imeiNumbers = $scope.imeiNumbers.concat(result);
                                            selectIMEI2 = selectIMEI2.concat(result);
                                        }
                                    }
                                    $scope.selectedIMEI = selectIMEI2.concat(selectIMEI1);
                                    cartnoCopy = $scope.cartno;
                                    controllerPicker();
                                }

                                $scope.saveIMEInumber = function(){
                                    if(prod.quantity === $scope.selectedIMEI.length){
                                        vm.IMEINumber = angular.copy($scope.selectedIMEI);
                                        vm.boxNumber = angular.copy($scope.cartno);
                                        vm.IMEINumber1 = angular.copy($scope.selectedIMEI);
                                        vm.IMEINumber1.map((obj) => {
                                            obj.ps = $filter('date')(new Date(), "yyyy-MM-dd");
                                            return obj;
                                        });
                                        $scope.close();
                                    }else{
                                        swal('','Select ' + prod.quantity + $scope.spName[1]);
                                    }
                                }
                            }
                        });
                    } else {
                        swal('', 'Quantity is too high,Total is ' + $scope.purchaseItems[purIndex].quantity);
                    }
                }
            } else {
                swal('', 'No Matching Product Item found');
            }
        }

        $scope.ChangedItemImeiDialog = function(prod){
            if($scope.selected.name){
                var itemIndex = $scope.prodItemClone.findIndex(x => x._id == $scope.selected.name);
                if(itemIndex >= 0){
                    var productItem = $scope.prodItemClone[itemIndex];
                    if(productItem.IMEINumLen){
                        var salepoint=$scope.sales.salePoint, purIndex=$scope.purchaseItems.findIndex(x => x.name._id == productItem._id);
                        if($scope.purchaseItems[purIndex].quantity >= prod.quantity){
                            var modalInstance = $uibModal.open({
                                templateUrl: 'IMEInoContent.html',
                                backdrop: 'static',
                                keyboard: false,
                                controller: function IMEInoController(InventoryService, $scope, $uibModalInstance, $filter){
                                    $scope.spName = vm.spName;
                                    $scope.prodIte = productItem;
                                    var imeis=[], cartnoCopy=[];
    
                                    InventoryService.readIMEIboxNumber({item:productItem._id, sp:salepoint}).then(function(res){
                                        if(res.data.length){
                                            imeis = res.data[0].IMEINumber;
                                            var unique = [];
                                            imeis.map(a => a.boxno).forEach(function(i){
                                                if(!unique[i]){
                                                    unique[i] = true;
                                                }
                                            });
                                            $scope.boxNumber = Object.keys(unique);
                                        }
                                        controllerPicker();
                                    });
                                    $scope.selectedIMEI = vm.IMEINumberClone;
                                    $scope.imeiNumbers = vm.IMEINumberClone;
                                    $scope.cartno = vm.boxNumberClone;
                                    
                                    function controllerPicker(){
                                        angular.element(document).ready(function(){ 
                                            $('.selectpicker').selectpicker("refresh");
                                        });
                                    }
    
                                    $scope.close = function(){
                                        $uibModalInstance.close();
                                    }
    
                                    $scope.selectBoxno = function(){
                                        var selectIMEI1=[], selectIMEI2=[];
                                        $scope.imeiNumbers = [];
                                        for(var i = 0;i < $scope.cartno.length; i++){
                                            var cartMatch = false;
                                            for(var j = 0;j < cartnoCopy.length; j++){
                                                if($scope.cartno[i] == cartnoCopy[j]){
                                                    cartMatch = true;
                                                }
                                            }
                                            if(cartMatch){
                                                var result2=[], result1=[];
                                                result2 = imeis.filter(obj => {
                                                    return obj.boxno == $scope.cartno[i]
                                                });
                                                $scope.imeiNumbers = $scope.imeiNumbers.concat(result2);
                                                result1 = $scope.selectedIMEI.filter(obj => {
                                                    return obj.boxno == $scope.cartno[i]
                                                });
                                                if(result1.length == result2.length){
                                                    selectIMEI1 = selectIMEI1.concat(result1);
                                                } else{
                                                    var result3 = [];
                                                    for(var j = 0; j < result1.length; j++) {
                                                        for(var k = 0; k < result2.length; k++) {
                                                            if(JSON.stringify(result1[j].IMEI) == JSON.stringify(result2[k].IMEI)){
                                                                result3.push(result1[j]);
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    selectIMEI1 = selectIMEI1.concat(result3);
                                                }
                                            } else {
                                                var result = [];
                                                result = imeis.filter(obj => {
                                                    return obj.boxno == $scope.cartno[i]
                                                });
                                                $scope.imeiNumbers = $scope.imeiNumbers.concat(result);
                                                selectIMEI2 = selectIMEI2.concat(result);
                                            }
                                        }
                                        $scope.selectedIMEI = selectIMEI2.concat(selectIMEI1);
                                        cartnoCopy = $scope.cartno;
                                        controllerPicker();
                                    }
    
                                    $scope.saveIMEInumber = function(){
                                        if(prod.quantity === $scope.selectedIMEI.length){
                                            vm.IMEINumberClone = angular.copy($scope.selectedIMEI);
                                            vm.boxNumberClone = angular.copy($scope.cartno);
                                            vm.IMEINumberClone1 = angular.copy($scope.selectedIMEI);
                                            vm.IMEINumberClone1.map((obj) => {
                                                obj.ps = $filter('date')(new Date(), "yyyy-MM-dd");
                                                return obj;
                                            });
                                            $scope.close();
                                        }else{
                                            swal('', 'Select ' + prod.quantity + $scope.spName[1]);
                                        }
                                    }
                                }
                            });
                        } else {
                            swal('', 'Quantity is too high,Total is ' + $scope.purchaseItems[purIndex].quantity);
                        }
                    }
                } else{
                    swal('', 'No Matching Product Item found');
                }
            } else {
                swal('', 'Select Item / Model');
            }
        }

        $scope.adjusTotal = function(){
            if($scope.sales.rndOFF){
                if(($scope.sales.rndOFF < 1) && ($scope.sales.rndOFF > -1)){
                    $scope.sales.netValue = (parseFloat($scope.grossAmount) + parseFloat($scope.sales.rndOFF)).toFixed(2);
                } else{
                    $scope.sales.rndOFF = 0;
                    swal('', 'Value must be less than 1 and greater than -1');
                }
            } else{
                $scope.sales.netValue = $scope.grossAmount;
            }
        }

        $scope.saveSales = function(){
            if(!$scope.selected.name){
                if(angular.element($('#billDate')).val()){
                    $scope.sales.billDate = angular.element($('#billDate')).val();
                } else{
                    $scope.sales.billDate = $scope.sales.invoiceDate;
                }
                if(!$scope.sales.billno){
                    $scope.sales.billno = $scope.sales.invoiceNumber;
                }
                if($scope.product.nameId.title){
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
                        swal('', 'Add Items');
                    }else{
                        swal({text:'Save Sales', showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                        $scope.sales.item = vm.products;
                        InventoryService.saveSales($scope.sales).then(function(res){
                            if(res.data){
                                swal.close();
                                // var totalQuantity=$scope.sales.totalQuantity;
                                var party=res.data.party, invNo=res.data.invoiceNumber, item_id=res.data.item;
                                var modalInstance = $uibModal.open({
                                    templateUrl: 'saveSales.html',
                                    windowClass: 'model-large',
                                    backdrop: 'static',
                                    keyboard: false,
                                    controller: function printExportController(ClientService, MasterService, $scope, $uibModalInstance){
                                        var vm = this;
                                        $scope.itemsList = [];
                                        $scope.buttons = vm.buttons;   
                                        ClientService.readClient().then(function(res){
                                            $scope.clientData = res.data;
                                            var rowslength = $scope.clientData.length;
                                            for(i=0;i<rowslength;i++){
                                                if(party===$scope.clientData[i]._id){
                                                    $scope.clientName=$scope.clientData[i].name;
                                                    if($scope.clientData[i].billingAddress){
                                                        $scope.billingAddress=$scope.clientData[i].billingAddress.address;
                                                        $scope.billingEmail=$scope.clientData[i].billingAddress.mail;
                                                        $scope.billingPincode=$scope.clientData[i].billingAddress.pincode;
                                                        $scope.billingPhone=$scope.clientData[i].billingAddress.phoneno;
                                                    }
                                                    if($scope.clientData[i].shippingAddress){
                                                        $scope.shippingAddress=$scope.clientData[i].shippingAddress.address
                                                        $scope.shippingEmail=$scope.clientData[i].shippingAddress.mail;
                                                        $scope.shippingPincode=$scope.clientData[i].shippingAddress.pincode;
                                                        $scope.shippingPhone=$scope.clientData[i].shippingAddress.phoneno;
                                                    }
                                                    if($scope.clientData[i].bankDetails){
                                                        $scope.bankName=$scope.clientData[i].bankDetails.bankName;
                                                        $scope.accountNumber=$scope.clientData[i].bankDetails.accountNumber;
                                                        $scope.ifsc=$scope.clientData[i].bankDetails.ifsc;
                                                        $scope.branchName=$scope.clientData[i].bankDetails.branchName;
                                                    }
                                                }
                                            }
                                        });
                                        MasterService.readProductItem().then(function(res) {
                                            $scope.items = res.data;
                                            var itemsLength= $scope.items.length;
                                            var itemArrayLength=item_id.length;
                                            for(var i=0;i<itemArrayLength;i++){
                                                for(var j=0;j<itemsLength;j++)
                                                if(item_id[i].name===$scope.items[j]._id){
                                                $scope.items[j]["tQty"]=item_id[i].quantity;
                                                $scope.items[j]["tax"]=item_id[i].igst;
                                                $scope.itemsList.push($scope.items[j]);
                                                }
                                                
                                            }
                                            
                                        });
                                        
                                        $scope.excelAlert = function(){
                                            // var doc = new jsPDF('p', 'pt', 'a4');
                                            // var specialElementHandlers = {
                                            //     '#editor': function(element, renderer){
                                            //         return true;
                                            //     }
                                            // }
                                            // doc.fromHTML($('#billPage').html(), 40, 80, {
                                            //     'width': 522,
                                            //     'elementHandlers': specialElementHandlers
                                            // });
                                            // doc.save('invoice.pdf');
                                        }

                                        $scope.printDiv = function(){
                                            var sTable = document.getElementById('billTable').innerHTML;
                                            var style = "<style>";
                                            style = style + "table {width: 100%;font: 17px Calibri;}";
                                            style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
                                            style = style + "padding: 2px 3px;text-align: center;}";
                                            style = style + "</style>";
                                            var win = window.open('', '', 'height=700,width=700');
                                            win.document.write('<html><head>');
                                            win.document.write('<title> ' + invNo + ' </title>');
                                            win.document.write(style);
                                            win.document.write('</head>');
                                            win.document.write('<body>');
                                            win.document.write(sTable);
                                            win.document.write('</body></html>');
                                            win.document.close();
                                            win.print();
                                        }

                                        $scope.close = function() {
                                            $uibModalInstance.close();
                                            cancelSales();
                                        }                           
                                    }
                                });
                            }
                        });
                    }
                } else{
                    swal('', 'Please Enter Correct Sale Invoice Details');
                }
            } else{
                swal('', 'Save Editing Item \ Model');
            }
        }

        function cancelSales(){
            $state.reload();
        }
    }
})();