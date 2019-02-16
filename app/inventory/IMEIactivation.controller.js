(function() {
    'use strict';
    angular.module('app').controller('IMEIActivation.IndexController', IMEIactivationController);

    function IMEIactivationController(InventoryService, ExcelService, $scope, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        vm.dtInstance = {};   
        vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withOption('responsive', true).withOption('searching', true).withOption('info', true);

        $scope.upload = function(opt){
            var file = $scope.excelSheet;
            if(file){
                swal({title: "Validating", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/gear.gif'});
                var reader = new FileReader();
                reader.onload = function(e){
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type:'binary'});
                    var sheetName = workbook.SheetNames[0];
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (excelData.length > 0){
                        $scope.imei = [];
                        for(var i=0; i<excelData.length; i++){
                            if((excelData[i].date) && (excelData[i].imei)){
                                $scope.imei.push(excelData[i]);
                            }
                        }
                        if(excelData.length != $scope.imei.length){
                            swal.close();
                            swal("Data Not Found", "Total = " + excelData.length + "\nValid = "+ $scope.imei.length);
                        } else{
                            swal.close();
                        }
                    }
                    else{
                        swal.close();
                        swal("", "Check Excel Sheet");
                    }
                }
                reader.onerror = function(ex){
                    swal.close();
                    swal("", "Check Excel Sheet");
                }
                reader.readAsBinaryString(file);
            }
        }

        $scope.activate = function(){
            if($scope.imei.length){
                swal({
                    title: "Activating",
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    imageUrl: '../images/200px/gear.gif'
                });
            	InventoryService.activateIMEI($scope.imei).then(function(res) {
                    if(res.data){
                        swal.close();
                        if(res.data.invalid){
                            ExcelService.exportXLSX('IMEI','UN activated',res.data.invalid);
                        }
                    }
                });
            }
        }
	}
}());