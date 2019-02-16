(function(){
    'use strict';
    angular.module('app').controller('RDSprimary.IndexController', rdsPrimaryController);

    function rdsPrimaryController(MasterService, UserService, InventoryService, ExcelService, $scope, DTOptionsBuilder){
       
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

            UserService.readClient().then(function(res){
                if(res.data){
                    $scope.rds = res.data;
                }
            });
            chartForActivationTrend();
            contributionChart();
            rdsStockChart();
        }

        function chartForActivationTrend(){            
                var chart = c3.generate({
                    bindto: '#activationTrend',
                    data: {
                        x: 'x',
                        xFormat: '%Y-%m-%d',
                        columns: [
                            ['x', '2019-01-03', '2019-01-04', '2019-01-05', '2019-01-06', '2019-01-07', '2019-01-08', '2019-01-09', '2019-01-10', '2019-01-11', '2019-01-12', '2019-01-13', '2019-01-14', '2019-01-15', '2019-01-16', '2019-01-17', '2019-01-18', '2019-01-19', '2019-01-20', '2019-01-21', '2019-01-22', '2019-01-23', '2019-01-24', '2019-01-25', '2019-01-26', '2019-01-27', '2019-01-28', '2019-01-29', '2019-01-30', '2019-01-31', '2019-02-01'],
                            ['ModelA', 30, 200, 100, 400, 150, 250, 323, 300, 400, 450, 250, 200, 150, 300, 400, 543, 780, 1022, 500, 200, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30],
                            ['ModelB', 130, 300, 200, 300, 250, 450, 300, 500, 600, 730, 821, 990, 623, 300, 400, 800, 600, 1000, 1200, 1300, 1200, 900, 950, 1000, 400, 300, 200, 300, 450, 512]
                        ]
                       
                    },   
                     
              

                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d',
                             
                        },
                        label: { // ADD
                            text: 'Date',
                            position: 'outer-middle'
                          }
                    },
                    y: {
                        
                        label: { // ADD
                            text: 'Number of Activations',
                            position: 'outer-right'
                          }
                    }
                },                
               
            });
              
        }

        function contributionChart()
        {
            var chart = c3.generate({
                bindto: '#contribution',
                
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
                    data3: '#0000ff',
                    data4: '#00ccc'
                },
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
            var chart2 = c3.generate({
                bindto: '#contribution1',
                
                data: {
                    // iris data from R
                    columns: [
                        ['Basic', 30],
                        ['Midend', 120]    
                    ],
                    type : 'pie',
                  
                }
            });
            
            setTimeout(function () {
                chart2.load({
                    columns: [        
                        ['Basic', 30],
                        ['Midend', 120],               
                        ['Highend', 100],
                        ['Premium', 40],
                    ],
                });
            }, 1500);
            var chart3 = c3.generate({
                bindto: '#contribution2',
                
                data: {
                    // iris data from R
                    columns: [
                        ['Black', 30],
                        ['Blue', 120]    
                    ],
                    type : 'pie',
                  
                }
            });
            
            setTimeout(function () {
                chart3.load({
                    columns: [        
                        ['Black', 30],
                        ['Blue', 120],               
                        ['Green', 100],
                        ['Red', 40],
                    ],
                });
            }, 1500);
            
        }

        function  rdsStockChart(){
            var chart = c3.generate({
                bindto: '#rdsVsDealer',
                
                data: {
                    x: 'x',
                    columns: [
                        ['x','ModelA', 'ModelB', 'ModelC', 'ModelD', 'ModelE', 'ModelF'],
                        ['RDS', 30, 200, 100, 400, 150, 250],
                       
                    ],
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                },
               
                axis: {
                    x: {
                        type: 'category',
                        tick: {
                            multiline: false
                        },
                        label: { // ADD
                            text: 'Products',
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
                chart.load({
                    columns: [
                        ['Dealer', 130, 100, 140, 200, 150, 50]
                    ]
                });
            }, 1000);
             
            
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
                InventoryService.rdsPrimarySummary({start:angular.element($('#startFrom')).val(), end:angular.element($('#endAt')).val(), item:$scope.itemList}).then(function(res){
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
                        swal('', 'Data Not Found');
                        $('#rdsPrimary tbody').empty();
                        $scope.showTable = false;
                    }
                });
            } else{
                swal('', 'Select Both dates and Models');
            }
        }

        function genetrateTable(report){
            $("#rdsPrimary tbody").empty();
            var stateHTML, districtHTML, rdsHTML, tableHTML, zoneHTML, modelHTML;
            var stateMatch, zoneMatch, distMatch, rdsMatch, modelMatch;
            var stateRowSpan, zoneRowSpan, distRowSpan, rdsRowSpan, modelRowSpan;
            var stateRowCount, zoneRowCount, distRowCount, rdsRowCount;
            $scope.states.forEach(function(stateElem){
                stateMatch=false, stateRowSpan=1, zoneRowCount=0, zoneHTML="";
                $scope.zones.forEach(function(zoneElem){
                    zoneMatch=false, zoneRowSpan=1, distRowCount=0, districtHTML="";
                    $scope.districts.forEach(function(distElem){
                        distMatch=false, distRowSpan=1, rdsRowCount=0, rdsHTML="";
                        var zoneInd = zoneElem.district.findIndex(x => x._id === distElem._id);
                        if((zoneElem.state._id === stateElem._id) && (zoneInd >= 0)){
                            $scope.rds.forEach(function(rdsElem){
                                rdsMatch=false, rdsRowSpan=1, modelHTML="";
                                if(rdsElem.refID.areaDistribution){
                                    if((rdsElem.refID.areaDistribution.state._id === stateElem._id) && (rdsElem.refID.areaDistribution.district._id === distElem._id)){
                                        distMatch = true;
                                        stateMatch = true;
                                        rdsMatch = true;
                                        zoneMatch = true;
                                    }
                                }
                                if(!rdsMatch){
                                    return;
                                }
                                $scope.prodItem.forEach(function(itemRes){
                                    var noElement_modelHTML = false;
                                    modelRowSpan = 1;
                                    report.forEach(function(repRes){
                                        modelMatch = false;
                                        if((repRes._id.model === itemRes._id) && (repRes._id.authorID == rdsElem._id)){
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
                                modelHTML += ('</tr>');
                                rdsRowCount += rdsRowSpan;
                                var emp = '';
                                if(rdsElem.refID.salesperson){
                                    for(var i = 0; i < rdsElem.refID.salesperson.length; i++) {
                                        emp = emp + rdsElem.refID.salesperson[i].name;
                                        if(i != rdsElem.refID.salesperson.length - 1){
                                            emp = emp + ',';
                                        }
                                    }
                                }
                                rdsHTML += ('<td rowspan="' + rdsRowSpan + '">' + emp + '</td>');
                                rdsHTML += ('<td rowspan="' + rdsRowSpan + '">' + rdsElem.refID.name + '</td>');
                                rdsHTML += ('<td rowspan="' + rdsRowSpan + '">' + rdsElem.refID.areaDistribution.region.name + '</td>');
                                rdsHTML += modelHTML;
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
                $('#rdsPrimary').append(tableHTML + '</tbody>');
            }else{
                $('#rdsPrimary').append('</tbody>');
            }
            $scope.showTable = true;
        }

        $scope.exportToExcel=function(tableId){
            ExcelService.exportTable(tableId, 'RDS Primary Summary');
        }

        function onlyUnique(value, index, self){ 
            return self.indexOf(value) == index;
        }
    }
}());