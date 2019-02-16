(function() {
    'use strict';
    angular.module('app').controller('DcSaleBill.IndexController', dcSaleBillController);

    function dcSaleBillController(MasterService, ClientService, InventoryService, SettingService, UserService, $state, $scope, $filter, $stateParams, $uibModal){

        var vm = this, activeObj = {active:true}, companyStateCode;
        $scope.purchase = {};
        vm.back = back;
        if(!$stateParams.obj){
            back();
        } else{
            InventoryService.readInventoryById({id: $stateParams.obj._id}).then(function(res){
                if(res.data){
                    $scope.sdc = res.data;
                    loaDefault();
                }
            });
        }

        function loaDefault(){
            $scope.sale.category = [];
            $scope.sale.grossValue = 0;
            $scope.sale.netValue = 0;
            $scope.grossAmount = 0;
            $scope.sale.totalQuantity = 0;
            $scope.selected = {};
            $scope.products = [];
            $scope.productid = 0;
            vm.spName = ['Stock Point', 'Serial Number'];
            $scope.preError = '';
            vm.IMEINumber = [];
            $scope.checkImei = 0;
            initController();
        }

        function initController(){
            ClientService.readClient(activeObj).then(function(res){
                if(res.data){
                    $scope.clients = res.data;
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
                }
                refreshPicker();
                genetrateNumber();
                initValues();
            });

            MasterService.readFinancialYear(activeObj).then(function(res){
                if(res.data){
                    $scope.finYears = res.data;
                    if($scope.finYears.length != 0){
                        $scope.sale.finYear = $scope.finYears[$scope.finYears.findIndex(x => x.status == true)]._id;
                    }
                }
            });

            InventoryService.readInventoryCode().then(function(res){
                if(res.data){
                    $scope.sale.code = res.data.code;
                }
            });

            UserService.getDealerAuthorID({refId: $scope.sdc['party']['_id']}).then(function(res){
                if(res.data.length){
                    $scope.sale.dealerUserID = res.data[0]._id;
                }
            });
        }

        function genetrateNumber(){
            $scope.sale.invoiceDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            InventoryService.readSalesInvoice().then(function(res){
                if(res.data.sale){
                    if(res.data.sale == 'empty'){
                        $scope.preError = $scope.preError + 'Enter sale bill format in setting page.\n';
                    } else{
                        $scope.sale.invoiceNumber = res.data.sale;
                    }
                    if($scope.preError != ''){
                        sweetAlertWarning('DATA NOT FOUND',$scope.preError);
                    }
                }
            });
        }

        function initValues(){
            $scope.sale.party = $scope.sdc.party._id;
            $scope.sale.salePoint = $scope.sdc.salePoint._id;
            $scope.sale.billno = $scope.sdc.invoiceNumber;
            $scope.sale.billDate = $scope.sdc.invoiceDate;
            for(var i=0; i<$scope.sdc.category.length; i++){
                $scope.sale.category.push($scope.sdc.category[i]._id);
            }
            for(var i=0; i<$scope.sdc.item.length; i++){
                if($scope.sdc.item[i].quantity > 0){
                    $scope.products.push(angular.copy($scope.sdc.item[i]));
                }
            }
            if($scope.sdc['party']['state']['gstCode'] === companyStateCode){
                $scope.showSCGST = true;
                $scope.showIGST = false;
                $scope.sale.SGST = 0;
                $scope.sale.CGST = 0;
                for(var i=0; i<$scope.products.length; i++){
                    $scope.productid = $scope.productid + 1;
                    $scope.products[i].id = $scope.productid;
                    $scope.products[i]['sgst'] = (parseFloat($scope.products[i]['name']['prodName']['type']['taxRate']) / 2).toFixed(2);
                    $scope.products[i]['cgst'] = $scope.products[i]['sgst'];
                    $scope.products[i].srate = ((parseFloat($scope.products[i].quantity) * (parseFloat($scope.products[i].cost) * parseFloat($scope.products[i].sgst))) / 100).toFixed(2);
                    $scope.products[i].total = ((2 * parseFloat($scope.products[i].srate)) + (parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost))).toFixed(2);
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.sale.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.sale.totalQuantity);
                    $scope.sale.grossValue = parseFloat($scope.sale.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.sale.SGST = (parseFloat($scope.sale.SGST) + parseFloat($scope.products[i].srate)).toFixed(2);
                    $scope.products[i].nameId = $scope.products[i].name.itemName;
                    $scope.products[i].name = $scope.products[i].name._id;
                }
            } else{
                $scope.showIGST = true;
                $scope.showSCGST = false;
                $scope.sale.IGST = 0;
                for(var i=0; i<$scope.products.length; i++){
                    $scope.productid = $scope.productid + 1;
                    $scope.products[i].id = $scope.productid;
                    $scope.products[i].igst = $scope.products[i]['name']['prodName']['type']['taxRate'];
                    $scope.products[i].irate = ((parseFloat($scope.products[i].quantity) * (parseFloat($scope.products[i].cost) * parseFloat($scope.products[i].igst))) / 100).toFixed(2);
                    $scope.products[i].total = (parseFloat($scope.products[i].irate) + (parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost))).toFixed(2);
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.sale.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.sale.totalQuantity);
                    $scope.sale.grossValue = parseFloat($scope.sale.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.sale.IGST = (parseFloat($scope.sale.IGST) + parseFloat($scope.products[i].irate)).toFixed(2);
                    $scope.products[i].nameId = $scope.products[i].name.itemName;
                    $scope.products[i].name = $scope.products[i].name._id;
                }
            }
            $scope.sale.netValue = $scope.grossAmount;
            refreshPicker();
        }

        function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker('refresh');
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD',minDate: $scope.sdc.invoiceDate});
            });
        }

        function sweetAlertWarning(tle,err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        function back(){
        	$state.go('invoice.saleDc');
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
                var pdcItemInd = $scope.sdc.item.findIndex(x => x.name._id == $scope.selected.name);
                if(pdcItemInd >= 0){
                    if($scope.selected.quantity > $scope.sdc.item[pdcItemInd].quantity){
                        $scope.selected.quantity = 0;
                        swal('', 'Quantity is too high');
                    }
                    $scope.selectedValueChange();
                }
            }
        }

        $scope.selectedValueChange = function(){
            $scope.sale.rndOFF = 0;
            if($scope.showSCGST){
                if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                    $scope.selected.srate = ((parseFloat($scope.selected.quantity) * (parseFloat($scope.selected.cost) * parseFloat($scope.selected.sgst))) / 100).toFixed(2);
                    $scope.selected.total = ((2 * parseFloat($scope.selected.srate)) + (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost))).toFixed(2);
                    $scope.sale.grossValue = (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost)).toFixed(2);
                    $scope.sale.totalQuantity = $scope.selected.quantity;
                } else{
                    $scope.selected.srate = 0;
                    $scope.selected.total = 0;
                    $scope.sale.grossValue = 0;
                    $scope.sale.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.selected.total;
                $scope.sale.SGST = $scope.selected.srate;
                for(var i = 0; i < $scope.products.length; i++){
                    if($scope.products[i].id != $scope.selected.id){
                        $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sale.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.sale.totalQuantity);
                        $scope.sale.grossValue = parseFloat($scope.sale.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                        $scope.sale.SGST = (parseFloat($scope.sale.SGST) + parseFloat($scope.products[i].srate)).toFixed(2);
                    }
                }
                $scope.sale.CGST = $scope.sale.SGST;
                $scope.sale.netValue = $scope.grossAmount;
            } else{
                if($scope.selected.quantity && $scope.selected.cost && $scope.selected.sgst){
                    $scope.selected.irate = ((parseFloat($scope.selected.quantity) * (parseFloat($scope.selected.cost) * parseFloat($scope.selected.igst))) / 100).toFixed(2);
                    $scope.selected.total = (parseFloat($scope.selected.irate) + (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost))).toFixed(2);
                    $scope.sale.grossValue = (parseFloat($scope.selected.quantity) * parseFloat($scope.selected.cost)).toFixed(2);
                    $scope.sale.totalQuantity = $scope.selected.quantity;
                } else{
                    $scope.selected.irate = 0;
                    $scope.selected.total = 0;
                    $scope.sale.grossValue = 0;
                    $scope.sale.totalQuantity = 0;
                }
                $scope.grossAmount = $scope.selected.total;
                $scope.sale.IGST = $scope.selected.irate;
                for(var i = 0; i < $scope.products.length; i++){
                    if($scope.selected.id != $scope.products[i].id){
                        $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                        $scope.sale.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.sale.totalQuantity);
                        $scope.sale.grossValue = parseFloat($scope.sale.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                        $scope.sale.IGST = (parseFloat($scope.sale.IGST) + parseFloat($scope.products[i].irate)).toFixed(2);
                    }
                }
                $scope.sale.netValue = $scope.grossAmount;
            }
        }

        $scope.saveProduct = function(){
            if(($scope.selected.quantity) && ($scope.selected.cost) && ($scope.selected.total)){
                $scope.checkImei = 0;
                var pdcItemInd = $scope.sdc.item.findIndex(x => x.name._id == $scope.selected.name);
                if(pdcItemInd >= 0){
                    if($scope.sdc.item[pdcItemInd].name.IMEINumLen){
                        if($scope.selected.quantity != vm.IMEINumber.length){
                            $scope.checkImei = 1;
                        }
                    }
                }
                if($scope.checkImei === 0){
                    var pdcItemInd1 = $scope.products.findIndex(x => x.name == $scope.selected.name);
                    $scope.products[pdcItemInd1] = $scope.selected;
                    if($scope.showSCGST == true){
                        $scope.sale.CGST = $scope.sale.SGST;
                        $scope.products[pdcItemInd1]['cgst'] = $scope.selected.sgst;
                        $scope.sale.IGST = undefined;
                        delete $scope.products[pdcItemInd1]['igst'];
                        delete $scope.products[pdcItemInd1]['irate'];
                    } else{
                        $scope.sale.SGST = undefined;
                        $scope.sale.CGST = undefined;
                        delete $scope.products[pdcItemInd1]['sgst'];
                        delete $scope.products[pdcItemInd1]['srate'];
                    }
                    if($scope.sdc.item[pdcItemInd].name.IMEINumLen){
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
            $scope.sale.rndOFF = 0;
            $scope.grossAmount = 0;
            $scope.sale.totalQuantity = 0;
            $scope.sale.netValue = 0;
            $scope.sale.grossValue = 0;
            if($scope.showSCGST == true){
                $scope.sale.SGST = (0).toFixed(2);
                for(var i = 0; i < $scope.products.length; i++){
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.sale.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.sale.totalQuantity);
                    $scope.sale.grossValue = parseFloat($scope.sale.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.sale.netValue = $scope.grossAmount;
                    $scope.sale.SGST = (parseFloat($scope.sale.SGST) + parseFloat($scope.products[i].srate)).toFixed(2);
                }
                $scope.sale.CGST = $scope.sale.SGST;
            } else{
                $scope.sale.IGST = (0).toFixed(2);
                for(var i = 0; i < $scope.products.length; i++){
                    $scope.grossAmount = (parseFloat($scope.products[i].total) + parseFloat($scope.grossAmount)).toFixed(2);
                    $scope.sale.totalQuantity = parseFloat($scope.products[i].quantity) + parseFloat($scope.sale.totalQuantity);
                    $scope.sale.grossValue = parseFloat($scope.sale.grossValue) + parseFloat($scope.products[i].quantity) * parseFloat($scope.products[i].cost);
                    $scope.sale.netValue = $scope.grossAmount;
                    $scope.sale.IGST = (parseFloat($scope.sale.IGST) + parseFloat($scope.products[i].irate)).toFixed(2);
                }
            }
        }

        $scope.openIMEInoDialog = function(prod){
            var pdcItemInd = $scope.sdc.item.findIndex(x => x.name._id == $scope.selected.name);
            if($scope.sdc.item[pdcItemInd].name.IMEINumLen){
                if($scope.selected.quantity){
                    var productItem = $scope.sdc.item[pdcItemInd].name;
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

        $scope.adjusTotal = function(){
            if($scope.sale.rndOFF){
                if(($scope.sale.rndOFF < 1) && ($scope.sale.rndOFF > -1)){
                    $scope.sale.netValue = (parseFloat($scope.grossAmount) + parseFloat($scope.sale.rndOFF)).toFixed(2);
                } else{
                    $scope.sale.rndOFF = 0;
                    swal('', 'Value must be less than 1 and greater than -1');
                }
            } else{
                $scope.sale.netValue = $scope.grossAmount;
            }
        }

        $scope.savePurchase = function(){
            if($scope.preError != ''){
                swal('DATA NOT FOUND', $scope.preError);
            } else{
                if((angular.element($('#billDate')).val()) && ($scope.sale.billno)){
                    $scope.sale.billDate = angular.element($('#billDate')).val();
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
                            $scope.sale.item = $scope.products;
                            swal({text:"Save Sale", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                            InventoryService.saveSaleDcBill({sale:$scope.sale, dc:$scope.sdc}).then(function(res){
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