(function() {
    'use strict';
    angular.module('app').controller('RDSstock.IndexController', rdsStockController);

    function rdsStockController(MasterService, InventoryService, ClientService, HRService, UserService, ExcelService, $scope, DTOptionsBuilder) {

        var vm = this;
        var active = {'active': true};
        // var data =$.parseJSON('{"result":{"buildname1":[{"table1":["xxx","zzz", "zzz"]},{"table2":["xxx","yyy"]}],"buildname2":[{"table1":["xxx","xxx", "zzz"]},{"table2":["xxx","xxx"]},{"table3":["xxx","yyy"]}]},"Build sets":"yyy","destinationPath":"xxx","status":1}');
        var rds = [], stockStatus = [];     
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withOption('responsive', true)
            .withOption('searching', true)
            .withOption('info', true);
        loadDefault();

        function loadDefault(){
            initController();
        }

        function initController(){
            var checkRes = 0;
            MasterService.readProductItem(active).then(function(res) {
                $scope.prodItem = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            MasterService.readState(active).then(function(res) {
                $scope.states = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            MasterService.readDistrict(active).then(function(res) {
                $scope.districts = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            HRService.readEmployee().then(function(res) {
                $scope.salespersons = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            MasterService.readZone(active).then(function(res) {
                $scope.zones = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            MasterService.readRegion(active).then(function(res) {
                $scope.regions = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            UserService.getParentUsers().then(function(res) {
                $scope.users = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            ClientService.readClient().then(function(res) {
                rds = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });

            InventoryService.readRDSstockSummary().then(function(res) {
                stockStatus = res.data;checkRes = checkRes + 1;
                if(checkRes == 9){
                    generateTable();
                }
            });
            chartFOrOverallActivations();
            chartForAgeOfProductsOfDealersVsRds();
            chartForAgeOfOverallProducts();

        }

        function  chartFOrOverallActivations(){
            var chart = c3.generate({
                bindto: '#totalActivations',
                
                data: {
                    x: 'x',
                    xFormat: '%Y-%m-%d',
                    columns: [
                        ['x', '2019-01-03', '2019-01-04', '2019-01-05', '2019-01-06', '2019-01-07', '2019-01-08', '2019-01-09', '2019-01-10', '2019-01-11', '2019-01-12', '2019-01-13', '2019-01-14', '2019-01-15', '2019-01-16', '2019-01-17', '2019-01-18', '2019-01-19', '2019-01-20', '2019-01-21', '2019-01-22', '2019-01-23', '2019-01-24', '2019-01-25', '2019-01-26', '2019-01-27', '2019-01-28', '2019-01-29', '2019-01-30', '2019-01-31', '2019-02-01'],
                        ['Tota Activations', 130, 300, 200, 300, 250, 450, 300, 500, 600, 730, 821, 990, 623, 300, 400, 800, 600, 1000, 1200, 1300, 1200, 900, 950, 1000, 400, 300, 200, 300, 450, 512]
                       
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
        
        function chartForAgeOfProductsOfDealersVsRds(){
            var chart = c3.generate({
                bindto: '#ageDealerVsRds',
                data: {
                    x: 'x',
                    columns: [
                        ['x','Model1', 'Model2', 'Model3', 'Model4', 'Model5', 'Model6'],
                        ['RDS', 30, 110, 130, 80, 40, 60],
                        ['Dealer', 45, 140, 150, 90, 55, 30],
                       
                    ],
                    type: 'bar',
                    colors: {
                        Model1: '#FFC300',
                        Model2: '#DAF7A6',
                        Model3: '#FF5733',
                        Model4: '#45B39D'
                    },
                    
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
                            text: 'Products',
                            position: 'outer-middle'
                          }
                    },
                    y: {
                        
                        label: { // ADD
                            text: 'Days',
                            position: 'outer-right'
                          }
                    }
                }
            });
           
        }
        function chartForAgeOfOverallProducts(){
            var chart = c3.generate({
                bindto: '#ageOverall',
                data: {
                    x:'x',
                    columns: [
                        ['x','Model1', 'Model2', 'Model3', 'Model4', 'Model5', 'Model6'],
                        ['Brand', 80, 50, 120, 76, 83, 145]
                         
                    ],
                    type: 'bar',
                    
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
                            text: 'Products',
                            position: 'outer-middle'
                          }
                    },
                    y: {
                        
                        label: { // ADD
                            text: 'Days',
                            position: 'outer-right'
                          }
                    }
                }
            });
                 
        }

        function generateTable() { //data is the parsed JSON Object from an ajax request
            $("#rdsTable tbody").empty();//Empty the table first
            var stateHtml, districtHtml, salesPersonHtml, rdsHtml, regionHtml, modelHtml;
            var tableHtml;
            var distRowCount, distRowSpan, distMatch, stateRowSpan, stateMatch, salesPersonCount, salesPersonRowSpan, salesPersonMatch, rdsMatch, rdsCount, rdsRowSpan, regionMatch, regionCount, regionRowSpan, modelMatch, modelRowSpan, modelCount;
            $scope.states.forEach(function(stateElem) {
                stateRowSpan = 1, stateMatch = false;
                distRowCount = 0, districtHtml = "";
                $scope.districts.forEach(function(distElem) {
                    distMatch = false, distRowSpan = 1, salesPersonCount = 0, salesPersonHtml = "";
                    // modelCount = 0, modelHtml = "";
                    $scope.salespersons.forEach(function(salesPersElem) {
                        salesPersonMatch = false, salesPersonRowSpan = 1, rdsHtml = "", rdsCount = 0;
                        $.each(rds, function (rdsKey, rdsElem) {
                            rdsMatch = false, rdsRowSpan = 1;
                            regionCount = 0, regionHtml = "";
                            $scope.regions.forEach(function(regionElem) {
                                regionRowSpan = 1;
                                regionMatch = false;
                                if((rdsElem.areaDistribution.state._id === stateElem._id) && (rdsElem.areaDistribution.district._id === distElem._id) && (rdsElem.areaDistribution.region._id === regionElem._id)) {
                                    distMatch = true;
                                    stateMatch = true;
                                    regionMatch = true;
                                    rdsElem.salesperson.forEach(function(rdsSalesPerson) {
                                        if(rdsSalesPerson) {
                                            if(rdsSalesPerson._id === salesPersElem._id) {
                                                salesPersonMatch = true;
                                                rdsMatch = true;;
                                            }
                                        }
                                    });
                                }
                                if(!regionMatch) {
                                    return;
                                }
                                regionRowSpan = regionRowSpan * 1;
                                regionCount += regionRowSpan;
                                regionHtml += ('<td rowspan="' + regionRowSpan + '">' + regionElem.name + '</td>');
                            });

                            //product item display - start
                            modelCount = 0, modelHtml = "";
                            $scope.prodItem.forEach(function(prodItem) {
                                var noElement_modelHtml = false;
                                modelRowSpan = 1;
                                stockStatus.forEach(function(stock_res) {
                                    modelMatch = false;
                                    var stockAuthor = stock_res.authorID;
                                    if(stockAuthor.userType === 'd') {
                                        if(prodItem._id === stock_res.name._id && rdsElem._id === stockAuthor.refID._id) {
                                            modelMatch = true;
                                        }
                                    }
                                    if(!modelMatch) {
                                        return;
                                    } else {
                                        modelHtml += ('<td rowspan="' + modelRowSpan + '">' + stock_res.quantity + '</td><td>1</td>');
                                        noElement_modelHtml = true;
                                    }
                                });
                                if(!noElement_modelHtml) {
                                   modelHtml += ('<td rowspan="' + modelRowSpan + '">' + 0 + '</td><td>0</td>'); 
                                }
                            });
                            modelHtml += ('</tr>');
                            //product item display - end
                                                          
                            if(!rdsMatch) {
                                return;
                            }
                            rdsRowSpan = rdsRowSpan * regionCount;
                            rdsCount += rdsRowSpan;
                            rdsHtml += ('<td rowspan="' + rdsRowSpan + '">' + rdsElem.name + '</td>');
                            rdsHtml += regionHtml + modelHtml;
                        });
                        if(!salesPersonMatch) {
                            return;
                        }
                        salesPersonRowSpan = salesPersonRowSpan * rdsCount;
                        salesPersonCount += salesPersonRowSpan;
                        salesPersonHtml += ('<td rowspan="' + salesPersonRowSpan + '">' + salesPersElem.name + '</td>');
                        salesPersonHtml += rdsHtml;
                    });
                    if(!distMatch) {
                        return; 
                    }
                    distRowSpan = distRowSpan * salesPersonCount;
                    distRowCount += distRowSpan;
                    districtHtml += ('<td rowspan="' + distRowSpan + '">' + distElem.name + '</td>');
                    districtHtml += salesPersonHtml;
                });
                if(!stateMatch) {
                    return;
                }
                stateRowSpan = stateRowSpan * distRowCount;
                stateHtml = ('<tr><td rowspan="' + stateRowSpan + '">' + stateElem.name + '</td>');
                tableHtml += (stateHtml + districtHtml + '</tr>');
            });
            $("#rdsTable").append(tableHtml + '</tbody>');
        }

        $scope.exportToExcel=function(tableId){
            ExcelService.exportTable(tableId,'RDS Stock Summary');
		}
    }
}());