(function(){
    'use strict';
    angular.module('app').controller('HR.Expenses.IndexController', expensesController);

    function expensesController(ExpensesService, HRService, UserService, $scope, $rootScope, $filter, $uibModal, DTOptionsBuilder){

        var vm=this, activeObj={active:true};
        // vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 150, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            $scope.app = {};
            $scope.view = {};
            $scope.exp = {};
            $scope.expense = {};
            $rootScope.expenseInfo = {};
            $scope.expenses = [];
            $scope.files = [];
            $scope.expenseTypes = ['Travel','Food','Stay','Others'];
            $scope.showTable = false;
            genetrateInvoice();
            initController();
        }
        
        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
            });
        }

        function genetrateInvoice(){
            $scope.exp.invoiceDate = $filter('date')(new Date(), "yyyy-MM-dd");
            ExpensesService.readInvoice().then(function(res){
                var latestRec = res.data;
                if(latestRec.length == 0){
                    $scope.exp.invoiceNumber = 'EP/' + 1;
                } else{
                    var splitInvoice = latestRec[0].invoiceNumber.split('/');
                    splitInvoice[1] =  parseInt(splitInvoice[1]) + 1;
                    $scope.exp.invoiceNumber = 'EP/' + splitInvoice[1];
                }
            });
        }

        function initController(){
            HRService.readEmployee(activeObj).then(function(res){
                $scope.employees = res.data;
                refreshPicker();
            });

            UserService.getCurrentUser().then(function(res){
                if(res.data.refName === 'employee'){
                    $scope.view.employee = [];
                    $scope.app.employee = [];
                    $scope.view.employee.push(res.data.refID._id);
                    $scope.app.employee.push(res.data.refID._id);
                    $scope.exp.employee = angular.copy(res.data.refID._id);
                    $scope.disableEmployee = true;
                    $scope.employeeChange();
                    refreshPicker();
                }
            });
        }

        $scope.employeeChange = function(){
            if($scope.exp.employee){
                ExpensesService.readHRevent({hr: $scope.exp.employee}).then(function(res){
                    if(res.data.length){
                        if(res.data[0].events){
                            $scope.jps = res.data[0].events;
                        }
                    }
                    refreshPicker();
                });
            }
        }

        $scope.expenseTypeChange = function(){
            if(($scope.expense.type == 'Travel') || ($scope.expense.type == "Stay")){
                var exptyp = $scope.expense.type;
                var modalInstance = $uibModal.open({
                    templateUrl: 'expenseInfoModal.html',
                    backdrop: 'static',
                    keyboard: false,
                    controller: function expenseInfoController($scope,$uibModalInstance){
                        $scope.exptyp = exptyp;

                        angular.element(document).ready(function(){
                            $('.selectpicker').selectpicker("refresh");
                            $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});
                        });

                        $scope.save = function(){
                            if(exptyp == 'Stay'){
                                $scope.expenseInfo.fromDate = angular.element($('#from')).val();
                                $scope.expenseInfo.toDate = angular.element($('#to')).val();
                            }
                            $scope.close();
                        }

                        $scope.close = function(){
                            $uibModalInstance.close();
                        };
                    }
                });
            }
        }

        $scope.addExpense = function(){
            if(($scope.expense.type) && ($scope.expense.cost) && (angular.element("input[id='expenseDate']").val())){
                $scope.expense.date = angular.element($('#expenseDate')).val();
                $scope.expense.approve = false;
                if($scope.expense.file){
                    $scope.files.push($scope.expense.file)
                    $scope.expense.file = 'true';
                }
                if(($scope.expense.type == 'Travel') || ($scope.expense.type == "Stay")){
                    $scope.expense.expenseInfo = angular.copy($rootScope.expenseInfo);
                }
                $scope.expenses.push($scope.expense);
                $scope.expense = {};
                $rootScope.expenseInfo = {};
                angular.element("input[type='file']").val(undefined);
                angular.element("input[id='expenseDate']").val(undefined);
                if($scope.expenses.length != 0){
                    $scope.showTable = true;
                }
                refreshPicker();
            } else{
                swal("Expense type,Rate and Date fields are compulsary");
            }
        }

        $scope.deleteExpense = function(ind){
            $scope.expenses.splice(ind,1);
            if($scope.expenses.length === 0)
                $scope.showTable = false;
        }

        $scope.saveExpense = function(){
            if(($scope.expense.type) && ($scope.expense.cost)){
                $scope.addExpense();
            }
            if(($scope.exp.employee) && ($scope.exp.jp) && ($scope.expenses.length)){
                $scope.exp.expenses = $scope.expenses;
                $scope.exp.approve = false;
                ExpensesService.saveExpense($scope.exp,$scope.files).then(function(res){
                    loadDefault();
                });
            } else{
                swal("Select Employee,journey plan and add expenses");
            }
        }

        $scope.viewExpense = function(){
            if(($scope.view.employee) && ($scope.view.approve) && (angular.element($('#startDate')).val()) && (angular.element($('#endDate')).val())){
                ExpensesService.readExpense({'employee': $scope.view.employee, 'start': angular.element($('#startDate')).val(), 'end': angular.element($('#endDate')).val(),'status': $scope.view.approve}).then(function(res){
                    vm.viewExpenses = res.data;
                    if(vm.viewExpenses != 0){
                        for(var i = 0; i<vm.viewExpenses.length; i++){
                            var pen = 0;
                            var app = 0;
                            for(var j = 0; j<vm.viewExpenses[i].expenses.length; j++){
                                if(vm.viewExpenses[i].expenses[j].approve == true){
                                    app = app + 1;
                                } else{
                                    pen = pen + 1;
                                }
                            }
                            vm.viewExpenses[i]['pending'] = pen;
                            vm.viewExpenses[i]['approved'] = app;
                        }
                    }
                });
            } else{
                swal("", "All the fields are required.");
            }
        }

        $scope.readExpense = function(){
            if($scope.app.employee){
                ExpensesService.readExpense({'employee': $scope.app.employee, 'start': angular.element($('#start')).val(), 'end': angular.element($('#end')).val(),'status': ['false']}).then(function (res) {
                    vm.approveExpenses = res.data;
                    if(vm.approveExpenses != 0){
                        $scope.showButton = true;
                        for(var i = 0; i < vm.approveExpenses.length; i++){
                            var pen = 0;
                            var app = 0;
                            for(var j = 0; j < vm.approveExpenses[i].expenses.length; j++){
                                if(vm.approveExpenses[i].expenses[j].approve == true){
                                    vm.approveExpenses[i].expenses[j]['check'] = true;
                                    app = app + 1;
                                } else{
                                    vm.approveExpenses[i].expenses[j]['check'] = false;
                                    pen = pen + 1;
                                }
                            }
                            vm.approveExpenses[i]['pending'] = pen;
                            vm.approveExpenses[i]['approved'] = app;
                        }
                    } else{
                        $scope.showButton = false;
                    }
                });
            }
        }

        $scope.toggleExpense = function(eve, val){
            var pen = 0;
            var app = 0;
            if(eve.target.checked == true){
                vm.approveExpenses[val].approve = true;
                for(var i = 0; i < vm.approveExpenses[val].expenses.length; i++){
                    if(vm.approveExpenses[val].expenses[i].check == false){
                        vm.approveExpenses[val].expenses[i].approve = true;
                        vm.approveExpenses[val].expenses[i]['approveDate'] = $filter('date')(new Date(), "yyyy-MM-dd");
                    }
                }
                vm.approveExpenses[val].approved = vm.approveExpenses[val].expenses.length;
                vm.approveExpenses[val].pending = pen;
            } else{
                vm.approveExpenses[val].approve = false;
                for(var i = 0; i < vm.approveExpenses[val].expenses.length; i++){
                    if(vm.approveExpenses[val].expenses[i].check == false){
                        vm.approveExpenses[val].expenses[i].approve = false;
                        vm.approveExpenses[val].expenses[i]['approveDate'] = undefined;
                        pen = pen + 1;
                    } else{
                        app = app + 1;
                    }
                }
                vm.approveExpenses[val].approved = app;
                vm.approveExpenses[val].pending = pen;
            }
        }

        $scope.openExpenses = function(index){
            var modalInstance = $uibModal.open({
                templateUrl: 'expenseInfo.html',
                backdrop: 'static',
                keyboard: false,
                controller: function expenseInfoController($scope, $uibModalInstance){
                    $scope.expense = vm.approveExpenses[index].expenses;

                    $scope.ok = function(){
                        $uibModalInstance.close();
                    };

                    $scope.toggleExp = function(event, ind){
                        if(event.target.checked == true){
                            vm.approveExpenses[index].expenses[ind].approve = true;
                            vm.approveExpenses[index].expenses[ind]['approveDate'] = $filter('date')(new Date(), "yyyy-MM-dd");
                        } else{
                            vm.approveExpenses[index].expenses[ind].approve = false;
                            vm.approveExpenses[index].expenses[ind]['approveDate'] = undefined;
                        }
                        var checkVar=0, pen=0, app=0;
                        for(var i = 0; i < vm.approveExpenses[index].expenses.length; i++){
                            if(vm.approveExpenses[index].expenses[i].approve == true){
                                checkVar = checkVar + 1;
                                app = app + 1;
                            } else{
                                pen = pen + 1;
                            }
                        }
                        vm.approveExpenses[index]['pending'] = pen;
                        vm.approveExpenses[index]['approved'] = app;
                        if(checkVar == vm.approveExpenses[index].expenses.length){
                            vm.approveExpenses[index].approve = true;
                        } else{
                            vm.approveExpenses[index].approve = false;
                        }
                        $scope.expense = vm.approveExpenses[index].expenses;
                    }

                    $scope.showDetails = function(detail){
                        $scope.showDetailContent = true;
                        $scope.detailInfo = detail;
                        if(detail.file){
                            $scope.showImageContent = true;
                        }else{
                            $scope.showImageContent = false;
                        }
                    }

                }
            });
        }

        $scope.openExpensesDialog = function(index){
            var modalInstance = $uibModal.open({
                templateUrl: 'viewExpenseInfo.html',
                backdrop: 'static',
                keyboard: false,
                controller: function viewExpenseInfoController($scope, $uibModalInstance){
                    $scope.expense = vm.viewExpenses[index].expenses;

                    $scope.ok = function(){
                        $uibModalInstance.close();
                    };

                    $scope.showDetails = function(detail){
                        $scope.showDetailContent = true;
                        $scope.detailInfo = detail;
                        if(detail.file){
                            $scope.showImageContent = true;
                        }else{
                            $scope.showImageContent = false;
                        }
                    }

                }
            });
        }

        $scope.approveExpense = function(){
            ExpensesService.approveExpense(vm.approveExpenses).then(function(res){
                $scope.readExpense();
            });
        }
    }
}());