(function() {
    'use strict';
	angular.module('app').controller('Accounts.Payment.IndexController', paymentController);

    function paymentController(VouchersService, DTOptionsBuilder, $scope, $state){

        var vm=this;
        vm.dtInstance = {};   
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', true).withOption('ordering', false).withOption('paging', true).withOption('lengthMenu', [50, 150, 250, 500]).withOption('lengthChange', true).withPaginationType('full_numbers', true).withOption('responsive', true).withOption('info', false);
        loadDefault();

        function loadDefault(){
            VouchersService.readPayment().then(function(res) {
                $scope.payments = res.data;
            });
        }

        $scope.addNewPayment = function(){
            $state.go('accounts.addPayment');
        }
    }
}());