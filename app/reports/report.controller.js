(function() {
    'use strict';
    angular.module('app').controller('Report.IndexController', reportController);

    function reportController(VouchersService, CustomService, MasterService, DTOptionsBuilder, $scope){

        var vm=this, activeObj={active:true}, groupIds=[];
        $scope.showtable = false;
        vm.dtInstance = {};
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('searching', false).withOption('ordering', false).withOption('paging', false).withOption('lengthChange', false).withPaginationType('full_numbers', false).withOption('responsive', true).withOption('info', false).withColVis().withColVisOption('aiExclude', [1]).withButtons(['copy', 'print', 'excel', 'csv']);
        refreshPicker();
        initController();

        function initController(){
            MasterService.readLedgerGroup(activeObj).then(function(res) {
                $scope.ledgerGroups = res.data;
                var debtors = CustomService.getObject($scope.ledgerGroups, "name", "Sundry Debtors");
                groupRecrusion(debtors);
                var creditors = CustomService.getObject($scope.ledgerGroups, "name", "Sundry Creditors");
                groupRecrusion(creditors);
                refreshPicker();
                if(groupIds.length){
                    VouchersService.readLedger({group: groupIds}).then(function(res) {
                        $scope.clients = res.data;
                        refreshPicker();
                    });
                }
			});
        }

        function refreshPicker(){
            angular.element(document).ready(function(){ 
                $('.selectpicker').selectpicker("refresh");
            });
        }

        $scope.clientChange = function(){
            if($scope.client){
                swal({text:"Loading", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/spinner.gif'});
                VouchersService.readReport({id:$scope.client}).then(function(res){
                    $scope.results = res.data;
                    $scope.showtable = true;
                    swal.close();
                });
            }
        }

        function groupRecrusion(ledObj){
			groupIds.push(ledObj._id);
			if(ledObj.subName.length){
				for(var i=0; i<ledObj.subName.length; i++){
					groupRecrusion(ledObj.subName[i]);
				}
			}
		}
    }
}());