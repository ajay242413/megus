(function() {
    'use strict';
    angular.module('app').controller('SaleReturn.IndexController', saleReturnController);

    function saleReturnController(SettingService, InventoryService, $scope, $state, $uibModal, DTOptionsBuilder){

        if($scope.rootUser.userType == 'b'){
            $scope.brandPage = true;
            $scope.distPage = false;
        } else{
            $scope.brandPage = false;
            $scope.distPage = true;
            loadDefault();
        }
        var vm = this;
        $scope.showaction = false;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('searching', true)
            .withOption('ordering', false)
            .withOption('paging', true)
            .withOption('lengthMenu', [50, 100, 150, 200])
            .withOption('lengthChange', true)
            .withPaginationType('full_numbers', true)
            .withOption('responsive', true)
            .withOption('info', false);
        $scope.spName = "Stock Point";

        function loadDefault(){
            SettingService.readSetting().then(function(res) {
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.stockPoint){
                            $scope.spName = res.data[0].format.stockPoint;
                        }
                    }
                }
            });

        	InventoryService.readInventory({'type': 'sr'}).then(function(res){
                $scope.result = res.data;
            });
        }

        $scope.showAction = function(){
            if($scope.showaction){
                $scope.showaction = false;
            } else{
                $scope.showaction = true;
                // vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(10).notSortable().withClass('all')];
            }
        }

        $scope.viewItems = function(data){
            var modalInstance = $uibModal.open({
                templateUrl: 'viewItemsContent.html',
                backdrop: 'static',
                keyboard: false,
                controller: function viewItemsController($scope, $uibModalInstance) {
                    $scope.invoice = data;

                    if($scope.invoice.item[0].igst){
                        $scope.showigst = true;
                        $scope.showgst = false;
                    } else{
                        $scope.showigst = false;
                        $scope.showgst = true;
                    }

                    $scope.exportIMEI = function(imeiNumbers){
                        var IMEINum = imeiNumbers;
                        if(IMEINum.length){
                            /* this line is only needed if you are not adding a script tag reference */
                            if(typeof XLSX == 'undefined') 
                                XLSX = require('xlsx');

                            /* make the worksheet */
                            var ws = XLSX.utils.json_to_sheet(IMEINum);
                            
                            /* add to workbook */
                            var wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, "People");
                            
                            /* write workbook (use type 'binary') */
                            var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
                            
                            /* generate a download */
                            function s2ab(s) {
                                var buf = new ArrayBuffer(s.length);
                                var view = new Uint8Array(buf);
                                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                                return buf;
                            }
                            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "IMEI Numbers.xlsx");
                        }
                    }

                    $scope.close = function(){
                        $uibModalInstance.close();
                    }
                }
            });
        }

        $scope.addSalesReturn = function(){
            $state.go('invoice.addSaleReturn',null,{reload: true});
        }
    }
}());