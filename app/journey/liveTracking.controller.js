(function(){
    'use strict';
    angular.module('app').controller('Journey.LiveTracking.IndexController', liveTrackingController);

    function liveTrackingController(HRService, MasterService, $scope, DTOptionsBuilder){

        var vm=this, activeObj={active:true}, isFirstTime=true;
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 150, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        refreshPicker();
        loadDefault();
        
        function loadDefault(){
            initController();
        }

        function initController(){
            HRService.readEmployee(activeObj).then(function(res){
                if(res.data){
                    $scope.hrs = res.data;
                    $scope.schehrs = angular.copy($scope.hrs);
                    refreshPicker();
                }
            });

            MasterService.readEmpDepartment(activeObj).then(function(res){
                if(res.data){
                    $scope.hrDepart = res.data;
                    refreshPicker();
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker('refresh');
            });
        }

        $scope.changeTab = function(){
            refreshPicker();
        }

    }
}());