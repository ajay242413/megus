(function() {
    'use strict';
    angular.module('app').controller('Master.AddClient.IndexController', addClientController);

    function addClientController(ClientService, MasterService, HRService, SettingService, UserService, CustomService, $state, $scope, $stateParams) {
    
        var vm=this, btnObj=[{"method":"create", "title":"Create"}, {"method":"update", "title":"Update"}]; 
        $scope.errormsgCount = 0;
        loadDefault();

        function loadDefault(){
            $scope.buttons = btnObj[0];
            $scope.firmTypes = [{'name': 'Propertiorship Company','value': 'propertiorship'},{'name': 'Partnership Company','value': 'partnership'},{'name': 'PVT LTD Company','value': 'pvtlmdcompany'}];
            $scope.client = {};
            $scope.client.firmType = $scope.firmTypes[0]['value'];
            $scope.client.registerAddress = {};
            $scope.firms = [];
            $scope.firm = {};
            $scope.selected = {};
            $scope.proofs = {};
            $scope.errormsg = "";
            vm.refreshPicker = refreshPicker;

            refreshPicker();
            initController();
        }

        function initController(){
            function loadLedger() {
                MasterService.readLedgerGroup({name: "Current Assets"}).then(function(res) {
                    $scope.ledger = CustomService.getObject(res.data, "name", "Sundry Debtors");
                    if((!$scope.ledger)) {
                        $scope.errormsgCount = 1;
                        $scope.errormsg = $scope.errormsg + "Ledger Group('sundry debtors') not found !!!"
                        warningmsg();
                    }
                });
            }
            MasterService.readState({'active': true}).then(function(res) {
                $scope.states = res.data;
                SettingService.readSetting().then(function(res) {
                    if(res.data.length){
                        if(res.data[0].default){
                            if(res.data[0].default.clientState){
                                var steInd = $scope.states.findIndex(x => x._id == res.data[0].default.clientState);
                                if(steInd >= 0){
                                    $scope.client.registerAddress.state = res.data[0].default.clientState;
                                }
                            }
                        }
                    }
                    refreshPicker();
                });
            });
            MasterService.readDistrict({'active': true}).then(function(res) {
                $scope.districts = res.data;
                refreshPicker();
            });
            MasterService.readRegion({'active': true}).then(function(res) {
                $scope.regions = res.data;
                refreshPicker();
            });
            MasterService.readFinancialYear({'active': true}).then(function(res) {
                $scope.finYear = res.data;
                var finInd = $scope.finYear.findIndex(x => x.status == true);
				if(($scope.finYear.length == 0) || (finInd < 0)){
                    $scope.errormsgCount = 1;
                    $scope.errormsg = $scope.errormsg + "Add Financial Year In Master Accounts\n";
                    warningmsg();
				} else {
                    loadLedger();
                }
			});
            HRService.readEmployee({'active': true}).then(function (res) {
                $scope.hrs = res.data;
                refreshPicker();
            });
            UserService.getCurrentUser().then(function(res) {
                $scope.user = res.data;
                $scope.client.createdBy = $scope.user._id;
            });
            ClientService.readClientCode().then(function(res){
                $scope.client.code = res.data.code;
            });
        }

        function warningmsg(){
            swal({
                title: 'Missing Values',
                text: $scope.errormsg,
                type: 'warning'
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function() {
                $('.selectpicker').selectpicker("refresh");
                $('.datepicker').datetimepicker({format: 'DD-MM-YYYY'});
            });
        }

        $scope.changePartnertype = function(){
            if ($scope.client.partnerType === 'RDS'){
                $scope.requiredAD = true;
            } else {
                $scope.client.areaDistribution = {};
                $scope.requiredAD = false;
            }
            refreshPicker();
        }

        if($stateParams.obj){
            $scope.buttons = btnObj[1];
            $scope.client = angular.copy($stateParams.obj);
            if($scope.client.firm){
                if($scope.client.firm.length == 1){
                    $scope.firm = $scope.client.firm[0];
                } else{
                    $scope.firms = $scope.client.firm;
                    $scope.showFirmTable = true;
                }
            }
            if($scope.client.billingAddress){
                if($scope.client.billingAddress.state){
                    $scope.client.billingAddress.state = $scope.client.billingAddress.state._id;
                } else{
                    $scope.client.billingAddress.state = "";
                }
            }
            if($scope.client.shippingAddress){
                if($scope.client.shippingAddress.state){
                    $scope.client.shippingAddress.state = $scope.client.shippingAddress.state._id;
                } else{
                    $scope.client.shippingAddress.state = "";
                }
            }
            if($scope.client.registerAddress){
                if($scope.client.registerAddress.state){
                    $scope.client.registerAddress.state = $scope.client.registerAddress.state._id;
                } else{
                    $scope.client.registerAddress.state = "";
                }
            }
            $scope.client.salesperson = $scope.client.salesperson.map(a => a._id);
            if ($scope.client.areaDistribution.state){
                $scope.client.areaDistribution.state = $scope.client.areaDistribution.state._id;
                $scope.client.areaDistribution.district = $scope.client.areaDistribution.district._id;
                $scope.client.areaDistribution.region = $scope.client.areaDistribution.region._id;
            }
            if($scope.client.proofs){
                $scope.proofsClone = $scope.client.proofs;
            }
            delete $scope.client.proofs;
            $scope.changePartnertype();
            refreshPicker();
        }

        $scope.backClient = function(){
        	$state.go('master.client',null,{reload: true});
        }

        $scope.firmTypeChange = function(){
            $scope.firm = {};
        	if($scope.client.firmType == 'propertiorship'){
        		$scope.firms = [];
        	}
        	if($scope.firms.length == 0){
        		$scope.showFirmTable = false;
        	}
        }

        $scope.getFirm = function(fs){
            if(fs.name == $scope.selected.name){
                return 'edit';
            }
            else{
                return 'display';
            }
        }

        $scope.addFirm = function(){
        	if(($scope.firm.name) && ($scope.firm.phone)){
        		$scope.firms.push($scope.firm);
        		$scope.showFirmTable = true;
        		$scope.firm = {};
        	}
        }

        $scope.editFirm = function(fs){
            $scope.selected = angular.copy(fs);
        }

        $scope.reset = function(){
            $scope.selected = {};
        }

        $scope.saveFirm = function(ind){
            $scope.firms[ind] = $scope.selected;
            $scope.selected = {};
        }

        $scope.deleteFirm = function(ind){
        	$scope.firms.splice(ind,1);
        	if($scope.firms.length == 0){
        		$scope.showFirmTable = false;
        	}
        }

        $scope.billingClicked = function(opt){
        	if(opt == true){
        		$scope.client.billingAddress = $scope.client.registerAddress;
            }else{
                $scope.client.billingAddress = {};
            }
            refreshPicker();
        }

        $scope.shippingClicked = function(opt){
        	if(opt == true){
        		$scope.client.shippingAddress = $scope.client.registerAddress;
        	}else{
        		$scope.client.shippingAddress = {};
        	}
            refreshPicker();
        }

        $scope.stateChange = function() {
            MasterService.readDistrict({'active': true,'state': $scope.client.areaDistribution.state}).then(function(res) {
                $scope.districts = res.data;
                $scope.regions = undefined;
                refreshPicker();
            });
        }

        $scope.districtChange = function() {
            MasterService.readRegion({'active': true,'district': $scope.client.areaDistribution.district}).then(function(res) {
                $scope.regions = res.data;
                refreshPicker();
            });
        }

        $scope.create = function(){
            if($scope.errormsgCount == 0){
                if($scope.client.firmType == 'propertiorship'){
                    $scope.client.firm = $scope.firm;
                }else{
                    if($scope.firm.name){
                        var firmInd = $scope.firms.findIndex(x => x.name == $scope.firm.name);
                        if(firmInd < 0)
                            $scope.firms.push($scope.firm);
                    }
                    $scope.client.firm = $scope.firms;
                }
                if(angular.element($('#validityStart')).val())
                    $scope.client.validityStart = angular.element($('#validityStart')).val();
                if(angular.element($('#validityEnd')).val())
                    $scope.client.validityEnd = angular.element($('#validityEnd')).val();
                if($scope.finYear)
                    $scope.client.finYear = $scope.finYear[$scope.finYear.findIndex(x => x.status == true)]._id;
                if($scope.ledger) {
                    $scope.client.ledger = $scope.ledger._id;
                }
                ClientService.saveClient($scope.client,$scope.proofs).then(function(res) {
                    $state.reload();
                });
            } else{
                warningmsg();
            }
        }

        $scope.update = function(){
            if($scope.errormsgCount == 0){
                if($scope.client.firmType == 'propertiorship'){
                    $scope.client.firm = $scope.firm;
                }else{
                    if($scope.firm.name){
                        var firmInd = $scope.firms.findIndex(x => x.name == $scope.firm.name);
                        if(firmInd < 0)
                            $scope.firms.push($scope.firm);
                    }
                    $scope.client.firm = $scope.firms;
                }
                if(angular.element($('#validityStart')).val())
                    $scope.client.validityStart = angular.element($('#validityStart')).val();
                if(angular.element($('#validityEnd')).val())
                    $scope.client.validityEnd = angular.element($('#validityEnd')).val();
                ClientService.updateClient($scope.client,$scope.proofs).then(function(res) {
                    $state.go('master.client',null,{reload: true});
                });
            } else{
                warningmsg();
            }
        }
    }
})();
