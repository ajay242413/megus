(function() {
    'use strict';
	angular.module('app').controller('Accounts.ViewReferenceJournal.IndexController', viewReferenceJournalController);

    function viewReferenceJournalController(VouchersService, $scope, $state, $stateParams, DTOptionsBuilder) {

        if($stateParams.obj == null){
            $state.go('accounts.referenceJournal',null,{reload: true});
        } else{
            var vm = this;
            vm.dtInstance = {};   
            vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
            vm.dtInstance1 = {};
            vm.dtOptions1 = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false);
            loadDefault();
        }

        function loadDefault(){
            var ch = 0;
            swal({
                // title: ,
                text: "Loading",
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                imageUrl: '../images/200px/spinner.gif'
            });
            VouchersService.readReferenceJournalById({id: $stateParams.obj._id}).then(function(res){
                if(res.data){
                    $scope.refJournal = res.data;
                    swal.close();
                }
            });
        }

        $scope.back = function(){
            $state.go('accounts.referenceJournal',null,{reload: true});
        }
    }
}());