(function() {
    'use strict';
    angular.module('app').controller('PurchaseAck.IndexController', purchaseAckController);

    function purchaseAckController(InventoryService, $scope, $state, DTOptionsBuilder, DTColumnDefBuilder) {

		var vm = this;
	    vm.dtInstance = {};
		vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(5).notSortable().withClass('all')];
	    vm.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('searching', true)
			.withOption('ordering', false)
			.withOption('paging', true)
			.withOption('lengthMenu', [20, 50, 100, 150])
			.withOption('lengthChange', true)
			.withPaginationType('full_numbers', true)
			.withOption('responsive', true)
			.withOption('info', false);
		initController();

		function initController(){
			InventoryService.readPurchaseAck().then(function(res) {
                $scope.purchaseItems = res.data;
            });
		}

		$scope.back = function(){
        	$state.go('invoice.purchase',null,{reload: true});
        }

		$scope.approvePurchase = function(rowObj){
			$state.go('invoice.ackPurchase',{'obj': rowObj});
		}
	}
}());