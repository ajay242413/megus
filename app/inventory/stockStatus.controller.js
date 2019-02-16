(function(){
    'use strict';
    angular.module('app').controller('StockStatus.IndexController', stockStatusController);

    function stockStatusController(MasterService, InventoryService, ExcelService, SettingService, $scope, $filter){

        var vm=this, activeObj={active:true};
        vm.refreshPicker = refreshPicker;
        loadDefault();
        
        function loadDefault(){
            $scope.spName = ["Stock Point", "Serial Number"];
            $scope.showTable = false;
            $scope.itemList = [];
            $scope.salepointList = [];
            $scope.brandList = [];
            $scope.prodDescriptionList = [];
            $scope.prodCategoryList = [];
            $scope.prodAttributeList = [];
            $scope.attributeLists = [];
            $scope.attribute = [];
            $scope.showAge = false;
            $scope.showAge1 = $scope.showAge;
            refreshPicker();
            initController();
        }

        function initController(){
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
                }
                refreshPicker();
            });

            MasterService.readProductItem(activeObj).then(function(res){
                if(res.data){
                    $scope.prodItemLists = res.data;
                    $scope.prodItemListsClone = res.data;
                    $scope.itemList = $scope.prodItemLists.map(a => a._id);
                    refreshPicker();
                }
            });

            MasterService.readSalePoint(activeObj).then(function(res){
                if(res.data){
                    $scope.salePointLists = res.data;
                    $scope.salepointList = $scope.salePointLists.map(a => a._id);
                    refreshPicker();
                }
            });

            MasterService.readProductType(activeObj).then(function(res){
                if(res.data){
                    $scope.prodDescriptionLists = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductBrand(activeObj).then(function(res){
                if(res.data){
                    $scope.brandLists = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductName(activeObj).then(function(res){
                if(res.data){
                    $scope.prodCategoryLists = res.data;
                    $scope.prodCategoryListsCLone = res.data;
                    refreshPicker();
                }
            });

            MasterService.readProductAttribute(activeObj).then(function(res){
                if(res.data){
                    $scope.prodAttributeLists = res.data;
                    refreshPicker();
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({maxDate:new Date(), format:'YYYY-MM-DD'});
            });
        }

        $scope.attributeChange = function(){
            $scope.attributeLists = [];
            for(var i=0; i<$scope.prodAttributeList.length; i++){
                var attInd = $scope.prodAttributeLists.findIndex(x => x._id == $scope.prodAttributeList[i]);
                if(attInd >= 0){
                    $scope.attributeLists.push($scope.prodAttributeLists[attInd]);
                }
            }
            refreshPicker();
        }

        $scope.prodDescriptionChange = function(){
            $scope.prodCategoryLists = [];
            if($scope.prodDescriptionList.length){
                for(var i=0; i<$scope.prodDescriptionList.length; i++){
                    for(var j=0; j<$scope.prodCategoryListsCLone.length; j++){
                        if($scope.prodCategoryListsCLone[j].type._id == $scope.prodDescriptionList[i]){
                            $scope.prodCategoryLists.push($scope.prodCategoryListsCLone[j]);
                        }
                    }
                }
            } else{
                $scope.prodCategoryLists = $scope.prodCategoryListsCLone;
            }
            refreshPicker();
            $scope.filterChange();
        }

        $scope.filterChange = function(){
            $scope.itemList = [];
            $scope.prodItemLists = [];
            if($scope.showDescription && $scope.prodDescriptionList.length){
                if(($scope.showCategory) && ($scope.prodCategoryList.length)){
                    for(var b=0; b<$scope.prodCategoryList.length; b++){
                        if(($scope.showBrand) && ($scope.brandList.length)){
                            for(var c=0; c<$scope.brandList.length; c++){
                                for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                    if(($scope.prodItemListsClone[d].prodName._id == $scope.prodCategoryList[b]) && ($scope.prodItemListsClone[d].brandName._id == $scope.brandList[c])){
                                        if(($scope.showAttribute) && ($scope.prodItemListsClone[d].attribute)){
                                            var itemMatch=true;
                                            for(var e=0; e<$scope.attribute.length; e++){
                                                var attributeMatch=false;
                                                if($scope.attribute[e]){
                                                    for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                        for(var g=0; g<$scope.attribute[e].length; g++){
                                                            if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                                attributeMatch = true;
                                                            }
                                                        }
                                                    }
                                                } else{
                                                    attributeMatch = true;
                                                }
                                                if(!attributeMatch){
                                                    itemMatch = false;
                                                }
                                            }
                                            if(itemMatch){
                                                $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                                $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                            }
                                        } else{
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    }
                                }
                            }
                        } else{
                            for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                if($scope.prodItemListsClone[d].prodName._id == $scope.prodCategoryList[b]){
                                    if(($scope.showAttribute) && ($scope.prodItemListsClone[d].attribute)){
                                        var itemMatch=true;
                                        for(var e=0; e<$scope.attribute.length; e++){
                                            var attributeMatch=false;
                                            if($scope.attribute[e]){
                                                for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                    for(var g=0; g<$scope.attribute[e].length; g++){
                                                        if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                            attributeMatch = true;
                                                        }
                                                    }
                                                }
                                            }
                                            if(!attributeMatch){
                                                itemMatch = false;
                                            }
                                        }
                                        if(itemMatch){
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    } else{
                                        $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                        $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                    }
                                }
                            }
                        }
                    }
                } else{
                    for(var b=0; b<$scope.prodCategoryLists.length; b++){
                        if(($scope.showBrand) && ($scope.brandList.length)){
                            for(var c=0; c<$scope.brandList.length; c++){
                                for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                    if(($scope.prodItemListsClone[d].prodName._id == $scope.prodCategoryLists[b]._id) && ($scope.prodItemListsClone[d].brandName._id == $scope.brandList[c])){
                                        if($scope.showAttribute && $scope.prodItemListsClone[d].attribute){
                                            var itemMatch=true;
                                            for(var e=0; e<$scope.attribute.length; e++){
                                                var attributeMatch=false;
                                                if($scope.attribute[e]){
                                                    for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                        for(var g=0; g<$scope.attribute[e].length; g++){
                                                            if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                                attributeMatch = true;
                                                            }
                                                        }
                                                    }
                                                } else{
                                                    attributeMatch = true;
                                                }
                                                if(!attributeMatch){
                                                    itemMatch = false;
                                                }
                                            }
                                            if(itemMatch){
                                                $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                                $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                            }
                                        } else{
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    }
                                }
                            }
                        } else{
                            for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                if($scope.prodItemListsClone[d].prodName._id == $scope.prodCategoryLists[b]._id){
                                    if($scope.showAttribute && $scope.prodItemListsClone[d].attribute){
                                        var itemMatch=true;
                                        for(var e=0; e<$scope.attribute.length; e++){
                                            var attributeMatch = false;
                                            if($scope.attribute[e]){
                                                for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                    for(var g=0; g<$scope.attribute[e].length; g++){
                                                        if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                            attributeMatch = true;
                                                        }
                                                    }
                                                }
                                            } else{
                                                attributeMatch = true;
                                            }
                                            if(!attributeMatch){
                                                itemMatch = false;
                                            }
                                        }
                                        if(itemMatch){
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    } else{
                                        $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                        $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                    }
                                }
                            }
                        }
                    }
                }
            } else{
                if(($scope.showCategory) && ($scope.prodCategoryList.length)){
                    for(var b=0; b<$scope.prodCategoryList.length; b++){
                        if(($scope.showBrand) && ($scope.brandList.length)){
                            for(var c=0; c<$scope.brandList.length; c++){
                                for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                    if(($scope.prodItemListsClone[d].prodName._id == $scope.prodCategoryList[b]) && ($scope.prodItemListsClone[d].brandName._id == $scope.brandList[c])){
                                        if(($scope.showAttribute) && ($scope.prodItemListsClone[d].attribute)){
                                            var itemMatch=true;
                                            for(var e=0; e<$scope.attribute.length; e++){
                                                var attributeMatch=false;
                                                if($scope.attribute[e]){
                                                    for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                        for(var g=0; g<$scope.attribute[e].length; g++){
                                                            if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                                attributeMatch = true;
                                                            }
                                                        }
                                                    }
                                                } else{
                                                    attributeMatch = true;
                                                }
                                                if(!attributeMatch){
                                                    itemMatch = false;
                                                }
                                            }
                                            if(itemMatch){
                                                $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                                $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                            }
                                        } else{
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    }
                                }
                            }
                        } else{
                            for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                if($scope.prodItemListsClone[d].prodName._id == $scope.prodCategoryList[b]){
                                    if(($scope.showAttribute) && ($scope.prodItemListsClone[d].attribute)){
                                        var itemMatch=true;
                                        for(var e=0; e<$scope.attribute.length; e++){
                                            var attributeMatch=false;
                                            if($scope.attribute[e]){
                                                for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                    for(var g=0; g<$scope.attribute[e].length; g++){
                                                        if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                            attributeMatch = true;
                                                        }
                                                    }
                                                }
                                            } else{
                                                attributeMatch = true;
                                            }
                                            if(!attributeMatch){
                                                itemMatch = false;
                                            }
                                        }
                                        if(itemMatch){
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    } else{
                                        $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                        $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                    }
                                }
                            }
                        }
                    }
                } else{
                    if(($scope.showBrand) && ($scope.brandList.length)){
                        for(var c=0; c<$scope.brandList.length; c++){
                            for(var d=0; d<$scope.prodItemListsClone.length; d++){
                                if($scope.prodItemListsClone[d].brandName._id == $scope.brandList[c]){
                                    if($scope.showAttribute && $scope.prodItemListsClone[d].attribute){
                                        var itemMatch=true;
                                        for(var e=0; e<$scope.attribute.length; e++){
                                            var attributeMatch=false;
                                            if($scope.attribute[e]){
                                                for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                                    for(var g=0; g<$scope.attribute[e].length; g++){
                                                        attributeMatch = true;
                                                        if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                            attributeMatch = true;
                                                        }
                                                    }
                                                }
                                            } else{
                                                attributeMatch = true;
                                            }
                                            if(!attributeMatch){
                                                itemMatch = false;
                                            }
                                        }
                                        if(itemMatch){
                                            $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                            $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                        }
                                    } else{
                                        $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                        $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                    }
                                }
                            }
                        }
                    } else{
                        for(var d=0; d<$scope.prodItemListsClone.length; d++){
                            if($scope.showAttribute && $scope.prodItemListsClone[d].attribute){
                                var itemMatch=true;
                                for(var e=0; e<$scope.attribute.length; e++){
                                    var attributeMatch=false;
                                    if($scope.attribute[e]){
                                        for(var f=0; f<$scope.prodItemListsClone[d].attribute.length; f++){
                                            for(var g=0; g<$scope.attribute[e].length; g++){
                                                if($scope.attribute[e][g] == $scope.prodItemListsClone[d].attribute[f].value){
                                                    attributeMatch = true;
                                                }
                                            }
                                        }
                                    } else{
                                        attributeMatch = true;
                                    }
                                    if(!attributeMatch){
                                        itemMatch = false;
                                    }
                                }
                                if(itemMatch){
                                    $scope.itemList.push($scope.prodItemListsClone[d]._id);
                                    $scope.prodItemLists.push($scope.prodItemListsClone[d]);
                                }
                            }
                        }
                    }
                }
            }
            refreshPicker();
        }

        $scope.search = function(){
            if(($scope.salepointList.length) && ($scope.itemList.length)){
                var today = undefined;
                if(angular.element($('#ason')).val()){
                    if(angular.element($('#ason')).val() != $filter('date')(new Date(), "yyyy-MM-dd")){
                        today = angular.element($('#ason')).val();
                    }
                }
                swal({text:'Loading', showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                InventoryService.stockStatus({itm:$scope.itemList, sp:$scope.salepointList, date:today, age:$scope.showAge}).then(function(res){
                    if(res.data){
                        $scope.stocks = res.data;
                        genetrateTable();
                    }
                });
                $scope.newspList = [];
                for(var i=0; i<$scope.salepointList.length; i++){
                    var spInd = $scope.salePointLists.findIndex(x => x._id == $scope.salepointList[i]);
                    if(spInd >= 0){
                        $scope.newspList.push($scope.salePointLists[spInd]);
                    }
                }
            } else{
                swal("", "Select Item And Salepoint");
            }
        }

        function genetrateTable(){
            $("#stockTable tbody").empty();
            var itemHTML, salepointHTML, tableHTML, itemMatch;
            tableHTML = "";
            $scope.prodItemLists.forEach(function(itemElem){
                var itmInd = $scope.itemList.findIndex(x => x == itemElem._id);
                if(itmInd >= 0){
                    salepointHTML = "";
                    $scope.salePointLists.forEach(function(salepointElem){
                        var spInd = $scope.salepointList.findIndex(x => x == salepointElem._id);
                        if(spInd >= 0){
                            itemMatch = false;
                            $scope.stocks.forEach(function(stockElem){
                                if((stockElem.salePoint._id == salepointElem._id) && (stockElem.name._id == itemElem._id)){
                                    itemMatch = true;
                                    salepointHTML += ('<td class="text-right">' + stockElem.quantity + '</td>');
                                    if($scope.showAge){
                                        salepointHTML += ('<td class="text-right">' + stockElem.age + '</td>');
                                    }
                                }
                            });
                            if(!itemMatch){
                                salepointHTML += ('<td class="text-right">-</td>');
                                if($scope.showAge){
                                    salepointHTML += ('<td class="text-right">-</td>');
                                }
                            }
                        }
                    });
                    itemHTML = ('<tr><td>' + itemElem.itemName + '</td>');
                    tableHTML += (itemHTML + salepointHTML + '</tr>');
                }
            });
            if(tableHTML != ""){
                $("#stockTable").append(tableHTML + '</tbody>');
            }else{
                $("#stockTable").append('</tbody>');
            }
            refreshPicker();
            $scope.showAge1 = $scope.showAge;
            $scope.showTable = true;
            swal.close();
        }

        $scope.excelAlert = function(tableId){
            if($scope.stocks.length){
                swal({// type: "info", animation: true,
                    title:"Choose " + $scope.spName[1] + " Mode", confirmButtonText:"Without " + $scope.spName[1], confirmButtonColor:'#7AC29A', showCancelButton:true, cancelButtonText:"With " + $scope.spName[1], cancelButtonColor:'#EB5E28',}).then(function(isConfirm){
                    if(isConfirm){
                        // XLS format
                        // ExcelService.exportTable(tableId,'Stock Status ' + new Date());
                        var stockItems = [];
                        if($scope.showAge){
                            for(var i = 0; i < $scope.prodItemLists.length; i++){
                                var itmInd = $scope.itemList.findIndex(x => x == $scope.prodItemLists[i]._id);
                                if(itmInd >= 0){
                                    stockItems.push({'Item_Name': $scope.prodItemLists[i].itemName});
                                    for(var j = 0; j < $scope.newspList.length; j++){
                                        stockItems[i][$scope.newspList[j].name] = '-';
                                        for(let k = 0; k < $scope.stocks.length; k++) {
                                            if(($scope.prodItemLists[i].itemName == $scope.stocks[k].name.itemName) && ($scope.newspList[j].name == $scope.stocks[k].salePoint.name)){
                                                stockItems[i][$scope.newspList[j].name] = $scope.stocks[k].quantity;
                                                if($scope.stocks[k].age){
                                                    stockItems[i]['Age'] = $scope.stocks[k].age;
                                                } else{
                                                    stockItems[i]['Age'] = "";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else{
                            for(var i = 0; i < $scope.prodItemLists.length; i++){
                                var itmInd = $scope.itemList.findIndex(x => x == $scope.prodItemLists[i]._id);
                                if(itmInd >= 0){
                                    stockItems.push({'Item_Name': $scope.prodItemLists[i].itemName});
                                    for(var j = 0; j < $scope.newspList.length; j++){
                                        stockItems[i][$scope.newspList[j].name] = '-';
                                        for(let k = 0; k < $scope.stocks.length; k++) {
                                            if(($scope.prodItemLists[i].itemName == $scope.stocks[k].name.itemName) && ($scope.newspList[j].name == $scope.stocks[k].salePoint.name)){
                                                stockItems[i][$scope.newspList[j].name] = $scope.stocks[k].quantity;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        ExcelService.exportXLSX('Items','stock_status_report_' + $scope.ason, stockItems);
                    }
                }).catch(function(isCancel){
                    if(isCancel){
                        var stockItems = [];
                        if($scope.showAge){
                            for(var i = 0; i < $scope.prodItemLists.length; i++){
                                var itmInd = $scope.itemList.findIndex(x => x == $scope.prodItemLists[i]._id);
                                if(itmInd >= 0){
                                    stockItems.push({'Item_Name': $scope.prodItemLists[i].itemName});
                                    var stockItemsLength = stockItems.length;
                                    for(var j = 0; j < $scope.newspList.length; j++){
                                        stockItems[stockItemsLength - 1][$scope.newspList[j].name] = 0;
                                        for(let k = 0; k < $scope.stocks.length; k++){
                                            if(($scope.prodItemLists[i].itemName == $scope.stocks[k].name.itemName) && ($scope.newspList[j].name == $scope.stocks[k].salePoint.name)){
                                                stockItems[stockItemsLength - 1][$scope.newspList[j].name] = $scope.stocks[k].quantity;
                                                if($scope.stocks[k].age){
                                                    stockItems[stockItemsLength - 1][$scope.newspList[j].name + ' -> Age'] = $scope.stocks[k].age;
                                                }
                                                if($scope.stocks[k].IMEINumber){
                                                    var lengthExist = false;
                                                    for(var l = 0; l < $scope.stocks[k].IMEINumber.length; l++){
                                                        if(!lengthExist){
                                                            if(stockItems.length > stockItemsLength){
                                                                stockItems[stockItemsLength + l][$scope.newspList[j].name] =  $scope.stocks[k].IMEINumber[l].IMEI.join(' / ');
                                                                if($scope.stocks[k].IMEINumber[l].age){
                                                                    stockItems[stockItemsLength + l][$scope.newspList[j].name + ' -> Age'] = $scope.stocks[k].IMEINumber[l].age;
                                                                }
                                                            } else{
                                                                lengthExist = true;
                                                                stockItems.push({[$scope.newspList[j].name]: $scope.stocks[k].IMEINumber[l].IMEI.join(' / ')});
                                                                if($scope.stocks[k].IMEINumber[l].age){
                                                                    stockItems[stockItems.length - 1][$scope.newspList[j].name + ' -> Age'] = $scope.stocks[k].IMEINumber[l].age;
                                                                }
                                                            }
                                                        } else{
                                                            stockItems.push({[$scope.newspList[j].name]:$scope.stocks[k].IMEINumber[l].IMEI.join(' / ')});
                                                            if($scope.stocks[k].IMEINumber[l].age){
                                                                stockItems[stockItems.length - 1][$scope.newspList[j].name + ' -> Age'] = $scope.stocks[k].IMEINumber[l].age;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else{
                            for(var i = 0; i < $scope.prodItemLists.length; i++){
                                var itmInd = $scope.itemList.findIndex(x => x == $scope.prodItemLists[i]._id);
                                if(itmInd >= 0){
                                    stockItems.push({'Item_Name': $scope.prodItemLists[i].itemName});
                                    var stockItemsLength = stockItems.length;
                                    for(var j = 0; j < $scope.newspList.length; j++){
                                        stockItems[stockItemsLength - 1][$scope.newspList[j].name] = 0;
                                        for(let k = 0; k < $scope.stocks.length; k++){
                                            if(($scope.prodItemLists[i].itemName == $scope.stocks[k].name.itemName) && ($scope.newspList[j].name == $scope.stocks[k].salePoint.name)){
                                                stockItems[stockItemsLength - 1][$scope.newspList[j].name] = $scope.stocks[k].quantity;
                                                if($scope.stocks[k].IMEINumber){
                                                    var lengthExist = false;
                                                    for(var l = 0; l < $scope.stocks[k].IMEINumber.length; l++){
                                                        if(!lengthExist){
                                                            if(stockItems.length > stockItemsLength){
                                                                stockItems[stockItemsLength + l][$scope.newspList[j].name] =  $scope.stocks[k].IMEINumber[l].IMEI.join(' / ');
                                                            } else{
                                                                lengthExist = true;
                                                                stockItems.push({[$scope.newspList[j].name]: $scope.stocks[k].IMEINumber[l].IMEI.join(' / ')});
                                                            }
                                                        } else{
                                                            stockItems.push({[$scope.newspList[j].name]: $scope.stocks[k].IMEINumber[l].IMEI.join(' / ')});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        ExcelService.exportXLSX('Items', 'stock_status_report_' + $scope.ason, stockItems);
                    }
                })
            } else{
                swal('', 'No Item');
            }
        }

        // function onlyUnique(value, index, self){ 
        //     return self.indexOf(value) == index;
        // }
    }
}());