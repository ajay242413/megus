(function(){
    'use strict';
    angular.module('app').controller('Master.AddDealer.IndexController', addDealerController);

    function addDealerController(ClientService, MasterService, SettingService, HRService, CustomService, $state, $scope, $stateParams){
    
        var vm=this, getActiveObj={active:true}, btnObj=[{method:'create', title:'Create'}, {method:'update', title:'Update'}];
        $scope.labelName = ['Custom Label 1', 'Custom Label 2'];
        $scope.errormsgCount = 0;
        loadDefault();

        function loadDefault(){
            $scope.buttons = btnObj[0];
            $scope.districtsClone = [];
        	$scope.dealer = {};
            $scope.errormsg = '';
        	initController();
        	refreshPicker();
        }

        function initController(){
        	MasterService.readState(getActiveObj).then(function(res){
                if(res.data){
                    $scope.states = res.data;
                    refreshPicker();
                }
            });

            MasterService.readArea(getActiveObj).then(function(res){
                if(res.data){
                    $scope.areas = res.data;
                    SettingService.readSetting().then(function(res1){
                        if(res1.data.length){
                            if(res1.data[0].default){
                                if(res1.data[0].default.clientState){
                                    var steInd = $scope.states.findIndex(x => x._id == res1.data[0].default.clientState);
                                    if(steInd >= 0){
                                        $scope.dealer.state = res1.data[0].default.clientState;
                                        $scope.stateChange();
                                    }
                                }
                            }
                            if(res1.data[0].format){
                                if(res1.data[0].format.dealerLabel1){
                                    $scope.labelName[0] = res1.data[0].format.dealerLabel1;
                                }
                                if(res1.data[0].format.dealerLabel2){
                                    $scope.labelName[1] = res1.data[0].format.dealerLabel2;
                                }
                            }
                        }
                        refreshPicker();
                    });
                }
            });

        	MasterService.readCountry(getActiveObj).then(function(res){
                if(res.data){
                    $scope.countries = res.data;
                    refreshPicker();
                }
            });
            MasterService.readDistrict(getActiveObj).then(function(res){
                if(res.data){
                    $scope.districtsClone = res.data;
                    refreshPicker();
                }
            });

            MasterService.readRegion(getActiveObj).then(function(res){
                if(res.data){
                    $scope.regions = res.data;
                    refreshPicker();
                }
            });

        	MasterService.readFinancialYear(getActiveObj).then(function(res){
                if(res.data){
                    $scope.finYear = res.data;
                    var finInd = $scope.finYear.findIndex(x => x.status === true);
                    if(($scope.finYear.length == 0) || (finInd < 0)){
                        $scope.errormsgCount = 1;
                        $scope.errormsg = $scope.errormsg + 'Add Financial Year In Master Accounts\n';
                    }
                    loadLedger();
                    refreshPicker();
                }
            });

            function loadLedger(){
                MasterService.readLedgerGroup().then(function(res){
                    if(res.data){
                        $scope.ledger = CustomService.getObject(res.data, 'name', 'Sundry Debtors');
                        if((!$scope.ledger)){
                            $scope.errormsg = $scope.errormsg + 'Ledger Group("sundry debtors") not found !!!'
                            swal('', 'Missing Values');
                        }
                    }

                });
            }

            HRService.readEmployee(getActiveObj).then(function(res){
                if(res.data){
                    $scope.hrs = res.data;
                    refreshPicker();
                }
            });

            MasterService.readDealerCategory(getActiveObj).then(function(res){
                if(res.data){
                    $scope.clientCategory = res.data;
                    refreshPicker();
                }
            });

            ClientService.readClientCode().then(function(res){
                if(res.data){
                    $scope.dealer.code = res.data.code;
                }
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker('refresh');
                $('.datepicker').datetimepicker({format: 'DD-MM-YYYY'});
            });
        }

        $scope.stateChange = function(){
            $scope.districts = [];
            // $scope.dealer.district = null;
            if($scope.dealer.state){
                for(var i=0; i<$scope.districtsClone.length; i++){
                    if($scope.dealer.state == $scope.districtsClone[i].state._id){
                        $scope.districts.push($scope.districtsClone[i]);
                    }
                }
            }
            refreshPicker();
        }

        if($stateParams.obj){
        	$scope.buttons = btnObj[1];
        	$scope.dealer = angular.copy($stateParams.obj);
        	if($scope.dealer.area){
                $scope.dealer.area = $scope.dealer.area._id;
            }
        	if($scope.dealer.region){
                $scope.dealer.region = $scope.dealer.region._id;
            }
        	if($scope.dealer.country){
                $scope.dealer.country = $scope.dealer.country._id;
            }
        	if($scope.dealer.district){
                $scope.dealer.district = $scope.dealer.district._id;
            }
        	if($scope.dealer.state){
                $scope.dealer.state = $scope.dealer.state._id;
                $scope.stateChange();
            }
        	if($scope.dealer.salesperson){
                $scope.dealer.salesperson = $scope.dealer.salesperson._id;
            }
            if($scope.dealer.category){
                $scope.dealer.category = $scope.dealer.category._id;
            }
            refreshPicker();
        }

        $scope.backDealer = function(){
        	$state.go('master.dealer',null,{reload: true});
        }

        $scope.create = function(){
            if($scope.errormsgCount == 0){
            	if($scope.finYear){
                    $scope.dealer.finYear = $scope.finYear[$scope.finYear.findIndex(x => x.status === true)]._id;
                }
                if($scope.ledger){
                    $scope.dealer.ledger = $scope.ledger._id;
                }
            	ClientService.saveDealer($scope.dealer).then(function(res){
                    $state.reload();
                });
            } else{
                swal('', 'Missing Values');
            }
        }

        $scope.update = function(){
            if($scope.errormsgCount == 0){
            	ClientService.updateDealer($scope.dealer).then(function(res){
                    $scope.backDealer();
                });
            } else{
                swal('', 'Missing Values');
            }
        }
    }
}());