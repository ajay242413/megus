(function() {
    'use strict';
    angular.module('app').controller('DcPurchaseBill.IndexController', dcPurchaseBillController);

    function dcPurchaseBillController(MasterService, InventoryService, SettingService, $state, $scope, $filter, $stateParams, $uibModal){

        var vm = this, activeObj = {active:true};
        $scope.purchase = {};
        vm.back = back;
        if(!$stateParams.obj){
            back();
        } else{
            InventoryService.readInventoryById({id: $stateParams.obj._id}).then(function(res){
                if(res.data){
                    $scope.pdc = res.data;
                    loaDefault();
                }
            });
        }

        function loaDefault(){
            $scope.purchase.category = [];
            $scope.purchase.grossValue = 0;
            $scope.purchase.netValue = 0;
            $scope.grossAmount = 0;
            $scope.purchase.totalQuantity = 0;
            $scope.selected = {};
            $scope.products = [];
            $scope.productid = 0;
            vm.spName = ['Stock Point', 'Serial Number'];
            $scope.preError = '';
            vm.IMEINumber = [];
            $scope.checkImei = 0;
            initController();
            initValues();
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
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            vm.spName[0] = res.data[0].format.stockPoint;
                        }
                        if(res.data[0].format.serial){
                            vm.spName[1] = res.data[0].format.serial;
                        }
                    }
                }
                refreshPicker();
                genetrateNumber();
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
            InventoryService.readPurchaseInvoice().then(function(res){
                if(res.data.purchase){
                    if(res.data.purchase == 'empty'){
                        $scope.preError = $scope.preError + 'Enter purchase bill format in setting page.\n';
                    } else{
                        $scope.purchase.invoiceNumber = res.data.purchase;
                    }
                    if($scope.preError != ''){
                        sweetAlertWarning('DATA NOT FOUND',$scope.preError);
                    }
                }
            });
        }

        function initValues(){
            $scope.purchase.party = $scope.pdc.party._id;
            $scope.purchase.salePoint = $scope.pdc.salePoint._id;
            $scope.purchase.billno = $scope.pdc.invoiceNumber;
            $scope.purchase.billDate = $scope.pdc.invoiceDate;
            for(var i=0; i<$scope.pdc.category.length; i++){
                $scope.purchase.category.push($scope.pdc.category[i]._id);
            }
            // $scope.products = angular.copy($scope.pdc.item);
            for(var i=0; i<$scope.pdc.item.length; i++){
                if($scope.pdc.item[i].quantity > 0){
                    $scope.products.push(angular.copy($scope.pdc.item[i]));
                }
            }
            if($scope.pdc.item[0].cgst){
                $scope.showSCGST = true;
                $scope.showIGST = false;
                $scope.purchase.SGST = 0;
                $scope.purchase.CGST = 0;
                for(var i=0; i<$scope.products.length; i++){
                    $scope.productid = $scope.productid + 1;
                    $scope.products[i].id = $scope.productid;
                    $scope.products[i].srate = ((parseFloat($scope.products[i].quantity) * (parseFloat($scope.products[i].cost) * parseFloat($scope.products[i].sgst))) / 100).toFixed(2);
                    $scope.products[i].total = ((2 * parseFloat($scope.products[i].srate)) + (parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost))).toFixed(2);
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.purchase.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                    $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.purchase.SGST = (parseFloat($scope.purchase.SGST) + parseFloat($scope.products[i].srate)).toFixed(2);
                    $scope.products[i].nameId = $scope.products[i].name.itemName;
                    $scope.products[i].name = $scope.products[i].name._id;
                }
            } else{
                $scope.showIGST = true;
                $scope.showSCGST = false;
                $scope.purchase.IGST = 0;
                for(var i=0; i<$scope.products.length; i++){
                    $scope.productid = $scope.productid + 1;
                    $scope.products[i].id = $scope.productid;
                    $scope.products[i].irate = ((parseFloat($scope.products[i].quantity) * (parseFloat($scope.products[i].cost) * parseFloat($scope.products[i].igst))) / 100).toFixed(2);
                    $scope.products[i].total = (parseFloat($scope.products[i].irate) + (parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost))).toFixed(2);
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.purchase.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                    $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.purchase.IGST = (parseFloat($scope.purchase.IGST) + parseFloat($scope.products[i].irate)).toFixed(2);
                    $scope.products[i].nameId = $scope.products[i].name.itemName;
                    $scope.products[i].name = $scope.products[i].name._id;
                }
            }
            $scope.purchase.netValue = $scope.grossAmount;
            refreshPicker();
        }

        function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker('refresh');
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD',minDate: $scope.pdc.invoiceDate});
            });
        }

        function sweetAlertWarning(tle,err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        function back(){
        	$state.go('invoice.purchaseDc');
        }

        $scope.getProduct = function(product){
            if(product){
                if($scope.selected.id == product.id){
                    return 'edit';
                } else{
                    return 'display';
                }
            }
        }

        $scope.editProduct = function(product){
            $scope.selected = angular.copy(product);
            if(product.IMEINumber){
                vm.IMEINumber = product.IMEINumber;
            }
        }

        $scope.selectedQuantityChange = function(){
            if($scope.selected.quantity){
                var pdcItemInd = $scope.pdc.item.findIndex(x => x.name._id == $scope.selected.name);
                if(pdcItemInd >= 0){
                    if($scope.selected.quantity > $scope.pdc.item[pdcItemInd].quantity){
                        $scope.selected.quantity = 0;
                        swal('', 'Quantity is too high');
                    }
                    $scope.selectedValueChange();
                }
            }
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
                for(var i = 0; i < $scope.products.length; i++){
                    if($scope.products[i].id != $scope.selected.id){
                        $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                        $scope.purchase.SGST = (parseFloat($scope.purchase.SGST) + parseFloat($scope.products[i].srate)).toFixed(2);
                    }
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
                for(var i = 0; i < $scope.products.length; i++){
                    if($scope.selected.id != $scope.products[i].id){
                        $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.purchase.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                        $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                        $scope.purchase.IGST = (parseFloat($scope.purchase.IGST) + parseFloat($scope.products[i].irate)).toFixed(2);
                    }
                }
                $scope.purchase.netValue = $scope.grossAmount;
            }
        }

        $scope.saveProduct = function(){
            if(($scope.selected.quantity) && ($scope.selected.cost) && ($scope.selected.total)){
                $scope.checkImei = 0;
                var pdcItemInd = $scope.pdc.item.findIndex(x => x.name._id == $scope.selected.name);
                if(pdcItemInd >= 0){
                    if($scope.pdc.item[pdcItemInd].name.IMEINumLen){
                        if($scope.selected.quantity != vm.IMEINumber.length){
                            $scope.checkImei = 1;
                        }
                    }
                }
                if($scope.checkImei === 0){
                    var pdcItemInd1 = $scope.products.findIndex(x => x.name == $scope.selected.name);
                    $scope.products[pdcItemInd1] = $scope.selected;
                    if($scope.showSCGST == true){
                        $scope.purchase.CGST = $scope.purchase.SGST;
                        $scope.products[pdcItemInd1]['cgst'] = $scope.selected.sgst;
                        $scope.purchase.IGST = undefined;
                        delete $scope.products[pdcItemInd1]['igst'];
                        delete $scope.products[pdcItemInd1]['irate'];
                    } else{
                        $scope.purchase.SGST = undefined;
                        $scope.purchase.CGST = undefined;
                        delete $scope.products[pdcItemInd1]['sgst'];
                        delete $scope.products[pdcItemInd1]['srate'];
                    }
                    if($scope.pdc.item[pdcItemInd].name.IMEINumLen){
                        $scope.products[pdcItemInd1].IMEINumber = vm.IMEINumber;
                    }
                    vm.IMEINumber = [];
                    $scope.selected = {};
                } else{
                    swal('', 'Select IMEI');
                }
            } else{
                swal('', 'Enter Quantity, Rate and GST');
            }
        }

        $scope.cancelProduct = function(){
            $scope.selected = {};
        }

        $scope.deleteProduct = function(index){
            $scope.products.splice(index,1);
            $scope.purchase.rndOFF = 0;
            $scope.grossAmount = 0;
            $scope.purchase.totalQuantity = 0;
            $scope.purchase.netValue = 0;
            $scope.purchase.grossValue = 0;
            if($scope.showSCGST == true){
                $scope.purchase.SGST = (0).toFixed(2);
                for(var i = 0; i < $scope.products.length; i++){
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.purchase.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                    $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.purchase.netValue = $scope.grossAmount;
                    $scope.purchase.SGST = parseFloat($scope.purchase.SGST) + parseFloat($scope.products[i].srate);
                }
                $scope.purchase.CGST = $scope.purchase.SGST;
            } else{
                $scope.purchase.IGST = (0).toFixed(2);
                for(var i = 0; i < $scope.products.length; i++){
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.purchase.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.purchase.totalQuantity);
                    $scope.purchase.grossValue = parseFloat($scope.purchase.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.purchase.netValue = $scope.grossAmount;
                    $scope.purchase.IGST = parseFloat($scope.purchase.IGST) + parseFloat($scope.products[i].irate);
                }
            }
        }

        $scope.openIMEInoDialog = function(prod){
            var pdcItemInd = $scope.pdc.item.findIndex(x => x.name._id == $scope.selected.name);
            if($scope.pdc.item[pdcItemInd].name.IMEINumLen){
                if($scope.selected.quantity){
                    var productItem = $scope.pdc.item[pdcItemInd].name;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'IMEInoContent.html',
                        backdrop: 'static',
                        keyboard: false,
                        controller: function IMEInoController($scope, $uibModalInstance){

                            vm.spName = vm.spName;
                            $scope.prodIte = productItem;
                            $scope.quantity = vm.IMEINumber.length;
                            $scope.IMEINumber = [];
                            $scope.IMEINumberClone = angular.copy(vm.IMEINumber);

                            for(var i=0; i<$scope.quantity; i++){
                                $scope.IMEINumber[i] = [];
                            }

                            if(vm.IMEINumber.length){
                                $scope.IMEINumber = angular.copy(vm.IMEINumber.map(a => a.IMEI));
                            }

                            $scope.getNumber = function(num){
                                return new Array(num);   
                            }

                            $scope.deleteIMEI = function(ind){
                                $scope.quantity = $scope.quantity - 1;
                                $scope.IMEINumber.splice(ind,1);
                                $scope.IMEINumberClone.splice(ind,1);
                            }

                            $scope.saveImei = function(){
                                if(prod.quantity == $scope.IMEINumberClone.length){
                                    vm.IMEINumber = $scope.IMEINumberClone;
                                    $scope.close();
                                } else{
                                    swal('', 'Quantity is ' + prod.quantity);
                                }
                            }

                            $scope.close = function(){
                                $uibModalInstance.close();
                            }
                        }
                    });
                }  else {
                    swal('', 'Enter Quantity');
                }
            }
        }

        $scope.savePurchase = function(){
            if($scope.preError != ''){
                swal('DATA NOT FOUND', $scope.preError);
            } else{
                if((angular.element($('#billDate')).val()) && ($scope.purchase.billno)){
                    $scope.purchase.billDate = angular.element($('#billDate')).val();
                    var checkNumber = 0;
                    for(var i=0; i<$scope.products.length; i++){
                        if($scope.products[i].IMEINumber){
                            if($scope.products[i].quantity != $scope.products[i].IMEINumber.length){
                                checkNumber = 1;
                            }
                        }
                    }
                    if(checkNumber == 0){
                        if($scope.products.length == 0){
                            swal('', 'Add Model / Item');
                        } else if($scope.checkImei == 0){
                            $scope.purchase.item = $scope.products;
                            swal({text:"Save Purchase", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                            InventoryService.savePurchaseDcBill({pur:$scope.purchase,dc:$scope.pdc}).then(function(res){
                                swal.close();
                                back();
                            });
                        }
                    } else{
                        swal('', vm.spName[1] + ' is not equal to quantity');
                    }
                } else{
                    swal('', 'Enter Reference Number and Select Reference Date');
                }
            }
        }
    }
}());