(function() {
    'use strict';
	angular.module('app').controller('AddSaleDc.IndexController', addSaleDcController);

    function addSaleDcController(InventoryService, MasterService, SettingService, ClientService, UserService, $state, $scope, $filter, $uibModal) {

        var vm = this, activeObj = { active: true }, curInd;
        loadDefault();

        function loadDefault() {
            vm.spName = ['Stock Point', 'Serial Number'];
            vm.products = [];
            $scope.sales = {};
            $scope.sales.category = [];
            $scope.sales.totalQuantity = 0;
            $scope.sales['netValue'] = 0;
            $scope.productid = 0;
            $scope.preError = '';
            vm.salePointChange = salePointChange;
            vm.addProduct = addProduct;
            initController();
            addProduct();
        }

        function initController() {            
            MasterService.readSalePoint(activeObj).then(function(res) {
                if(res.data) {
                    $scope.salePoints = res.data;
                    refreshPicker();
                }
            });

            ClientService.readClient(activeObj).then(function(res) {
                if(res.data) {
                    $scope.clients = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductItem(activeObj).then(function(res) {
                if(res.data) {
                    $scope.productItems = res.data;
                }
            });

            MasterService.readProductName(activeObj).then(function(res) {
                if(res.data) {
                    $scope.categories = res.data;
                }
                refreshPicker();
            });

            SettingService.readSetting().then(function(res) {
                if(res.data.length) {
                    if(res.data[0].format) {
                        if(res.data[0].format.stockPoint) {
                            vm.spName[0] = res.data[0].format.stockPoint;
                        }
                        if(res.data[0].format.serial) {
                            vm.spName[1] = res.data[0].format.serial;
                        }
                    }
                    if(res.data[0].default) {
                        if(res.data[0].default.stockPoint) {
                            var spInd = $scope.salePoints.findIndex(x => x._id == res.data[0].default.stockPoint);
                            if(spInd >= 0) {
                                $scope.sales.salePoint =  res.data[0].default.stockPoint;
                                salePointChange();
                            }
                        }
                    }
                }
                refreshPicker();
                genetrateNumber();
            });

            InventoryService.readInventoryCode().then(function(res) {
                if(res.data) {
                    $scope.sales.code = res.data.code;
                }
            });
        }

        function genetrateNumber() {
            $scope.sales.invoiceDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            InventoryService.readInvoiceNumber({type:'sdc'}).then(function(res) {
                if(res.data.invoice) {
                    if(res.data.invoice == 'empty') {
                        $scope.preError = $scope.preError + 'Enter sale dc bill format in setting page.\n';
                    } else {
                        $scope.sales.invoiceNumber = res.data.invoice;
                    }
                    if($scope.preError != '') {
                        sweetAlertWarning('DATA NOT FOUND', $scope.preError);
                    }
                }
            });
        }

        function refreshPicker() {
            angular.element(document).ready(function() { 
                $('.selectpicker').selectpicker('refresh'); 
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        function sweetAlertWarning(tle, err) {
            swal({title:tle, text:err, type:'warning', showCancelButton:false, confirmButtonText:'Ok!', allowOutsideClick:false, allowEscapeKey:false});
        }

        $scope.back = function() {
            $state.go('invoice.saleDc',null,{reload: true});
        }

        $scope.clientChange = function() {
            if($scope.sales.party) {
                var cliInd = $scope.clients.findIndex(x => x._id == $scope.sales.party);
                UserService.getDealerAuthorID({refId: $scope.clients[cliInd]._id}).then(function(res) {
                    if(res.data){
                        $scope.sales.dealerUserID = res.data[0]._id;
                    }
                });
                if($scope.clients[cliInd].creditDays) {
                    $scope.sales.creditDays = $scope.clients[cliInd].creditDays;
                } else {
                    $scope.sales.creditDays = undefined;
                }
            }
        }

        function salePointChange() {
            $scope.purchaseItems = [];
            if($scope.sales.salePoint) {
                InventoryService.readPurchaseItems({salePoint: $scope.sales.salePoint}).then(function(res) {
                    if(res.data) {
                        $scope.purchaseItems = res.data;
                        $scope.categoryChange();
                    }
                });
            }
        }

        $scope.categoryChange = function() {
            $scope.prodItemClone = [];
            if($scope.sales.category.length) {
                for(var i = 0; i < $scope.sales.category.length; i++) {
                    for(var j = 0; j < $scope.productItems.length; j++) {
                        if($scope.sales.category[i] == $scope.productItems[j].prodName._id) {
                            var purIndex = $scope.purchaseItems.findIndex(x => x.name._id == $scope.productItems[j]._id);
                            if(purIndex >= 0) {
                                $scope.prodItemClone.push($scope.productItems[j]);
                            }
                        }
                    }
                }
            }
        }

        function addProduct() {
            vm.products.push({
                cost: 0,
                quantity: 0,
                total: 0,
                id: $scope.productid
            });
            $scope.productid = $scope.productid + 1;
            if(vm.products.length > 1) {
                $scope.disableInput = true;
            } else {
                $scope.disableInput = false;
            }
        }

        $scope.setInd = function(ind) {
            curInd = ind;
        }

        $scope.itemChange = function(model) {
            if(model) {
                var checkModel = false;
                for(var i = 0; i < vm.products.length; i++) {
                    if(i != curInd)
                        if(model['originalObject']['_id'] == vm.products[i]['name'])
                            checkModel = true;
                }
                if(!checkModel){
                    vm.products[curInd]['name'] = model['originalObject']['_id'];
                    vm.products[curInd]['cost'] = model['originalObject']['sellPrice'];
                    vm.products[curInd]['quantity'] = 1;
                    if(model['originalObject']['IMEINumLen']){
                        vm.products[curInd]['IMEINumber'] = [];
                        vm.products[curInd]['IMEINumber1'] = [];
                        vm.products[curInd]['boxNumber'] = [];
                    }
                } else {
                    $scope.$broadcast('angucomplete-alt:clearInput', 'aa' + curInd);
                    delete vm.products[curInd]['name'];
                    delete vm.products[curInd]['IMEINumber'];
                    delete vm.products[curInd]['IMEINumber1'];
                    delete vm.products[curInd]['boxNumber'];
                    vm.products[curInd]['cost'] = 0;
                    vm.products[curInd]['quantity'] = 0;
                    swal('', 'Already Item Exist');
                }
                $scope.valueChange(curInd);
            } else {
                $scope.sales.rndOFF = 0;
            }
        }

        $scope.quantityChange = function(ind) {
            if(vm.products[ind]['IMEINumber']) {
                vm.products[ind]['IMEINumber'] = [];
                vm.products[ind]['IMEINumber1'] = [];
                vm.products[ind]['boxNumber'] = [];
            }
            $scope.valueChange(ind);
        }

        $scope.valueChange = function(ind) {
            $scope.sales.rndOFF = 0;
            $scope.sales['netValue'] = 0;
            vm.products[ind]['total'] = 0;
            $scope.sales.totalQuantity = 0;
            if(vm.products[ind]['cost'] && vm.products[ind]['quantity']) {
                vm.products[ind]['total'] = (parseFloat(vm.products[ind]['cost']) * parseFloat(vm.products[ind]['quantity'])).toFixed(2);
            }
            for(var i = 0; i < vm.products.length; i++) {
                $scope.sales['netValue'] = parseFloat($scope.sales['netValue']) + parseFloat(vm.products[i]['total']);
                $scope.sales.totalQuantity = $scope.sales.totalQuantity + parseInt(vm.products[i]['quantity']);
            }
        }

        $scope.deleteProduct = function(ind) {
            vm.products.splice(ind, 1);
            $scope.sales['netValue'] = 0;
            $scope.sales.totalQuantity = 0;
            for(var i = 0; i < vm.products.length; i++) {
                $scope.sales['netValue'] = parseFloat($scope.sales['netValue']) + parseFloat(vm.products[i]['total']);
                $scope.sales.totalQuantity = $scope.sales.totalQuantity + parseInt(vm.products[i]['quantity']);
            }
        }

        $scope.imeiDialog = function(product, ind) {
            var modelInd = $scope.prodItemClone.findIndex(x => x._id === product['name']);
            if(modelInd >= 0) {
                if($scope.prodItemClone[modelInd]['IMEINumLen']) {
                    var purModelInd = $scope.purchaseItems.findIndex(x => x['name']['_id'] === product['name']);
                    if(purModelInd >= 0){
                        if(product['quantity'] <= $scope.purchaseItems[purModelInd]['quantity']){
                            var productItem = $scope.prodItemClone[modelInd],  salepoint = $scope.sales['salePoint'], iino1 = product['IMEINumber1'], iino = product['IMEINumber'], bxno = product['boxNumber']
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
                                            imeis = res.data[0]['IMEINumber'];
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
                                    $scope.selectedIMEI = iino;
                                    $scope.imeiNumbers = iino;
                                    $scope.cartno = bxno;
                                    
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
                                        if(product.quantity === $scope.selectedIMEI.length){
                                            vm.products[ind]['IMEINumber1'] = angular.copy($scope.selectedIMEI);
                                            vm.products[ind]['boxNumber'] = angular.copy($scope.cartno);
                                            vm.products[ind]['IMEINumber'] = angular.copy($scope.selectedIMEI);
                                            vm.products[ind]['IMEINumber'].map((obj) => {
                                                obj.ps = $filter('date')(new Date(), "yyyy-MM-dd");
                                                return obj;
                                            });
                                            $scope.close();
                                        }else{
                                            swal('','Select ' + product.quantity + $scope.spName[1]);
                                        }
                                    }
                                }
                            });
                        } else {
                            swal('', 'Stock Not Exist !!!');
                        }
                    } else {
                        swal('', 'Stock Not Exist !!!');
                    }
                }
            } else {
                swal('', 'No Matching Product Item found');
            }
        }

        $scope.adjusTotal = function() {
            $scope.sales['netValue'] = 0;
            for(var i = 0; i < vm.products.length; i++) {
                $scope.sales['netValue'] = parseFloat($scope.sales['netValue']) + parseFloat(vm.products[i]['total'])
            }
            if($scope.sales['rndOFF']) {
                if(($scope.sales['rndOFF'] < 1) && ($scope.sales['rndOFF'] > -1)) {
                    $scope.sales['netValue'] = (parseFloat($scope.sales['netValue']) + parseFloat($scope.sales['rndOFF'])).toFixed(2);
                } else {
                    $scope.sales['rndOFF'] = 0;
                    swal('', 'Value must be less than 1 and greater than -1');
                }
            }
        }

        $scope.saveSales = function() {
            var checkProduct = false;
            for(var i = 0; i < vm.products.length; i++) {
                if((vm.products[i]['quantity'] <= 0) && (parseFloat(vm.products[i]['total']) <= 0)) {
                    checkProduct = true;
                }
                if(vm.products[i]['IMEINumber']) {
                    if(vm.products[i]['IMEINumber'].length != vm.products[i]['quantity']){
                        checkProduct = true;
                    }
                }
            }
            if(checkProduct) {
                swal('', 'Enter Valid Info and select ' + vm.spName);
            } else {
                $scope.sales.item = vm.products;
                $scope.sales.itemClone = vm.products;
                swal({text:"Save Sale DC", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                InventoryService.saveSaleDc($scope.sales).then(function(res){
                    if(res.data){
                        swal.close();
                        $scope.cancelSales();
                    }
                });
            }
        }
        
        $scope.cancelSales = function() {
            $state.reload();
        }
    }
})();