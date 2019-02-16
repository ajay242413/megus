(function() {
    'use strict';
    angular.module('app').controller('DealerStockReport.IndexController', dealerStockReportController);

    function dealerStockReportController(MasterService, UserService, InventoryService, ClientService, ExcelService, $scope, $state){

        var vm=this, activeObj={active:true};
        loadDefault();

        function loadDefault(){
            $scope.itemList = [];
            $scope.brandList = [];
            $scope.prodDescriptionList = [];
            $scope.prodCategoryList = [];
            $scope.prodItem = [];
            $scope.prodAttributeList = [];
            $scope.attributeLists = [];
            $scope.attribute = [];
            $scope.viewType = 'wod';
            $scope.generalOption = 'Stock';
            refreshPicker();
            initController();
        }

        function initController(){
            MasterService.readProductItem(activeObj).then(function(res){
                if(res.data){
                    $scope.prodItemLists = res.data;
                    $scope.prodItemListsClone = res.data;
                    $scope.itemList = $scope.prodItemLists.map(a => a._id);
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

            MasterService.readZone(activeObj).then(function(res){
                if(res.data){
                    $scope.zones = res.data;
                }
            });

            UserService.readClient().then(function(res){
                if(res.data){
                    $scope.rds = res.data;
                }
            });

            UserService.readDealer().then(function(res){
                if(res.data){
                    $scope.dealers = res.data;
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format:'YYYY-MM-DD'});
            });
        }

        $scope.generalOptChange = function(){
            switch($scope.generalOption){
                case "Stock": $state.go('reports.dealerStockReport');
                                break;
                case "Performance": $state.go('reports.performance');
                                break;
                default: $state.go('reports.dealerStockReport');
                            break;
            }
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

        $scope.getReport = function(){
            if((angular.element($('#onDate')).val()) && ($scope.itemList.length)){
                swal({title:'Loading', showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                InventoryService.dealerStockReport({onDate:angular.element($('#onDate')).val(), item:$scope.itemList, type:$scope.viewType}).then(function(res){
                    if(res.data.length){
                        if($scope.viewType == 'imei'){
                            genetrateJsonWithImei(res.data);
                        } else if($scope.viewType == 'wod') {
                            genetrateJsonWithWod(res.data);
                        } else{
                            genetrateJson(res.data);
                        }
                    } else {
                        swal.close();
                        swal('', 'Data Not Found');
                    }
                });
            } else {
                swal('', 'Select As On Date and Model Name');
            }
        }

        function genetrateJsonWithImei(result){
            var reportJson = [];
            for(var rdsInd = 0; rdsInd < $scope.rds.length; rdsInd++){
                if($scope.rds[rdsInd]['refID']['areaDistribution']){
                    var zoneName = "", empName = "";
                    for(var zoneInd = 0; zoneInd < $scope.zones.length; zoneInd++){
                        var distInd = $scope.zones[zoneInd]['district'].findIndex(x => x._id == $scope.rds[rdsInd]['refID']['areaDistribution']['district']['_id']);
                        if(distInd >= 0){
                            zoneName = $scope.zones[zoneInd]['name'];
                        }
                    }
                    if($scope.rds[rdsInd]['refID']['salesperson'].length){
                        empName = $scope.rds[rdsInd]['refID']['salesperson'].map(a => a.name);
                        empName.toString(',');
                    }
                    for(var dealerInd = 0; dealerInd < $scope.dealers.length; dealerInd++){
                        var check = result.findIndex(x => (x._id.authorID === $scope.rds[rdsInd]['_id'] && x._id.party === $scope.dealers[dealerInd]._id));
                        if(check >= 0){
                            var catName = "";
                            if($scope.dealers[dealerInd]['refID']['category']){
                                catName = $scope.dealers[dealerInd]['refID']['category']['name']
                            }
                            for(var itemInd = 0; itemInd < $scope.itemList.length; itemInd++){
                                var resultInd = result.findIndex(x => (x._id.model === $scope.itemList[itemInd] && x._id.authorID === $scope.rds[rdsInd]['_id'] && x._id.party === $scope.dealers[dealerInd]._id));
                                if(resultInd >= 0){
                                    var modelInd = $scope.prodItemLists.findIndex(x => x._id === $scope.itemList[itemInd]);
                                    if(result[resultInd]['IMEI']){
                                        for(var imeInd1 = 0; imeInd1 < result[resultInd]['IMEI'].length; imeInd1++){
                                            reportJson.push({
                                                'S.No': reportJson.length + 1,
                                                'State': $scope.rds[rdsInd]['refID']['areaDistribution']['state']['name'],
                                                'Zone': zoneName,
                                                'District': $scope.rds[rdsInd]['refID']['areaDistribution']['district']['name'],
                                                'Sales Person': empName,
                                                'RDS Name': $scope.rds[rdsInd]['refID']['name'],
                                                'RDS Region': $scope.rds[rdsInd]['refID']['areaDistribution']['region']['name'],
                                                'Dealer Name': $scope.dealers[dealerInd]['refID']['name'],
                                                'Dealer Category': catName,
                                                'Dealer Area': $scope.dealers[dealerInd]['refID']['area']['name'],
                                                'Item Name': $scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name']
                                            });
                                            for(var imeInd2=0; imeInd2<result[resultInd]['IMEI'][imeInd1]['imei'].length; imeInd2++){
                                                var init = imeInd2 + 1;
                                                reportJson[reportJson.length - 1]['IMEI' + init] =  result[resultInd]['IMEI'][imeInd1]['imei'][imeInd2].toString();
                                            }
                                            if(result[resultInd]['IMEI'][imeInd1]['boxno']){
                                                reportJson[reportJson.length - 1]['Box No'] =  result[resultInd]['IMEI'][imeInd1]['boxno'];
                                            }
                                        }
                                    } else{
                                        reportJson.push({
                                            'S.No': reportJson.length + 1,
                                            'State': $scope.rds[rdsInd]['refID']['areaDistribution']['state']['name'],
                                            'Zone': zoneName,
                                            'District': $scope.rds[rdsInd]['refID']['areaDistribution']['district']['name'],
                                            'Sales Person': empName,
                                            'RDS Name': $scope.rds[rdsInd]['refID']['name'],
                                            'RDS Region': $scope.rds[rdsInd]['refID']['areaDistribution']['region']['name'],
                                            'Dealer Name': $scope.dealers[dealerInd]['refID']['name'],
                                            'Dealer Category': catName,
                                            'Dealer Area': $scope.dealers[dealerInd]['refID']['area']['name'],
                                            'Item Name': $scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name'],
                                            'Quantity': result[resultInd]['qty']
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ExcelService.exportCSV(reportJson, 'As on Date:,' + ',' + angular.element($('#onDate')).val(), 'Dealer Stock Report');
            swal.close();
        }

        function genetrateJson(result){
            var reportJson = [];
            for(var rdsInd = 0; rdsInd < $scope.rds.length; rdsInd++){
                if($scope.rds[rdsInd]['refID']['areaDistribution']){
                    var zoneName = "", empName = "";
                    for(var zoneInd = 0; zoneInd < $scope.zones.length; zoneInd++){
                        var distInd = $scope.zones[zoneInd]['district'].findIndex(x => x._id == $scope.rds[rdsInd]['refID']['areaDistribution']['district']['_id']);
                        if(distInd >= 0){
                            zoneName = $scope.zones[zoneInd]['name'];
                        }
                    }
                    if($scope.rds[rdsInd]['refID']['salesperson'].length){
                        empName = $scope.rds[rdsInd]['refID']['salesperson'].map(a => a.name);
                        empName.toString(',');
                    }
                    for(var dealerInd = 0; dealerInd < $scope.dealers.length; dealerInd++){
                        var check = result.findIndex(x => (x._id.authorID === $scope.rds[rdsInd]['_id'] && x._id.party === $scope.dealers[dealerInd]._id));
                        if(check >= 0){
                            reportJson.push({
                                'S.No': reportJson.length + 1,
                                'State': $scope.rds[rdsInd]['refID']['areaDistribution']['state']['name'],
                                'Zone': zoneName,
                                'District': $scope.rds[rdsInd]['refID']['areaDistribution']['district']['name'],
                                'Sales Person': empName,
                                'RDS Name': $scope.rds[rdsInd]['refID']['name'],
                                'RDS Region': $scope.rds[rdsInd]['refID']['areaDistribution']['region']['name'],
                                'Dealer Name': $scope.dealers[dealerInd]['refID']['name'],
                                'Dealer Category': '',
                                'Dealer Area': $scope.dealers[dealerInd]['refID']['area']['name'],
                                'Total': 0
                            });
                            var curInd = reportJson.length - 1;
                            if($scope.dealers[dealerInd]['refID']['category']){
                                reportJson[curInd]['Dealer Category'] = $scope.dealers[dealerInd]['refID']['category']['name']
                            }
                            for(var itemInd  = 0; itemInd < $scope.itemList.length; itemInd++){
                                var resultInd = result.findIndex(x => (x._id.model === $scope.itemList[itemInd] && x._id.authorID === $scope.rds[rdsInd]['_id']  && x._id.party === $scope.dealers[dealerInd]._id));
                                if(resultInd >= 0){
                                    var modelInd = $scope.prodItemLists.findIndex(x => x._id === $scope.itemList[itemInd]);
                                    reportJson[curInd][$scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name']] = result[resultInd]['qty'];
                                    reportJson[curInd]['Total'] = parseInt(reportJson[curInd]['Total']) + parseInt(result[resultInd]['qty']);
                                }
                            }
                        }
                    }
                }
            }
            ExcelService.exportCSV(reportJson, 'As on Date:,' + ',' + angular.element($('#onDate')).val(), 'Dealer Stock Report');
            swal.close();
        }

        function genetrateJsonWithWod(result){
            var reportJson = [];
            for(var rdsInd = 0; rdsInd < $scope.rds.length; rdsInd++){
                if($scope.rds[rdsInd]['refID']['areaDistribution']){
                    var zoneName = "", empName = "";
                    for(var zoneInd = 0; zoneInd < $scope.zones.length; zoneInd++){
                        var distInd = $scope.zones[zoneInd]['district'].findIndex(x => x._id == $scope.rds[rdsInd]['refID']['areaDistribution']['district']['_id']);
                        if(distInd >= 0){
                            zoneName = $scope.zones[zoneInd]['name'];
                        }
                    }
                    if($scope.rds[rdsInd]['refID']['salesperson'].length){
                        empName = $scope.rds[rdsInd]['refID']['salesperson'].map(a => a.name);
                        empName.toString(',');
                    }
                    var check = result.findIndex(x => x._id.authorID === $scope.rds[rdsInd]['_id']);
                    if(check >= 0){
                        reportJson.push({
                            'S.No': reportJson.length + 1,
                            'State': $scope.rds[rdsInd]['refID']['areaDistribution']['state']['name'],
                            'Zone': zoneName,
                            'District': $scope.rds[rdsInd]['refID']['areaDistribution']['district']['name'],
                            'Sales Person': empName,
                            'RDS Name': $scope.rds[rdsInd]['refID']['name'],
                            'RDS Region': $scope.rds[rdsInd]['refID']['areaDistribution']['region']['name'],
                            'Wod Reach': 0,
                            'Total': 0
                        });
                        var curInd = reportJson.length - 1, maxParty = [];
                        for(var itemInd = 0; itemInd < $scope.itemList.length; itemInd++){
                            var resultInd = result.findIndex(x => (x._id.model === $scope.itemList[itemInd] && x._id.authorID === $scope.rds[rdsInd]['_id']));
                            if(resultInd >= 0){
                                var modelInd = $scope.prodItemLists.findIndex(x => x._id === $scope.itemList[itemInd]);
                                reportJson[curInd][$scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name']] = result[resultInd]['qty'];
                                reportJson[curInd]['Total'] = parseInt(reportJson[curInd]['Total']) + parseInt(result[resultInd]['qty']);
                                maxParty.push(result[resultInd]['party'].length);
                            }
                        }
                        if(Math.max(...maxParty)){
                            reportJson[curInd]['Wod Reach'] = Math.max(...maxParty);
                        }
                    }
                }
            }
            ExcelService.exportCSV(reportJson, 'As on Date:,' + ',' + angular.element($('#onDate')).val(), 'Dealer Stock Report');
            swal.close();
        }

        $scope.exportDealer = function(){
            ClientService.exportDealer().then(function(res){
                if(res.data){
                    ExcelService.exportCSV(res.data, 'Dealer', 'Dealer');
                }
            });
        }
    }
}());