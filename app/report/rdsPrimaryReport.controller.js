(function() {
    'use strict';
    angular.module('app').controller('RdsPrimaryReport.IndexController', rdsPrimaryReportController);

    function rdsPrimaryReportController(MasterService, UserService, InventoryService, ExcelService, ClientService, $scope, $state){

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
            $scope.withIMEI = false;
            $scope.generalOption = "Primary";
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
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format:'YYYY-MM-DD'});
            });
        }

        $scope.generalOptChange = function(){
            switch($scope.generalOption){
                case "Primary": $state.go('reports.rdsPrimaryReport');
                                break;
                case "Secondary": $state.go('reports.rdsSecondaryReport');
                                break;
                case "Stock": $state.go('reports.rdsStockReport');
                                break;
                case "Activation": $state.go('reports.rdsActivationReport');
                                break;
                // case "KYC": $state.go('reports.rdsKyc');
                //             break;
                default: $state.go('reports.rdsPrimaryReport');
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
            if((angular.element($('#startFrom')).val()) && (angular.element($('#endAt')).val()) && ($scope.itemList.length)){
                swal({title:'Loading', showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                InventoryService.rdsPrimarySummary({start:angular.element($('#startFrom')).val(), end:angular.element($('#endAt')).val(), item:$scope.itemList, imei:$scope.withIMEI}).then(function(res){
                    if(res.data.length){
                        if($scope.withIMEI){
                            genetrateJsonWithImei(res.data);
                        } else {
                            genetrateJson(res.data);
                        }
                    } else{
                        swal.close();
                        swal('', 'Data Not Found');
                    }
                });
            } else{
                swal('', 'Select Both From & To Date and Model Name');
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
                    for(var itemInd = 0; itemInd < $scope.itemList.length; itemInd++){
                        var resultInd = result.findIndex(x => (x._id.model === $scope.itemList[itemInd] && x._id.authorID === $scope.rds[rdsInd]['authorID']));
                        var modelInd = $scope.prodItemLists.findIndex(x => x._id === $scope.itemList[itemInd]);
                        if(resultInd >= 0){
                            if(result[resultInd]['IMEI']){
                                for(var imeInd1 = 0; imeInd1 < result[resultInd]['IMEI'].length; imeInd1++){
                                    for(var imeInd2 = 0; imeInd2 < result[resultInd]['IMEI'][imeInd1].length; imeInd2++){
                                        reportJson.push({
                                            'S.No': reportJson.length + 1,
                                            'State': $scope.rds[rdsInd]['refID']['areaDistribution']['state']['name'],
                                            'Zone': zoneName,
                                            'District': $scope.rds[rdsInd]['refID']['areaDistribution']['district']['name'],
                                            'Sales Person': empName,
                                            'RDS Name': $scope.rds[rdsInd]['refID']['name'],
                                            'RDS Region': $scope.rds[rdsInd]['refID']['areaDistribution']['region']['name'],
                                            'Item Name': $scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name']
                                        });
                                        for(var imeInd3=0; imeInd3<result[resultInd]['IMEI'][imeInd1][imeInd2]['IMEI'].length; imeInd3++){
                                            var init = imeInd3 + 1;
                                            reportJson[reportJson.length - 1]['IMEI' + init] =  result[resultInd]['IMEI'][imeInd1][imeInd2]['IMEI'][imeInd3].toString();
                                        }
                                        if(result[resultInd]['IMEI'][imeInd1][imeInd2]['boxno']){
                                            reportJson[reportJson.length - 1]['Box No'] =  result[resultInd]['IMEI'][imeInd1][imeInd2]['boxno'];
                                        }
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
                                    'Item Name': $scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name'],
                                    'Quantity': result[resultInd]['qty']
                                });
                            }
                        }
                    }
                }
            }
            ExcelService.exportCSV(reportJson, 'Date:,' + angular.element($('#startFrom')).val() + ',' + angular.element($('#endAt')).val(), 'RDS Primary');
            swal.close();
        }

        function genetrateJson(result){
            var reportJson = [];
            for(var rdsInd = 0; rdsInd < $scope.rds.length; rdsInd++){
                if($scope.rds[rdsInd]['refID']['areaDistribution']){
                    reportJson.push({'S.No': reportJson.length + 1});
                    var curInd = reportJson.length - 1;
                    reportJson[curInd]['State'] = $scope.rds[rdsInd]['refID']['areaDistribution']['state']['name'];
                    var zoneName = "", empName = "";
                    for(var zoneInd = 0; zoneInd < $scope.zones.length; zoneInd++){
                        var distInd = $scope.zones[zoneInd]['district'].findIndex(x => x._id == $scope.rds[rdsInd]['refID']['areaDistribution']['district']['_id']);
                        if(distInd >= 0){
                            zoneName = $scope.zones[zoneInd]['name'];
                        }
                    }
                    reportJson[curInd]['Zone'] = zoneName;
                    reportJson[curInd]['District'] = $scope.rds[rdsInd]['refID']['areaDistribution']['district']['name'];
                    if($scope.rds[rdsInd]['refID']['salesperson'].length){
                        empName = $scope.rds[rdsInd]['refID']['salesperson'].map(a => a.name);
                        empName.toString(',');
                    }
                    reportJson[curInd]['Sales Person'] = empName;
                    reportJson[curInd]['RDS Name'] = $scope.rds[rdsInd]['refID']['name'];
                    reportJson[curInd]['RDS Region'] = $scope.rds[rdsInd]['refID']['areaDistribution']['region']['name'];
                    reportJson[curInd]['Total'] = 0;
                    for(var itemInd = 0; itemInd < $scope.itemList.length; itemInd++){
                        var resultInd = result.findIndex(x => (x._id.model === $scope.itemList[itemInd] && x._id.authorID === $scope.rds[rdsInd]['authorID']));
                        var modelInd = $scope.prodItemLists.findIndex(x => x._id === $scope.itemList[itemInd]);
                        reportJson[curInd][$scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name']] = '';
                        if(resultInd >= 0){
                            reportJson[curInd][$scope.prodItemLists[modelInd]['itemName'] + $scope.prodItemLists[modelInd]['name']] = result[resultInd]['qty'];
                            reportJson[curInd]['Total'] = parseInt(reportJson[curInd]['Total']) + parseInt(result[resultInd]['qty']);
                        }
                    }
                }
            }
            ExcelService.exportCSV(reportJson, 'Date:,' + angular.element($('#startFrom')).val() + ',' + angular.element($('#endAt')).val(), 'RDS Primary Report');
            swal.close();
        }

        $scope.exportClient = function(){
            ClientService.exportClient().then(function(res){
                if(res.data){
                    ExcelService.exportCSV(res.data, 'RDS', 'RDS');
                }
            });
        }
    }
}());