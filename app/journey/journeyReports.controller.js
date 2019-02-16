(function() {
    'use strict';
    angular.module('app').controller('Journey.JourneyReports.IndexController', journeyReportsController);

    function journeyReportsController(HRService, MasterService, ExpensesService, SettingService, $scope, DTOptionsBuilder, DTColumnDefBuilder){

        var vm=this, activeObj={active:true};
        $scope.dtInstance = {};
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 100, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            $scope.customLabel1 = 'Journey Custom Label 1';
            $scope.department = [];
            $scope.employee = [];
            $scope.visitType = [];
            $scope.planNames = [];
            $scope.hrEvents = [];
            initController();
        }

        function initController(){
            HRService.readEmployee(activeObj).then(function(res){
                if(res.data){
                    $scope.employeeLists = res.data;
                    $scope.employeeListsClone = res.data;
                }
                refreshPicker();
            });

            MasterService.readEmpDepartment(activeObj).then(function(res){
                if(res.data){
                    $scope.departmentLists = res.data;
                }
                refreshPicker();
            });

            MasterService.readVisitType(activeObj).then(function(res){
                if(res.data){
                    $scope.visitTypeLists = res.data;
                }
                refreshPicker();
            });

            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.journeyLabel1){
                            $scope.customLabel1 = res.data[0].format.journeyLabel1;
                        }
                    }
                }
            });

            ExpensesService.readJourneyPlan(activeObj).then(function(res){
                if(res.data){
                    $scope.plans = res.data;
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        $scope.departmentChange = function(){
            $scope.schehrs = [];
            $scope.employeeLists = [];
            if($scope.department.length){
                for(var i=0; i<$scope.department.length; i++){
                    for(var j=0; j<$scope.employeeListsClone.length; j++){
                        if($scope.employeeListsClone[j].department){
                            if($scope.department[i] == $scope.employeeListsClone[j].department._id){
                                $scope.employeeLists.push($scope.employeeListsClone[j]);
                            }
                        }
                    }
                }
            } else{
                $scope.employeeLists = $scope.employeeListsClone;
            }
            refreshPicker();
        }

        $scope.visitTypeChange = function(){
            $scope.planNames = [];
            for(var j=0; j<$scope.visitType.length; j++){
                for(var i=0; i<$scope.plans.length; i++){
                    if($scope.visitType[j] == $scope.plans[i].visitType._id){
                        $scope.planNames.push($scope.plans[i].visitType._id);
                    }
                }
            }
        }

        $scope.getPlanEvents = function(){
            if($scope.employee.length && angular.element($('#fromDate')).val() && angular.element($('#toDate')).val()){
                ExpensesService.getPlanEvents({hr:$scope.employee, fromDate:angular.element($('#fromDate')).val(), toDate:angular.element($('#toDate')).val(), plan:$scope.planNames}).then(function(res){
                    if(res.data){
                        $scope.hrEvents = res.data;
                    }
                });
            } else{
                swal('', 'Employee, From and To Date are Compulsary!!!');
            }
        }

    }
}());