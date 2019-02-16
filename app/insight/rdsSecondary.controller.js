(function(){
    'use strict';
    angular.module('app').controller('RDSsecondary.IndexController', rdsSecondaryController);

    function rdsSecondaryController(MasterService, ClientService, InventoryService, ExcelService, $scope, DTOptionsBuilder){

        var vm=this, activeObj={active:true};
        if($scope.rootUser.userType == 'b'){
            loadDefault();
            vm.refreshPicker = refreshPicker;
            $scope.brandPage = true;
            $scope.distPage = false;
        } else{
            refreshPicker();
            $scope.brandPage = false;
            $scope.distPage = true;
        }
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withOption('searching', true).withOption('info', true);
        
        function loadDefault(){
            $scope.showTable = false;
            $scope.itemList = [];
            $scope.salepointList = [];
            $scope.brandList = [];
            $scope.prodDescriptionList = [];
            $scope.prodCategoryList = [];
            $scope.prodItem = [];
            $scope.prodAttributeList = [];
            $scope.attributeLists = [];
            $scope.attribute = [];
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

            MasterService.readState(activeObj).then(function(res){
                if(res.data){
                    $scope.states = res.data;
                }
            });

            MasterService.readZone(activeObj).then(function(res){
                if(res.data){
                    $scope.zones = res.data;
                }
            });

            MasterService.readDistrict(activeObj).then(function(res){
                if(res.data){
                    $scope.districts = res.data;
                }
            });

            ClientService.readClient().then(function(res){
                if(res.data){
                    $scope.rds = res.data;
                }
            });

            ClientService.readDealer().then(function(res){
                if(res.data){
                    $scope.dealers = res.data;
                }
            });
            chartForTopSellingDealersCategoryA();
            chartForTopSellingDealersCategoryB();
            chartForDealerStockSummary();
            chartForActivationBasedOnVolume();
        }

        function chartForTopSellingDealersCategoryA(){
            var chart = c3.generate({
                bindto: '#topSellingDealersCatA',
                data: {
                    x: 'x',
                    columns: [
                        ['x','Dealer1', 'Dealer2', 'Dealer3', 'Dealer4', 'Dealer5', 'Dealer6'],
                        ['Model1', 30, 200, 200, 400, 150, 250],
                        ['Model2', 130, 100, 100, 200, 150, 50],
                        ['Model3', 230, 200, 200, 300, 250, 250],
                        ['Model4', 155, 100, 75, 90, 25, 50]
                    ],
                    type: 'bar',
                    colors: {
                        Model1: '#FFC300',
                        Model2: '#DAF7A6',
                        Model3: '#FF5733',
                        Model4: '#45B39D'
                    },
                    groups: [
                        ['Model1', 'Model2','Model3', 'Model4']
                    ]
                },
                grid: {
                    y: {
                        lines: [{value:0}]
                    }
                },
                axis: {
                    x: {
                        type: 'category',
                        tick: {
                            multiline: false
                        },
                        label: { // ADD
                            text: 'Dealers',
                            position: 'outer-middle'
                          }
                    },
                    y: {
                        
                        label: { // ADD
                            text: 'Quantity',
                            position: 'outer-right'
                          }
                    }
                }
            });
           
        }
        function chartForTopSellingDealersCategoryB(){
            var chart = c3.generate({
                bindto: '#topSellingDealersCatB',
                data: {
                    x: 'x',
                    columns: [
                        ['x','Dealer1', 'Dealer2', 'Dealer3', 'Dealer4', 'Dealer5', 'Dealer6'],
                        ['Model1', 30, 200, 200, 400, 150, 250],
                        ['Model2', 130, 100, 100, 200, 150, 50],
                        ['Model3', 230, 200, 200, 300, 250, 250]
                    ],
                    type: 'bar',
                    groups: [
                        ['Model1', 'Model2']
                    ]
                },
                grid: {
                    y: {
                        lines: [{value:0}]
                    }
                },
                axis: {
                    x: {
                        type: 'category',
                        tick: {
                            multiline: false
                        },
                        label: { // ADD
                            text: 'Dealers',
                            position: 'outer-middle'
                          }
                    },
                    y: {
                        
                        label: { // ADD
                            text: 'Quantity',
                            position: 'outer-right'
                          }
                    }
                }
            });
            
            setTimeout(function () {
                chart.groups([['Model1', 'Model2', 'Model3']])
            }, 1000);
            
            setTimeout(function () {
                chart.load({
                    columns: [['Model4', 100, 50, 150, 200, 300, 100]]
                });
            }, 1500);
            
            setTimeout(function () {
                chart.groups([['Model1', 'Model2', 'Model3', 'Model4']])
            }, 2000);
        }

        function chartForDealerStockSummary(){      
            var chart = c3.generate({
                bindto: '#dealersStockSummary',
                
                data: {
                    // iris data from R
                    columns: [
                        ['ModelA', 30],
                        ['ModelB', 120]    
                    ],
                    type : 'pie',
                  
                },
                colors: {
                    ModelA: '#ff0000',
                    ModelB: '#00ff00',
                    ModelC: '#0000ff',
                    ModelD: '#00ccc'
                },
                tooltip: {
                    format: {
                        title: function (value, ratio, id) {
                            return id;
                        },
                        value: function (value, ratio, id) {
                            return value;
                        }
            
                }
            }
            });
            
            setTimeout(function () {
                chart.load({
                    columns: [        
                        ['ModelA', 30],
                        ['ModelB', 120],               
                        ['ModelC', 100],
                        ['ModelD', 40],
                    ],
                });
            }, 1500);
                
        }
        function chartForActivationBasedOnVolume(){
            var chart = c3.generate({
                bindto: '#VolumePerDealerCategory',
                data: {
                    x: 'x',
                    columns: [
                        ['x','0-5999', '6000-9999', '10,000-14999', '15000-23999'],
                        ['CategoryA', 30, 200, 200, 400, 150, 250],
                        ['CategoryB', 130, 100, 100, 200, 150, 50],
                        ['CategoryC', 230, 200, 200, 300, 250, 250]
                    ],
                    type: 'bar',
                    colors: {
                        Model1: '#FFC300',
                        Model2: '#DAF7A6',
                        Model3: '#FF5733',
                        Model4: '#45B39D'
                    },
                    groups: [
                        ['CategoryA', 'CategoryB']
                    ]
                },
                grid: {
                    y: {
                        lines: [{value:0}]
                    }
                },
                axis: {
                    x: {
                        type: 'category',
                        tick: {
                            multiline: false
                        },
                        label: { // ADD
                            text: 'Dealers',
                            position: 'outer-middle'
                          }
                    },
                    y: {
                        
                        label: { // ADD
                            text: 'Quantity',
                            position: 'outer-right'
                          }
                    }
                }
            });
            
            setTimeout(function () {
                chart.groups([['CategoryA', 'CategoryB', 'CategoryC']])
            }, 1000);
            
            setTimeout(function () {
                chart.load({
                    columns: [['CategoryD', 100, 50, 150, 200, 300, 100]]
                });
            }, 1500);
            
            setTimeout(function () {
                chart.groups([['CategoryA', 'CategoryB', 'CategoryC', 'CategoryD']])
            }, 2000);
        }
        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format:'YYYY-MM-DD'});
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

        $scope.getReport = function(){
            if((angular.element($('#startFrom')).val()) && (angular.element($('#endAt')).val()) && ($scope.itemList.length)){
                swal({title:'Loading', showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                InventoryService.rdsSecondarySummary({start:angular.element($('#startFrom')).val(), end:angular.element($('#endAt')).val(), item:$scope.itemList}).then(function(res){
                    swal.close();
                    if(res.data.length){
                        $scope.prodItem = [];
                        for(var i=0; i<$scope.prodItemLists.length; i++){
                            for(var j=0; j<$scope.itemList.length; j++){
                                if($scope.prodItemLists[i]._id == $scope.itemList[j]){
                                    $scope.prodItem.push($scope.prodItemLists[i]);
                                }
                            }
                        }
                        genetrateTable(res.data);
                    } else{
                        $("#rdsSecondary tbody").empty();
                        $scope,showTable = false;
                        swal('', 'Data Not Found');
                    }
                });
            } else{
                swal('', 'Select Both dates and Models');
            }
        }

        function genetrateTable(report){
            $("#rdsSecondary tbody").empty();
            var stateHTML, districtHTML, rdsHTML, dealerHTML, tableHTML, zoneHTML, dealersHTML;
            var stateRowCount, stateRowSpan, stateMatch;
            var zoneRowCount, zoneRowSpan, zoneMatch;
            var distRowCount, distRowSpan, distMatch;
            var rdsRowCount, rdsRowSpan, rdsMatch;
            var dealerRowCount, dealerRowSpan, dealerMatch;
            var modelRowSpan, modelMatch;
            var modelCount = 0, modelHTML = "";
            $scope.states.forEach(function(stateElem){
                stateMatch = false, stateRowSpan = 1, zoneRowCount = 0, zoneHTML = "";
                $scope.zones.forEach(function(zoneElem){
                    zoneMatch = false, zoneRowSpan = 1, distRowCount = 0, districtHTML = "";
                    $scope.districts.forEach(function(distElem){
                        distMatch = false, distRowSpan = 1, rdsRowCount = 0, rdsHTML = "";
                        var zoneInd = zoneElem.district.findIndex(x => x._id === distElem._id);
                        if((zoneElem.state._id === stateElem._id) && (zoneInd >= 0)){
                            $scope.rds.forEach(function(rdsElem){
                                rdsMatch = false, rdsRowSpan = 1, dealerRowCount = 0, dealersHTML = "";
                                $scope.dealers.forEach(function(dealerElem){
                                    modelCount = 0, modelHTML = "";
                                    dealerMatch = false, dealerRowSpan = 1, dealerHTML = "";
                                    if(rdsElem.areaDistribution){
                                        if((rdsElem.areaDistribution.state._id === stateElem._id) && (rdsElem.areaDistribution.district._id === distElem._id)){
                                            if(dealerElem.authorID.refID._id === rdsElem._id){
                                                distMatch = true;
                                                stateMatch = true;
                                                rdsMatch = true;
                                                zoneMatch = true;
                                                dealerMatch = true;
                                            }
                                        }
                                    }
                                    if(!dealerMatch){
                                        return;
                                    }
                                    dealerRowSpan = dealerRowSpan * 1;
                                    dealerRowCount += dealerRowSpan;
                                    dealerHTML += ('<td rowspan="' + dealerRowSpan + '">' + dealerElem.name + '</td>');
                                    if(dealerElem.category){
                                        dealerHTML += ('<td rowspan="' + dealerRowSpan + '">' + dealerElem.category.name + '</td>');
                                    } else{
                                        dealerHTML += ('<td rowspan="' + dealerRowSpan + '"></td>');
                                    }
                                    if(dealerElem.area.name){
                                        dealerHTML += ('<td rowspan="' + dealerRowSpan + '">' + dealerElem.area.name + '</td>');
                                    } else{
                                        dealerHTML += ('<td rowspan="' + dealerRowSpan + '"></td>');
                                    }
                                    $scope.prodItem.forEach(function(itemRes){
                                        var noElement_modelHTML = false;
                                        modelRowSpan = 1;
                                        report.forEach(function(repRes){
                                            modelMatch = false;
                                            if((repRes._id.model === itemRes._id) && (repRes._id.party == dealerElem._id)){
                                                modelMatch = true;
                                            }
                                            if(!modelMatch){
                                                return;
                                            } else{
                                                modelHTML += ('<td class="text-right" rowspan="' + modelRowSpan + '">' + repRes.qty + '</td>');
                                                noElement_modelHTML = true;
                                            }
                                        });
                                        if(!noElement_modelHTML){
                                            modelHTML += ('<td rowspan="' + modelRowSpan + '">-</td>'); 
                                        }
                                    });
                                    dealersHTML += dealerHTML + modelHTML + '</tr>';
                                });
                                if(!rdsMatch){
                                    return;
                                }
                                rdsRowSpan = rdsRowSpan * dealerRowCount;
                                rdsRowCount += rdsRowSpan;
                                var emp = '';
                                if(rdsElem.salesperson){
                                    for(var i = 0; i < rdsElem.salesperson.length; i++) {
                                        emp = emp + rdsElem.salesperson[i].name;
                                        if(i != rdsElem.salesperson.length - 1){
                                            emp = emp + ',';
                                        }
                                    }
                                }
                                rdsHTML += ('<td rowspan="' + rdsRowSpan + '">' + emp + '</td>');
                                rdsHTML += ('<td rowspan="' + rdsRowSpan + '">' + rdsElem.name + '</td>');
                                rdsHTML += ('<td rowspan="' + rdsRowSpan + '">' + rdsElem.areaDistribution.region.name + '</td>');
                                rdsHTML += dealersHTML;
                            });
                        }
                        if(!distMatch){
                            return;
                        }
                        distRowSpan = distRowSpan * rdsRowCount;
                        distRowCount += distRowSpan;
                        districtHTML += ('<td rowspan="' + distRowSpan + '">' + distElem.name + '</td>');
                        districtHTML += rdsHTML;
                    });
                    if(!zoneMatch){
                        return;
                    }
                    zoneRowSpan = zoneRowSpan * distRowCount;
                    zoneRowCount += zoneRowSpan;
                    zoneHTML += ('<td rowspan="' + zoneRowSpan + '">' + zoneElem.name + '</td>');
                    zoneHTML += districtHTML;
                });
                if(!stateMatch){
                    return;
                }
                stateRowSpan = stateRowSpan * zoneRowCount;
                stateRowCount += stateRowSpan;
                stateHTML = ('<tr><td rowspan="' + stateRowSpan + '">' + stateElem.name + '</td>');
                tableHTML += (stateHTML + zoneHTML + '</tr>');
            });
            if(tableHTML){
                $("#rdsSecondary").append(tableHTML + '</tbody>');
            }else{
                $("#rdsSecondary").append('</tbody>');
            }
            $scope.showTable = true;
        }

        $scope.exportToExcel=function(tableId){
            ExcelService.exportTable(tableId,'RDS Secondary Summary');
        }

        function onlyUnique(value, index, self){ 
            return self.indexOf(value) == index;
        }
    }
}());