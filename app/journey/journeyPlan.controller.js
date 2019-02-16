(function() {
    'use strict';
    angular.module('app').controller('Journey.JourneyPlan.IndexController', journeyPlanController);

    function journeyPlanController(HRService, ExpensesService, MasterService, $scope, $rootScope, $uibModal, $state, DTOptionsBuilder, uiCalendarConfig){

        var vm=this, activeObj={active:true}, isFirstTime = false;
        vm.schedularHRchange = schedularHRchange;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('searching', false)
            .withOption('ordering', false)
            .withOption('paging', true)
            // .withOption('lengthMenu', [50, 150, 250, 500])
            // .withOption('lengthChange', true)
            // .withPaginationType('full_numbers', true)
            .withOption('dom', 'frtip')
            // .withOption('responsive', true)
            // .withButtons([
            //     {
            //         text: 'Add New Plan',
            //         action: function(e, dt, node, config){
            //             $state.go('journey.newPlan',null,{reload: true});
            //         }
            //     }
            // ])
            .withOption('info', false);
        refreshPicker();
        loadDefault();
        
        function loadDefault(){
            $scope.plan = {};
            $rootScope.hrEvents = [{id: 1,title: 'TODAY',start: new Date()}];
            $scope.eventResources = $rootScope.hrEvents;
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

            ExpensesService.readJourneyPlan(activeObj).then(function(res){
                if(res.data){
                    vm.plans = res.data;
                    refreshPicker();
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        $scope.changeTab = function(){
            refreshPicker();
        }

        $scope.addNewPlan = function(){
            $state.go('journey.newPlan',null,{reload: true});
        }

        $scope.editPlan = function(plan){
            $state.go('journey.newPlan',{obj:plan,headerName: 'Edit Plan'},{reload: true});
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
            }else{
                $scope.schehrs = angular.copy($scope.hrs);
            }
            refreshPicker();
        }

        function schedularHRchange(){
            if(($scope.scheEmp != "") && ($scope.scheEmp != undefined)){
                getHRevent({hr: $scope.scheEmp});
            } else{
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
            }
        }

        $scope.renderCalender = function(calendar){
            if(uiCalendarConfig.calendars[calendar]){
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        $scope.uiConfig = {
            calendar: {
                viewRender: function(view, element){
                    if (view.name != 'month'){
                        $(element).find('.fc-scroller').perfectScrollbar();
                    }
                },
                firstDay: 1,
                height: 500,
                editable: true,
                displayEventTime: true,
                eventHelper: true,
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                customButtons: {
                    myCustomButton1: {
                        text: 'Bulk Assign!',
                        click: function() {
                            $state.go('journey.bulkAssign', null ,{reload: true});
                        }
                    },
                    myCustomButton2: {
                        text: 'Clear',
                        click: function() {
                            openClearPlanDialog();
                        }
                    }
                },
                header: {
                    left: 'title',
                    // center: 'month, agendaWeek, agendaDay',
                    center: 'prev, next, today, month',
                    right: 'myCustomButton1, myCustomButton2'
                },
                selectable: true,
                select : function(start,end){
                    var fromDate = new Date(start._d);
                    var endDate = new Date(end._d);
                    ShowModal({id:0, start:fromDate, end:endDate, title:''});
                },
                eventClick: function(event){
                    var fromDate = new Date(event.start);
                    var toDate = new Date(event.end);
                    ShowModal({id : event.id,start : fromDate,end: toDate,title : event.title,description : event.description});
                },
                eventDrop: function(event){
                    var fromDate = new Date(event.start);
                    var toDate = new Date(event.end);
                    ShowModal({id : event.id,start : fromDate,end: toDate,title : event.title,description : event.description});
                },
                events: $rootScope.hrEvents,
                eventAfterAllRender: function(){
                    if($rootScope.hrEvents.length > 0 && isFirstTime){
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate',$rootScope.hrEvents[0].start);
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('refetchEvents',$rootScope.hrEvents);
                        isFirstTime = false;
                    }
                },
                viewRender: function(){
                    if($scope.scheEmp != '')
                    getHRevent({hr: $scope.scheEmp});
                }
                // eventRender: $scope.eventRender
            }
        }

        function ShowModal(NewEvent){
            if(($scope.scheEmp != '') && ($scope.scheEmp != undefined)){
                var empID = $scope.scheEmp;
                $scope.option = $uibModal.open({
                    templateUrl: 'modalContent.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: function modalController($scope, $uibModalInstance){
                        // ExpensesService.readJourneyPlan({active: true}).then(function (res) {
                        //     $scope.journeyPlans = res.data;
                        //     controllerPicker();
                        // });
                        $scope.journeyPlans = vm.plans;
                        
                        $scope.NewEvent = NewEvent;
                        var btnObj = [{method:'create', title:'Create'}, {method:'update', title:'Update'}];
                        if($scope.NewEvent.title != ''){
                            $scope.plan = NewEvent.description;
                            $scope.hidebtn = true;
                            $scope.buttons = btnObj[1];
                        }else{
                            $scope.hidebtn = false;
                            $scope.buttons = btnObj[0];
                        }
                        controllerPicker();
                        
                        function controllerPicker(){
                            angular.element(document).ready(function(){
                                $('.selectpicker').selectpicker('refresh');
                            });
                        }

                        $scope.create = function(){
                            if($scope.plan != null){
                                ExpensesService.createHRevent({hr:empID, plan:$scope.plan, start:NewEvent.start, end:NewEvent.end, active:true}).then(function(res){
                                    getHRevent({hr:empID});
                                    $uibModalInstance.close();
                                });
                            }
                        }

                        $scope.update = function(){
                            if($scope.plan != null){
                                ExpensesService.updateHRevent({eventID:$scope.NewEvent.id, plan:$scope.plan, start:NewEvent.start, end:NewEvent.end}).then(function(res){
                                    getHRevent({hr: empID});
                                    $uibModalInstance.close();
                                });
                            }
                        }
                        
                        $scope.delete = function(){
                            ExpensesService.removeHRevent({eventID: $scope.NewEvent.id}).then(function(res){
                                getHRevent({hr: empID});
                                $uibModalInstance.close();
                            });
                            $uibModalInstance.close();
                        }

                        $scope.cancel = function(){
                            getHRevent({hr: empID});
                            $uibModalInstance.close();
                        }
                    }
                });
            } else{
                swal('', 'Select Employee');
            }
        }

        function getHRevent(obj){
            ExpensesService.readHRevent(obj).then(function(res){
                $rootScope.hrPlan = res.data;
                uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
                if($rootScope.hrPlan.length){
                    if($rootScope.hrPlan[0].events){
                        $rootScope.hrEvents = $rootScope.hrPlan[0].events;
                    }
                    if($scope.hrEvents.length != 0){
                        uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvents', $rootScope.hrEvents);
                    }
                }
            });
        }

        function openClearPlanDialog(){
            var employees = $scope.hrs;
            var modalInstance = $uibModal.open({
                templateUrl: 'clearPlanDialog.html',
                backdrop: 'static',
                keyboard: false,
                controller: function clearPlanDialogController($scope, $uibModalInstance){

                    $scope.employees = employees;
                    refreshPicker();

                    $scope.clearPlan = function(){
                        if(angular.element($('#fromDate')).val() && angular.element($('#toDate')).val() && $scope.employee){
                            swal({
                                title: "Are you sure ?",
                                text: "You will not be able to recover this plan !",
                                type: "warning",
                                confirmButtonText: "Yes, delete it !",
                                confirmButtonColor: '#7AC29A',
                                showCancelButton: true,
                                cancelButtonText: "Cancel",
                                cancelButtonColor: '#EB5E28'
                            }).then(function(isConfirm){
                                if(isConfirm){
                                    ExpensesService.removeBulkHREvent({hr:$scope.employee, from:angular.element($('#fromDate')).val(), to:angular.element($('#toDate')).val()}).then(function(res){
                                        if(res.data){
                                            schedularHRchange();
                                            $scope.close();
                                        }
                                    });
                                }
                            }).catch(function(isCancel){
                                if(isCancel){
                                    swal("Plan not deleted !");
                                }
                            })
                        } else{
                            swal('', 'All the fields are required !!! ');
                        }
                    }

                    $scope.close = function(){
                        $uibModalInstance.close();
                    }
                }
            });
        }
    }
}());