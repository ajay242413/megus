(function(){
    'use strict';
	angular.module('app').controller('Accounts.ReferenceJournal.IndexController', referenceJournalController);

    function referenceJournalController(VouchersService, $scope, $state, $timeout, DTOptionsBuilder){

        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions= DTOptionsBuilder
            .newOptions()
            .withOption('lengthChange', true)
            .withOption('searching', true)
            .withOption('ordering', false)
            .withPaginationType('full_numbers', true)
            .withOption('paging', true)
            .withOption('lengthMenu', [50, 100, 150, 200])
            .withOption('responsive', false)
            .withOption('info', false)
            .withBootstrap()
            .withBootstrapOptions({
                TableTools: {
                    classes: {
                        container: 'btn-group',
                        buttons: {
                            normal: 'btn btn-default'
                        }
                    }
                },
                ColVis: {
                    classes: {
                        masterButton: 'btn btn-default'
                    }
                },
                pagination: {
                    classes: {
                        ul: 'pagination pagination-sm'
                    }
                }
            })
            .withColVis()
            .withLightColumnFilter({
                '0' : {
                    type : 'text'
                },
                '1' : {
                    type : 'text'
                },
                '2' : {
                    type: 'text'
                },
                '3' : {
                    type: 'text'
                },
                '4' : {
                    type: 'text'
                },
                '5' : {
                    type: 'text'
                },
                '6' : {
                    type: 'text'
                },
                '7' : {
                    type: 'text'
                }
            })
            .withButtons([
                'copy', 
                'print', 
                'csv',
                {
                    text: 'Filter',
                    key: '1',
                    action: function(e, dt, node, config){
                        // console.log('IF');
                        // changeOptions();
                    }
                }
            ]);
        loadDefault();

        // function changeOptions(){
        //     refreshTable();
        //     vm.dtInstance._renderer.rerender();
        // }
        
        function loadDefault(){
            VouchersService.readReferenceJournal({active:true}).then(function(res){
                if(res.data){
                    $scope.rjs = res.data;
                    refreshTable();
                }
            });
        }

        function refreshTable() {
			$timeout(function() {
			    $scope.authorized = true;
			}, 0);
		} 

        $scope.addNew = function(){
            $state.go('accounts.addReferenceJournal');
        }

        $scope.editDelete = function(){
			if($scope.showAction){
				$scope.showAction = false;
			} else{
				$scope.showAction = true;
			}
        }
        
        $scope.deleteRJ = function(rj){
            swal({
                title:'Are you sure ?', text:'You will not be able to recover this RJ !', type:'warning', confirmButtonText:'Yes, delete it !', confirmButtonColor:'#7AC29A', showCancelButton:true, cancelButtonText:'Cancel', cancelButtonColor:'#EB5E28'
            }).then(function(isConfirm){
                if(isConfirm){
                    VouchersService.removeReferenceJournal(rj).then(function(res){
                        if(res.data){
                            loadDefault();
                            swal('', 'RJ is Deleted');
                        }
                    });
                }
            }).catch(function(isCancel){
                if(isCancel){
                    swal('', 'RJ not deleted !');
                }
            })
        }

        $scope.viewRef = function(ref){
            $state.go('accounts.viewReferenceJournal',{obj: ref});
        }
    }
}());