(function(){
    'use strict';
    angular.module('app').controller('Employee.IndexController', employeeController);

    function employeeController(HRService, $state, $scope, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile){

        var vm=this, rows=[];
        $scope.authorized = false;
        vm.dtInstance = {};
        initController();

        function refreshTable(){
            $timeout(function(){
                $scope.authorized = true;
            }, 0);
        }

        function createdRow(row, data, dataIndex){
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta){
            return '<button class="btn btn-simple btn-warning btn-icon edit" ng-click="editRow(\'' +  data._id  + '\')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button class="btn btn-simple btn-danger btn-icon remove" ng-click="deleteRow(\'' +  data._id  + '\')">' +
                '   <i class="fa fa-trash-o"></i>' +
                '</button>';
        }

        function initController(){
            $scope.hideEmpDashboard = false;
            HRService.readEmployee({active: true}).then(function(res){
                rows = res.data;
                $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', rows).withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 150, 250, 500]).withOption('lengthChange', true).withOption('createdRow', createdRow).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('name').withTitle('Name'),
                    DTColumnBuilder.newColumn('mobNum').withTitle('Mobile Number'),
                    DTColumnBuilder.newColumn('panID').withTitle('Pan Number'),
                    DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('Actions').notSortable().withClass('all')
                        
                ];
                refreshTable();
            });
        }

        $scope.addEmployee = function(){
            $state.go('HR.addEmployee');
        }

        $scope.editRow = function(row){
            var rowObj = angular.copy(rows.find(obj => obj._id === row));
            $state.go('HR.addEmployee', {obj:rowObj});
        }

        $scope.deleteRow = function(row){
            HRService.removeEmployee({_id: row}).then(function(res){
                $state.reload();
            });
        }
    }
})();