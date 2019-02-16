(function() {
    'use strict';
    angular.module('app').controller('Master.Client.IndexController', clientController);

    function clientController(ClientService, UserService, $state, $scope, $timeout, DTOptionsBuilder, DTColumnBuilder, $compile) {
    
        var vm = this, getActiveObj={active:true};
        var rows = [], rowObj;
        var btnObj = [{"method":"create","title":"Create"}, {"method":"update","title":"Update"}];
        loadDefault();

        function loadDefault(){
            $scope.authorized = false;
            vm.dtInstance = {};
            $scope.buttons = btnObj[0];
            vm.edit = editRow;
            vm.delete = deleteRow;
            initController();
            refreshPicker();
            loadTable();
        }

        function initController() {
            UserService.getCurrentUser().then(function (res) {
                $scope.user = res.data;
            });
            refreshPicker();
        }

        function refreshPicker() {
            angular.element(document).ready(function() { 
                $('.selectpicker').selectpicker("refresh");
            });
        }

        function refreshTable() {
            $timeout(function() {
                $scope.authorized = true;
            }, 0);
            $scope.buttons = btnObj[0];
            refreshPicker();
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            return '<button class="btn btn-simple btn-warning btn-icon bnt-rotate" ng-click="vm.edit(\'' +  data._id  + '\')">' +
                '   <i class="fa fa-pencil"></i>' +
                '</button>&nbsp;' ;
                // +
                // '<button class="btn btn-simple btn-danger btn-icon bnt-rotate" ng-click="vm.delete(\'' +  data._id  + '\')">' +
                // '   <i class="fa fa-trash"></i>' +
                // '</button>';
        }

        function loadTable() {
            ClientService.readClient().then(function(res) {
                rows = res.data;

                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('data', rows)
                    // .withPaginationType('full_numbers')
                    // .withOption('responsive', true)
                    .withOption('searching', true)
                    .withOption('ordering', false)
                    .withOption('paging', true)
                    .withOption('createdRow', createdRow)
                    .withOption('order', [[0, 'asc']])
                    .withOption('lengthMenu', [50, 100, 150, 250])
                    .withOption('lengthChange', true)
                    .withPaginationType('full_numbers', true)
                    .withOption('responsive', true)
                    .withOption('info', false);

                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('name').withTitle('<b>Name</b>'),
                    DTColumnBuilder.newColumn('gstin').withTitle('<b>Gst Code</b>'),
                    DTColumnBuilder.newColumn('panID').withTitle('<b>Pan Number<b>'),
                    DTColumnBuilder.newColumn(null).renderWith(actionsHtml).withTitle('<b>Action</b>').notSortable().withClass('all')
                ];
                refreshTable();
            });
        }

        $scope.create = function(obj) {
            $state.go('master.addClient');
            
        }

        function editRow(row) {
            rowObj = angular.copy(rows.find(obj => obj._id === row));
            $state.go('master.addClient',{'obj': rowObj});
        }

        function deleteRow(objID) {
            ClientService.removeClient({'_id': objID}).then(function(res) {
                if(res.status === 200) {
                    $scope.clientSelect = 'Client';
                    loadTable();
                } else {
                    swal('Failed to delete the record');
                }
            });
        }
    }
})();