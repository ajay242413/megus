(function() {
    'use strict';
    angular.module('app').controller('AddPurchase.IndexController', addPurchaseController);

    function addPurchaseController(MasterService, InventoryService, SettingService, ExcelService, $state, $scope, $rootScope, $filter){

        var vm=this, getActiveObj={active:true}, companyStateCode;
        $scope.spName = ['Stock Point', 'Serial Number'];
        if($scope.rootUser.userType == 'b'){
            loadDefault();
        } else{
            $scope.back();
        }

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
            $scope.productid = 0;
            $scope.valid = 0;
            $scope.invalid = 0;
            $scope.preError = '';
            initController();
            refreshPicker();
        }

        function initController(){
            MasterService.readSupplier(getActiveObj).then(function(res){
                if(res.data){
                    $scope.suppliers = res.data;
                    refreshPicker();
                }
            });

            MasterService.readSalePoint(getActiveObj).then(function(res){
                if(res.data){
                    $scope.salePoints = res.data;
                    if($scope.salePoints.length == 0){
                        $scope.preError = $scope.preError + 'Add' + $scope.spName[0] + ' In Master General Page.\n';
                    }
                    refreshPicker();
                }
            });

            MasterService.readProductItem(getActiveObj).then(function(res){
                if(res.data){
                    $scope.productItems = res.data;
                    $scope.prodItemClone = [];
                }
            });

            MasterService.readProductName(getActiveObj).then(function(res){
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
                if(!companyStateCode){
                    $scope.preError = $scope.preError + 'Select State in setting page.\n';
                }
                refreshPicker();
                genetrateNumber();
            });

            MasterService.readFinancialYear(getActiveObj).then(function(res){
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

        function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker('refresh');
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        function sweetAlertWarning(tle,err){
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        $scope.back = function(){
            $state.go('invoice.purchase', null , {reload:true});
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

        $scope.valueChange = function(){
            $scope.purchase.rndOFF = 0;
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
            if(($scope.purchase.party) && ($scope.purchase.salePoint) && ($scope.purchase.billno) && ($scope.product.nameId.title) && ($scope.product.quantity > 0) && ($scope.product.cost > 0) && ($scope.product.total > 0)){
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
                vm.products[vm.products.length - 1]['name'] = $scope.product.nameId.originalObject._id;
                vm.products[vm.products.length - 1]['id'] = $scope.productid;
                if($scope.product.nameId.originalObject.IMEINumLen){
                    vm.products[vm.products.length - 1].IMEINumber = [];
                }
                vm.products[vm.products.length - 1]['nameId'] = $scope.product.nameId.title;
                $scope.productid = $scope.productid + 1;
                $scope.product = {};
                $scope.$broadcast('angucomplete-alt:clearInput', 'aa1');  
                $scope.product.nameId = {};
            }else{
                sweetAlertWarning('Data Not Found', 'Select Supplier, ' + $scope.spName[0] + ', Item and Enter Bill Number');
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
            $scope.selected = product;
        }

        $scope.selectedItemChange = function(nameId){
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
            delete $scope.selected['IMEINumber'];
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
            if(($scope.selected.name) && ($scope.selected.quantity) && ($scope.selected.cost) && ($scope.selected.total)){
                var itemIndex = $scope.prodItemClone.findIndex(x => x._id == $scope.selected.name);
                var prodIndex = vm.products.findIndex(x => x.id == $scope.selected.id);
                if(prodIndex >= 0){
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
                    vm.products[prodIndex]['name'] = $scope.prodItemClone[itemIndex]._id;
                    vm.products[prodIndex]['nameId'] = $scope.prodItemClone[itemIndex].itemName + $scope.prodItemClone[itemIndex].name;
                    $scope.selected = {};
                    $scope.$broadcast('angucomplete-alt:clearInput', 'aa2');
                }
            } else{
                swal('', 'Select Item \ Model Name, Quantity, Rate and GST');
            }
        }

        $scope.cancelProduct = function(){
            $scope.selected = {};
        }

        $scope.deleteProduct = function(index){
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

        $scope.upload = function(){
            $scope.showIMEI = false;
            if($scope.product.nameId.title){
                $scope.addProduct();
            }
            if($scope.excelSheet){
                swal({title:'Validating' + $scope.spName[1], showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/gear.gif'});
                var reader = new FileReader();
                reader.onload = function(e){
                    var data=e.target.result, workbook=XLSX.read(data, {type:'binary'}), sheetName=workbook.SheetNames[0], excelJSON=XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]), excelData=XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
                    if(excelJSON.length > 0) {
                        $scope.validateIMEI(excelJSON,excelData[0]);
                    } else{
                        sweetAlertWarning('Data Not Found', 'Excel Data');
                    }
                }
                reader.onerror = function(ex){
                    sweetAlertWarning('Error', 'Excel Uploading');
                }
                reader.readAsBinaryString($scope.excelSheet);
            }
        }

        $scope.validateIMEI = function(excelData, excelHeader){
            if(excelData.length){
                var imeis = [];
                $scope.invalidIMEInumber = [];
                for(var i=0; i<excelHeader.length; i++){
                    if(excelHeader[i]){
                        if(excelHeader[i].includes('imei')){
                            imeis = imeis.concat(excelData.map(a => a[excelHeader[i]]));
                        }
                    }
                }
                if(imeis.length){
                    imeis = imeis.filter(function(element){
                        if(element){
                            return element;
                        }
                    });
                }
                InventoryService.IMEIduplication({uploadIMEI: imeis}).then(function(res){
                    $scope.valid = 0;
                    $scope.invalid = 0;
                    $scope.duplic = 0;
                    $scope.excelResult = [];
                    var duplicateIMEI = res.data;
                    if(duplicateIMEI.length){
                        resetProductIMEI();
                        for(var i=0; i < excelData.length; i++){
                            if(excelData[i]['itemcode']){
                                var itemInd = $scope.productItems.findIndex(x => x.itemCode == excelData[i]['itemcode']);
                                if(itemInd >= 0){
                                    var validIMEI=[], invalidIMEI=[], errormsg='';
                                    for(var j = 1; j <= $scope.productItems[itemInd].prodName.IMEINumCount; j++){
                                        var imei = excelData[i]['imei'+ j].replace(/[\s]/g, '');
                                        // if(imei.match(/^[0-9]+$/) != null){
                                        if(imei.length === $scope.productItems[itemInd].IMEINumLen){
                                            var imeInd = duplicateIMEI.findIndex(x => x.IMEI.includes(imei));
                                            if(imeInd < 0){
                                                validIMEI.push(imei);
                                            }else{
                                                errormsg = 'err';
                                            }
                                        } else{
                                            invalidIMEI.push(imei);
                                        }
                                        // } else{
                                        //     invalidIMEI.push(imei);
                                        // }
                                    }
                                    var boxno = '';
                                    if(excelData[i]['boxno']){
                                        boxno = excelData[i]['boxno'];
                                        if(validIMEI.length === $scope.productItems[itemInd].prodName.IMEINumCount){
                                            var prodItemInd = vm.products.findIndex(x => x.name == $scope.productItems[itemInd]._id);
                                            if(prodItemInd >= 0){
                                                $scope.valid = $scope.valid + 1;
                                                vm.products[prodItemInd].IMEINumber.push({IMEI:validIMEI, boxno:boxno});
                                                $scope.excelResult.push(excelData[i]);
                                                $scope.excelResult[$scope.excelResult.length-1]['result'] = 'SUCCESS';
                                            }
                                        } else if(errormsg == 'err'){
                                            $scope.excelResult.push(excelData[i]);
                                            $scope.excelResult[$scope.excelResult.length-1]['result'] = 'duplicate';
                                        } else if(invalidIMEI.length){
                                            $scope.invalid = $scope.invalid + 1;
                                            $scope.invalidIMEInumber.push(excelData[i]);
                                            $scope.excelResult.push(excelData[i]);
                                            $scope.excelResult[$scope.excelResult.length-1]['result'] = 'invalid';
                                        } 
                                    } else{
                                        $scope.excelResult.push(excelData[i]);
                                        $scope.excelResult[$scope.excelResult.length-1]['result'] = 'boxno not exist';
                                    }
                                } else{
                                    $scope.excelResult.push(excelData[i]);
                                    $scope.excelResult[$scope.excelResult.length-1]['result'] = 'itemcode not wrong';
                                }
                            } else{
                                $scope.excelResult.push(excelData[i]);
                                $scope.excelResult[$scope.excelResult.length-1]['result'] = 'itemcode not exist';
                            }
                        }
                    } else{
                        resetProductIMEI();
                        for(var i=0; i<excelData.length; i++){
                            if(excelData[i]['itemcode']){
                                var itemInd = $scope.productItems.findIndex(x => x.itemCode == excelData[i]['itemcode']);
                                if(itemInd >= 0){
                                    var validIMEI = [], invalidIMEI = [];
                                    for(var j = 1; j <= $scope.productItems[itemInd].prodName.IMEINumCount; j++){
                                        var imei = excelData[i]['imei'+ j].toString().replace(/[\s]/g, '');
                                        // if(imei.match(/^[0-9]+$/) != null){
                                        if(imei.length === $scope.productItems[itemInd].IMEINumLen){
                                            validIMEI.push(imei);
                                        }
                                        // }
                                    }
                                    var boxno = '';
                                    if(excelData[i]['boxno']){
                                        boxno = excelData[i]['boxno'];
                                        if(validIMEI.length === $scope.productItems[itemInd].prodName.IMEINumCount){
                                            var prodItemInd = vm.products.findIndex(x => x.name == $scope.productItems[itemInd]._id);
                                            if(prodItemInd >= 0){
                                                $scope.valid = $scope.valid + 1;
                                                vm.products[prodItemInd].IMEINumber.push({'IMEI': validIMEI,'boxno': boxno,'pp':$scope.purchase.invoiceDate});
                                                $scope.excelResult.push(excelData[i]);
                                                $scope.excelResult[$scope.excelResult.length-1]['result'] = 'SUCCESS';
                                            }
                                        }else{
                                            $scope.invalid = $scope.invalid + 1;
                                            $scope.invalidIMEInumber.push(excelData[i]);
                                            $scope.excelResult.push(excelData[i]);
                                            $scope.excelResult[$scope.excelResult.length-1]['result'] = 'invalid';
                                        }
                                    } else{
                                        $scope.excelResult.push(excelData[i]);
                                        $scope.excelResult[$scope.excelResult.length-1]['result'] = 'boxno not exist';
                                    }
                                } else{
                                    $scope.excelResult.push(excelData[i]);
                                    $scope.excelResult[$scope.excelResult.length-1]['result'] = 'itemcode not wrong';
                                }
                            } else{
                                $scope.excelResult.push(excelData[i]);
                                $scope.excelResult[$scope.excelResult.length-1]['result'] = 'itemcode not exist';
                            }
                        }
                    }
                    $scope.invalid = $scope.invalidIMEInumber.length;
                    $scope.duplic = duplicateIMEI.length;
                    // if(duplicateIMEI.length){
                    //     $timeout(function () {
                    //         var dupim = duplicateIMEI.map(a => a.IMEI);
                    //         ExcelService.exportXLSX('IMEI','Duplicate_IMEI',dupim);
                    //     }, 2000);
                    // }
                    ExcelService.exportXLSX($scope.spName[1],$scope.spName[1] + '_Result',$scope.excelResult);
                    swal.close();
                });
            } else{
                swal.close();
            }
        }

        function resetProductIMEI(){
            for(var i = 0; i < vm.products.length; i++) {
                if(vm.products[i].IMEINumber){
                    vm.products[i].IMEINumber = [];
                }
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

        $scope.savePurchase = function(){
            if(!$scope.selected.name){
                if($scope.preError != ''){
                    sweetAlertWarning('DATA NOT FOUND', $scope.preError);
                } else{
                    if((angular.element($('#billDate')).val()) && ($scope.purchase.billno)){
                        $scope.purchase.billDate = angular.element($('#billDate')).val();
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
                                swal({text:"Save Purchase", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                                InventoryService.savePurchase($scope.purchase).then(function(res){
                                    swal.close();
                                    $scope.cancelPurchase();
                                });
                            }
                        } else{
                            swal('', $scope.spName[1] + ' is not equal to quantity');
                        }
                    } else{
                        swal('', 'Select Purchase Date and Enter Bill Number');
                    }
                }
            } else{
                swal('', 'Save Editing Item \ Model');
            }
        }

        $scope.cancelPurchase = function(){
            $state.reload();
        }
    }
})();