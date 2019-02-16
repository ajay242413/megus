(function() {
    'use strict';
    angular.module('app').controller('Journey.BulkAssign.IndexController', bulkAssignController);

    function bulkAssignController(HRService, MasterService, ExpensesService, $scope, $state){

        var vm=this, activeObj={active:true};
        loadDefault();

        function loadDefault(){
            $scope.months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // month start with 1
            $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // day start with 0
            $scope.years = [new Date().getFullYear()];
            $scope.years.push($scope.years[0] + 1);
            $scope.year = [];
            $scope.month = [];
            $scope.day = [];
            $scope.year[0] = true;
            $scope.month[new Date().getMonth()] = true;
            $scope.day[new Date().getDay()] = true;
            initController();
        }

        function initController(){
            HRService.readEmployee(activeObj).then(function(res){
                if(res.data){
                    $scope.hrs = res.data;
                    $scope.schehrs = angular.copy($scope.hrs);
                }
                refreshPicker();
            });

            MasterService.readEmpDepartment(activeObj).then(function(res){
                if(res.data){
                    $scope.hrDepart = res.data;
                }
                refreshPicker();
            });

            MasterService.readVisitType(activeObj).then(function(res){
                if(res.data){
                    $scope.visitTypes = res.data;
                }
                refreshPicker();
            });

            ExpensesService.readJourneyPlan(activeObj).then(function(res){
                if(res.data){
                    vm.plans = res.data;
                }
                refreshPicker();
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
            });
        }

        $scope.back = function(){
            $state.go('journey.journeyPlan',{reload: true});
        }

        $scope.departmentChange = function(){
            $scope.schehrs = [];
            if($scope.scheDepatment != ""){
                for (var i = 0; i < $scope.hrs.length; i++){
                    if($scope.hrs[i].department){
                        if($scope.hrs[i].department._id === $scope.scheDepatment){
                            $scope.schehrs.push($scope.hrs[i]);
                        }
                    }           
                }
            } else{
                $scope.schehrs = angular.copy($scope.hrs);
            }
            refreshPicker();
        }

        $scope.changeMonthAll = function(){
            if($scope.monthAll){
                for(var i=0; i<$scope.months.length; i++){
                    $scope.month[i] = true;
                }
            } else{
                for(var i=0; i<$scope.months.length; i++){
                    $scope.month[i] = false;
                }
            }
        }

        $scope.changeDayAll = function(){
            if($scope.dayAll){
                for(var i=0; i<$scope.days.length; i++){
                    $scope.day[i] = true;
                }
            } else{
                for(var i=0; i<$scope.days.length; i++){
                    $scope.day[i] = false;
                }
            }
        }

        $scope.changeYearAll = function(){
            if($scope.yearAll){
                for(var i=0; i<$scope.years.length; i++){
                    $scope.year[i] = true;
                }
            } else{
                for(var i=0; i<$scope.years.length; i++){
                    $scope.year[i] = false;
                }
            }
        }

        $scope.changeMonth = function(val){
            var j=0;
            if(val){
                for(var i=0; i<$scope.months.length; i++){
                    if($scope.month[i]){
                        j = j + 1;
                    }
                }
            }
            if(j == $scope.months.length){
                $scope.monthAll = true;
            } else{
                $scope.monthAll = false;
            }
        }

        $scope.changeDay = function(val){
            var j=0;
            if(val){
                for(var i=0; i<$scope.days.length; i++){
                    if($scope.day[i]){
                        j = j + 1;
                    }
                }
            }
            if(j == $scope.days.length){
                $scope.dayAll = true;
            } else{
                $scope.dayAll = false;
            }
        }

        $scope.changeYear = function(val){
            var j=0;
            if(val){
                for(var i=0; i<$scope.years.length; i++){
                    if($scope.year[i]){
                        j = j + 1;
                    }
                }
            }
            if(j == $scope.years.length){
                $scope.yearAll = true;
            } else{
                $scope.yearAll = false;
            }
        }

        $scope.assignPlan = function(){
            if($scope.month.includes(true) && $scope.year.includes(true) && $scope.day.includes(true) && $scope.scheEmp && $scope.planName){
                $scope.hrevents = [];
                for(var yr=0; yr<$scope.years.length; yr++){
                    if($scope.year[yr]){
                        for(var mh=0; mh<$scope.months.length; mh++){
                            var mon = mh + 1;
                            if((new Date().getMonth() <= mh) && ($scope.month[mh])){
                                var mon = mh + 1;
                                for(var i=0; i<$scope.days.length; i++){
                                    if($scope.day[i]){
                                        for(var j=1; j<=new Date($scope.years[yr], mh, 0).getDate(); j++){
                                            var newDate = new Date($scope.years[yr], mh, j);
                                            if(i == newDate.getDay()){
                                                var d1 = j;
                                                var d2 = mon;
                                                if(j < 10){
                                                    d1 = "0" + j;
                                                }
                                                if(mon < 10){
                                                    d2 = "0" + mon;
                                                }
                                                if(new Date().getMonth() == mh){
                                                    if(new Date().getDate() <= j){
                                                        var planDate = $scope.years[yr] + '-' + d2 + '-' + d1;
                                                        $scope.hrevents.push({hr:$scope.scheEmp, plan:$scope.planName, start:planDate, end:planDate});
                                                    }
                                                } else{
                                                    var planDate = $scope.years[yr] + '-' + d2 + '-' + d1;
                                                    $scope.hrevents.push({hr:$scope.scheEmp, plan:$scope.planName, active:true, start:planDate, end:planDate});
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if($scope.hrevents.length){
                    swal({text:"Assigning Plans", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                    ExpensesService.createBulkHREvent($scope.hrevents).then(function(res){
                        if(res.data){
                            swal.close();
                            $state.reload();
                        }
                    });
                }
            } else{
                swal('', 'HR, Plan, Year, Month and Day are required fields');
            }
        }
    }
}());