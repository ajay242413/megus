(function(){
    'use strict';
    angular.module('app').controller('Master.Dealer.IndexController', clientController);

    function clientController(ClientService, $state, $scope, DTOptionsBuilder){
    
        var vm=this;
        $scope.showAction = false;
        loadDefault();

        function loadDefault(){
            vm.dtInstance = {};
            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('searching', false)
                .withOption('ordering', false)
                .withOption('paging', true)
                .withOption('order', [[0, 'asc']])
                .withOption('lengthMenu', [50, 100, 150, 250])
                .withOption('lengthChange', true)
                .withPaginationType('full_numbers', true)
                .withOption('responsive', true)
                .withOption('info', false);
            initController();
        }

        function initController(){
            ClientService.readClient().then(function(res){
                if(res.data){
                    $scope.dealers = res.data;
                }
            });
        }

        $scope.editDelete = function(){
            if($scope.showAction){
                $scope.showAction = false;
            } else{
                $scope.showAction = true;
            }
        }

        $scope.create = function(obj){
            $state.go('master.addDealer');
        }

        $scope.editRow = function(row){
            $state.go('master.addDealer', {obj:row});
        }

        $scope.bulkImport = function(row){
            $state.go('master.importDealer');
        }

        $scope.deleteRow = function(objID){
            ClientService.removeDealer({_id:objID}).then(function(res){
                if(res.status === 200){
                    loadTable();
                } else{
                    swal('', 'Failed to delete the record');
                }
            });
        }
    }
})();