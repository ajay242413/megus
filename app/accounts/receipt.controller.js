(function() {
    'use strict';
	angular.module('app').controller('Accounts.Receipt.IndexController', receiptController);

    function receiptController(VouchersService, DTOptionsBuilder, $scope, $state) {

        var vm=this;
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 150, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            VouchersService.readReceipt().then(function(res) {
                $scope.receipts = res.data;
            });
        }

        $scope.addNewReceipt = function(){
            $state.go('accounts.addReceipt');
        }
    }
}());