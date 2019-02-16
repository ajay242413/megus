(function(){
    'use strict';
    angular.module('app').controller('IMEIlookup.IndexController', IMEIlookupController);

    function IMEIlookupController(SettingService, InventoryService, $scope){

        var vm=this;
        $scope.spName = "Serial Number";
        $scope.user = $scope.rootUser;
        if($scope.user.userType == 'b'){
            $scope.showBrandTable = true;
            $scope.showRDStable = false;
        } else{
            $scope.showBrandTable = false;
            $scope.showRDStable = true;
        }
        loadDefault();

        function loadDefault(){
            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.serial){
                            $scope.spName = res.data[0].format.serial;
                        }
                    }
                }
            });
        }

        $scope.search = function(){
            if($scope.imeiNumber){
                if($scope.imeiNumber.length > 1){
                    swal({title:"Loading", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                    InventoryService.IMEIstatus({number:$scope.imeiNumber}).then(function (res) {
                        $scope.imeiData = res.data;
                        swal.close();
                    });
                }
            }
        }

        $scope.checkRDSstatus = function(id){
            var returnValue = "";
            if(id.active){
                returnValue = "SOLD";
            } else if(id.position == 'R'){
                returnValue = "IN"
            } else if(id.position == 'D'){
                returnValue = "OUT"
            } else if(id.position == 'B'){
                returnValue = "RETURNED"
            }
            return returnValue;
        }

        $scope.checkBrandStatus = function(id){
            var returnValue = "";
            if(id.active){
                returnValue = "SOLD";
            } else if(id.position == 'B'){
                returnValue = "IN"
            } else if(id.position == ''){
                returnValue = "RETURNED"
            } else {
                returnValue = "OUT"
            }
            return returnValue;
        }

        $scope.checkActive = function(id){
            var returnValue = "";
            if(id.active){
                returnValue = id.customer[id.customer.length - 1].date;
            }
            return returnValue;
        }
    }
}());