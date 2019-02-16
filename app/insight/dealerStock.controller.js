(function(){
    'use strict';
    angular.module('app').controller('DealerStock.IndexController', dealerStockController);

    function dealerStockController(MasterService, InventoryService, ClientService, ExcelService, $scope, DTOptionsBuilder){
    
        var vm=this, active={active:true};
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers', false).withOption('responsive', true).withOption('searching', false).withOption('info', false);
        loadDefault();

        function loadDefault(){
            initController();
        }

        function initController(){
            var checkRes = 0;
            MasterService.readState(active).then(function(res){
                $scope.states = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });

            MasterService.readZone(active).then(function(res){
                $scope.zones = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });

            MasterService.readDistrict(active).then(function(res){
                $scope.districts = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });

            ClientService.readClient().then(function(res){
                $scope.rds = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });

            ClientService.readDealer(active).then(function(res){
                $scope.dealers = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });

            MasterService.readProductItem(active).then(function(res){
                $scope.prodItem = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });

            InventoryService.readDealerStockSummary().then(function(res){
                $scope.stockStatus = res.data;
                checkRes = checkRes + 1;
                if(checkRes == 7){
                    genetrateTable();
                }
            });
        }

        function genetrateTable(){
            $("#dealerTable tbody").empty();
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
                                    if(dealerElem.area){
                                        dealerHTML += ('<td rowspan="' + dealerRowSpan + '">' + dealerElem.area.name + '</td>');
                                    } else{
                                        dealerHTML += ('<td rowspan="' + dealerRowSpan + '"></td>');
                                    }
                                    $scope.prodItem.forEach(function(itemRes){
                                        var noElement_modelHTML = false;
                                        modelRowSpan = 1;
                                        $scope.stockStatus.forEach(function(stockRes){
                                            modelMatch = false;
                                            if((stockRes.name.itemName === itemRes.itemName) && (stockRes.authorID.refID._id == dealerElem._id)){
                                                modelMatch = true;
                                            }
                                            if(!modelMatch){
                                                return;
                                            } else{
                                                modelHTML += ('<td class="text-right" rowspan="' + modelRowSpan + '">' + stockRes.quantity + '</td><td>-</td>');
                                                noElement_modelHTML = true;
                                            }
                                        });
                                        if(!noElement_modelHTML) {
                                            modelHTML += ('<td rowspan="' + modelRowSpan + '">-</td><td>-</td>'); 
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
                $("#dealerTable").append(tableHTML + '</tbody>');
            }else{
                $("#dealerTable").append('</tbody>');
            }
        }

        $scope.exportToExcel=function(tableId){
            ExcelService.exportTable(tableId,'Dealer Stock Summary');
		}
    }
}());