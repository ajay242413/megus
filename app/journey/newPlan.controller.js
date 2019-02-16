(function() {
    'use strict';
    angular.module('app').controller('Journey.NewPlan.IndexController', newPlanController);

    function newPlanController(ExpensesService, MasterService, ClientService, SettingService, $scope, $filter, $stateParams, $state){

        var vm=this, activeObj={active:true}, btnObj=[{method:'createPlan', title:'Create Plan'}, {method:'updatePlan', title:'Update Plan'}], ch=0;
        $scope.plan = {};
        loadDefault();
        refreshPicker();

        function loadDefault(){
            $scope.buttons = btnObj[0];
            $scope.plan.dealer = [];
            $scope.stateFilter = [];
            $scope.districtFilter = [];
            $scope.areaFilter = [];
            $scope.categoryFilter = [];
            $scope.customLabel1 = 'Journey Custom Label 1';
            initController();
        }

        function initController(){
            ExpensesService.readJourneyPlanumber().then(function(res){
                if(res.data){
                    $scope.plan.invoiceNumber = res.data.planumber;
                    $scope.plan.invoiceDate = $filter('date')(new Date(), 'yyyy-MM-dd');
                    ch = ch + 1;
                    if(ch == 3){
                        editPlan();
                    }
                }
            });

            ClientService.readDealer(activeObj).then(function(res){
                if(res.data){
                    $scope.dealers = res.data;
                    $scope.dealersClone = res.data;
                    ch = ch + 1;
                    if(ch == 3){
                        editPlan();
                    }
                }
                refreshPicker();
            });

            MasterService.readVisitType(activeObj).then(function(res){
                if(res.data){
                    $scope.visitTypes = res.data;
                }
                ch = ch + 1;
                if(ch == 3){
                    editPlan();
                }
                refreshPicker();
            });

            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].format){
                        if(res.data[0].format.journeyLabel1){
                            $scope.customLabel1 = res.data[0].format.journeyLabel1;
                        }
                    }
                }
            });

            MasterService.readDistrict(activeObj).then(function(res){
                if(res.data){
                    $scope.districts = res.data;
                    $scope.districtsClone = res.data;
                }
                refreshPicker();
            });

            MasterService.readState(activeObj).then(function(res){
                if(res.data){
                    $scope.states = res.data;
                }
                refreshPicker();
            });

            MasterService.readAreas(activeObj).then(function(res){
                if(res.data){
                    $scope.areas = res.data;
                    $scope.areasClone = res.data;
                }
                refreshPicker();
            });

            MasterService.readDealerCategory(activeObj).then(function(res){
                if(res.data){
                    $scope.categories = res.data;
                }
                refreshPicker();
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function(){
                $('.selectpicker').selectpicker("refresh");
            });
        }

        $scope.back = function(){
            $state.go('journey.journeyPlan');
        }

        $scope.stateChange = function(){
            $scope.districts = [];
            if($scope.stateFilter.length){
                for(var i=0; i<$scope.stateFilter.length; i++){
                    for(var j=0; j<$scope.districtsClone.length; j++){
                        if($scope.stateFilter[i] == $scope.districtsClone[j].state._id){
                            $scope.districts.push($scope.districtsClone[j]);
                        }
                    }
                }
            } else{
                $scope.districts = $scope.districtsClone;
            }
            refreshPicker();
            $scope.filterDealer();
        }

        $scope.districtChange = function(){
            $scope.areas = [];
            if($scope.districtFilter.length){
                for(var i=0; i<$scope.districtFilter.length; i++){
                    for(var j=0; j<$scope.areasClone.length; j++){
                        if($scope.districtFilter[i] == $scope.areasClone[j].district._id){
                            $scope.areas.push($scope.areasClone[j]);
                        }
                    }
                }
            } else{
                $scope.areas = $scope.areasClone;
            }
            refreshPicker();
            $scope.filterDealer();
        }

        $scope.filterDealer = function(){
            $scope.dealers = [];
            if($scope.stateFilter.length){
                // console.log('State IF');
                for(var sf=0; sf<$scope.stateFilter.length; sf++){
                    if($scope.districtFilter.length){
                        // console.log('State IF District IF');
                        for(var df=0; df<$scope.districtFilter.length; df++){
                            if($scope.areaFilter.length){
                                // console.log('State IF District IF Area IF');
                                for(var af=0; af<$scope.areaFilter.length; af++){
                                    if($scope.categoryFilter.length){
                                        // console.log('State IF District IF Area IF Category IF');
                                        for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                            for(var d=0; d<$scope.dealersClone.length; d++){
                                                if($scope.dealersClone[d].state && $scope.dealersClone[d].district && $scope.dealersClone[d].area && $scope.dealersClone[d].category){
                                                    if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].district._id == $scope.districtFilter[df]) && ($scope.dealersClone[d].area._id == $scope.areaFilter[af]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                        $scope.dealers.push($scope.dealersClone[d]);
                                                    }
                                                }
                                            }
                                        }
                                    } else{
                                        // console.log('State IF District IF Area IF Category Else');
                                        for(var d=0; d<$scope.dealersClone.length; d++){
                                            if($scope.dealersClone[d].state && $scope.dealersClone[d].district && $scope.dealersClone[d].area){
                                                if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].district._id == $scope.districtFilter[df]) && ($scope.dealersClone[d].area._id == $scope.areaFilter[af])){
                                                    $scope.dealers.push($scope.dealersClone[d]);
                                                }
                                            }
                                        }
                                    }
                                }
                            } else{
                                if($scope.categoryFilter.length){
                                    // console.log('State IF District IF Area Else Category IF');
                                    for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                        for(var d=0; d<$scope.dealersClone.length; d++){
                                            if($scope.dealersClone[d].state && $scope.dealersClone[d].district && $scope.dealersClone[d].category){
                                                if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].district._id == $scope.districtFilter[df]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                    $scope.dealers.push($scope.dealersClone[d]);
                                                }
                                            }
                                        }
                                    }
                                } else{
                                    // console.log('State IF District IF Area Else Category Else');
                                    for(var d=0; d<$scope.dealersClone.length; d++){
                                        if($scope.dealersClone[d].state && $scope.dealersClone[d].district){
                                            if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].district._id == $scope.districtFilter[df])){
                                                $scope.dealers.push($scope.dealersClone[d]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else{
                        if($scope.areaFilter.length){
                            // console.log('State IF District Else Area If Category Else');
                            for(var af=0; af<$scope.areaFilter.length; af++){
                                if($scope.categoryFilter.length){
                                    // console.log('State IF District Else Area If Category IF');
                                    for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                        for(var d=0; d<$scope.dealersClone.length; d++){
                                            if($scope.dealersClone[d].state && $scope.dealersClone[d].area && $scope.dealersClone[d].category){
                                                if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].area._id == $scope.areaFilter[af]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                    $scope.dealers.push($scope.dealersClone[d]);
                                                }
                                            }
                                        }
                                    }
                                } else{
                                    // console.log('State IF District Else Area If Category Else');
                                    for(var d=0; d<$scope.dealersClone.length; d++){
                                        if($scope.dealersClone[d].state && $scope.dealersClone[d].area){
                                            if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].area._id == $scope.areaFilter[af])){
                                                $scope.dealers.push($scope.dealersClone[d]);
                                            }
                                        }
                                    }
                                }
                            }
                        } else{
                            if($scope.categoryFilter.length){
                                // console.log('State IF District Else Area Else Category IF');
                                for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                    for(var d=0; d<$scope.dealersClone.length; d++){
                                        if($scope.dealersClone[d].state && $scope.dealersClone[d].category){
                                            if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                $scope.dealers.push($scope.dealersClone[d]);
                                            }
                                        }
                                    }
                                }
                            } else{
                                // console.log('State IF District Else Area Else Category Else');
                                for(var d=0; d<$scope.dealersClone.length; d++){
                                    if($scope.dealersClone[d].state){
                                        if(($scope.dealersClone[d].state._id == $scope.stateFilter[sf])){
                                            $scope.dealers.push($scope.dealersClone[d]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else{
                if($scope.districtFilter.length){
                    // console.log('State Else District IF');
                    for(var df=0; df<$scope.districtFilter.length; df++){
                        if($scope.areaFilter.length){
                            // console.log('State Else District IF Area IF');
                            for(var af=0; af<$scope.areaFilter.length; af++){
                                if($scope.categoryFilter.length){
                                    // console.log('State Else District IF Area IF Category IF');
                                    for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                        for(var d=0; d<$scope.dealersClone.length; d++){
                                            if($scope.dealersClone[d].district && $scope.dealersClone[d].area && $scope.dealersClone[d].category){
                                                if(($scope.dealersClone[d].district._id == $scope.districtFilter[df]) && ($scope.dealersClone[d].area._id == $scope.areaFilter[af]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                    $scope.dealers.push($scope.dealersClone[d]);
                                                }
                                            }
                                        }
                                    }
                                } else{
                                    // console.log('State Else District IF Area IF Category Else');
                                    for(var d=0; d<$scope.dealersClone.length; d++){
                                        if($scope.dealersClone[d].district && $scope.dealersClone[d].area){
                                            if(($scope.dealersClone[d].district._id == $scope.districtFilter[df]) && ($scope.dealersClone[d].area._id == $scope.areaFilter[af])){
                                                $scope.dealers.push($scope.dealersClone[d]);
                                            }
                                        }
                                    }
                                }
                            }
                        } else{
                            if($scope.categoryFilter.length){
                                // console.log('State Else District IF Area Else Category IF');
                                for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                    for(var d=0; d<$scope.dealersClone.length; d++){
                                        if($scope.dealersClone[d].district && $scope.dealersClone[d].category){
                                            if(($scope.dealersClone[d].district._id == $scope.districtFilter[df]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                $scope.dealers.push($scope.dealersClone[d]);
                                            }
                                        }
                                    }
                                }
                            } else{
                                // console.log('State Else District IF Area Else Category Else');
                                for(var d=0; d<$scope.dealersClone.length; d++){
                                    if($scope.dealersClone[d].district){
                                        if(($scope.dealersClone[d].district._id == $scope.districtFilter[df])){
                                            $scope.dealers.push($scope.dealersClone[d]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else{
                    if($scope.areaFilter.length){
                        // console.log('State Else District ELSE Area IF');
                        for(var af=0; af<$scope.areaFilter.length; af++){
                            if($scope.categoryFilter.length){
                                // console.log('State Else District Else Area IF Category IF');
                                for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                    for(var d=0; d<$scope.dealersClone.length; d++){
                                        if($scope.dealersClone[d].area && $scope.dealersClone[d].category){
                                            if(($scope.dealersClone[d].area._id == $scope.areaFilter[af]) && ($scope.dealersClone[d].category._id == $scope.categoryFilter[cf])){
                                                $scope.dealers.push($scope.dealersClone[d]);
                                            }
                                        }
                                    }
                                }
                            } else{
                                // console.log('State Else District Else Area IF Category Else');
                                for(var d=0; d<$scope.dealersClone.length; d++){
                                    if($scope.dealersClone[d].area){
                                        if(($scope.dealersClone[d].area._id == $scope.areaFilter[af])){
                                            $scope.dealers.push($scope.dealersClone[d]);
                                        }
                                    }
                                }
                            }
                        }
                    } else{
                        if($scope.categoryFilter.length){
                            // console.log('State Else District Else Area Else Category IF');
                            for(var cf=0; cf<$scope.categoryFilter.length; cf++){
                                for(var d=0; d<$scope.dealersClone.length; d++){
                                    if($scope.dealersClone[d].category){
                                        if($scope.dealersClone[d].category._id == $scope.categoryFilter[cf]){
                                            $scope.dealers.push($scope.dealersClone[d]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            refreshPicker();
        }

        $scope.createPlan = function(){
            if($scope.plan.name && $scope.plan.visitType && $scope.plan.dealer.length){
                if(!$scope.plan.photo){
                    $scope.plan.photo = false;
                }
                if(!$scope.plan.checkin){
                    $scope.plan.checkin = false;
                }
                if(!$scope.plan.label1){
                    $scope.plan.label1 = false;
                }
                ExpensesService.createJourneyPlan($scope.plan).then(function(res){
                    // loadDefault();
                    // refreshPicker();
                    $scope.back();
                });
            } else{
                swal('', 'All the fields are required');
            }
        }

        function editPlan(){
            if($stateParams.obj){
                $scope.buttons = btnObj[1];
                $scope.plan = angular.copy($stateParams.obj);
                $scope.plan.dealer = [];
                if($stateParams.obj.dealer){
                    for(var i=0; i<$stateParams.obj.dealer.length; i++){
                        $scope.plan.dealer.push($stateParams.obj.dealer[i]._id);
                    }
                }
                if($stateParams.obj.visitType){
                    $scope.plan.visitType = $stateParams.obj.visitType._id;
                }
                refreshPicker();
            }
        }

        $scope.updatePlan = function(){
            if($scope.plan.name && $scope.plan.visitType && $scope.plan.dealer.length){
                ExpensesService.updateJourneyPlan($scope.plan).then(function(res){
                    $scope.back();
                });
            } else{
                swal('', 'All the fields are required');
            }
        }
    }
}());