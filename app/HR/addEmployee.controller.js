(function(){
    'use strict';
    angular.module('app').controller('HR.AddEmployee.IndexController', addEmployeeController);

    function addEmployeeController(MasterService, HRService, UserService, $scope, $state, $stateParams, $uibModal){
        
    	var vm=this, activeObj={active:true}, btnObj=[{method:"create", title:"Create"}, {method:"update", title:"Update"}], defaultOption={view:false, new:false, edit:false, delete:false};
        loadDefault();

        function loadDefault(){  
            $scope.employee = {};
            $scope.bank = {};
            $scope.files = {};
            vm.permission = {
                master:{client:angular.copy(defaultOption), accounts:angular.copy(defaultOption), generalMaster:angular.copy(defaultOption), hr:angular.copy(defaultOption), product:angular.copy(defaultOption), supplier:angular.copy(defaultOption), master:angular.copy(defaultOption)},
                inventory:{purchaseAck:angular.copy(defaultOption), purchaseOrder:angular.copy(defaultOption), purchaseOrderManagement:angular.copy(defaultOption), sales:angular.copy(defaultOption), salesOrder:angular.copy(defaultOption), salesOrderManagement:angular.copy(defaultOption), stockRegister:angular.copy(defaultOption), stockStatus:angular.copy(defaultOption), stockTransfer:angular.copy(defaultOption), inventory:angular.copy(defaultOption)},
                hr:{employee:angular.copy(defaultOption), expense:angular.copy(defaultOption), hr:angular.copy(defaultOption)},
                accounts:{accountStatement:angular.copy(defaultOption), contra:angular.copy(defaultOption), creditNote:angular.copy(defaultOption), debitNote:angular.copy(defaultOption), journal:angular.copy(defaultOption), ledger:angular.copy(defaultOption), paymentVoucher: angular.copy(defaultOption), receiptVoucher:angular.copy(defaultOption), accounts:angular.copy(defaultOption)}
            };
            $scope.buttons = btnObj[0];
            initController();
        }

        function initController(){
            MasterService.readArea(activeObj).then(function(res){
                $scope.areaList = res.data;
                refreshPicker();
            }); 

            MasterService.readCity(activeObj).then(function(res){
                $scope.cityList = res.data;
                refreshPicker();
            });

            MasterService.readState(activeObj).then(function(res){
                $scope.stateList = res.data;
                refreshPicker();
            });

            MasterService.readCountry(activeObj).then(function(res){      
                $scope.countryList = res.data;
                refreshPicker();
            });

            MasterService.readEmpDepartment(activeObj).then(function(res){      
                $scope.departmentList = res.data;
                refreshPicker();
            });

            MasterService.readEmpDesignation(activeObj).then(function(res){      
                $scope.designationList = res.data;
                refreshPicker();
                
            });

            UserService.getCurrentUser().then(function(res){
                $scope.user = res.data;
            });
        }


        if($stateParams.obj){
            $scope.buttons = btnObj[1];
            $scope.employee = angular.copy($stateParams.obj);
            if($scope.employee.area){
                $scope.employee.area = $scope.employee.area._id;
            }
            if($scope.employee.city){
                $scope.employee.city = $scope.employee.city._id;
            }
            if($scope.employee.state){
                $scope.employee.state = $scope.employee.state._id;
            }
            if($scope.employee.country){
                $scope.employee.country = $scope.employee.country._id;
            }
            if($scope.employee.department){
                $scope.employee.department = $scope.employee.department._id;
            }
            if($scope.employee.designation){
                $scope.employee.designation = $scope.employee.designation._id;
            }
            if($scope.user){
                $scope.employee.loggedUser = $scope.user._id;
            }
            if($scope.employee.bank){
                $scope.bank = $scope.employee.bank;
                delete $scope.employee.bank;
            }
            if($scope.employee.permission){
                $scope.checkPermission = true;
                vm.permission = $scope.employee.permission;
                delete $scope.employee.permission;
            }
            if($scope.employee.files){
                $scope.filesClone = $scope.employee.files;
                delete $scope.employee.files;
            }
            refreshPicker();
        }

        function refreshPicker(){
            angular.element(document).ready(function(){ 
                $('.selectpicker').selectpicker("refresh");  
            });
        }

        $scope.backEmpDashboard = function(){
            $state.go('HR.employee',null,{reload: true});
        }

        $scope.create = function(){
            if($scope.employee){
                $scope.employee.lastAccessedBy = $scope.user._id;
                if($scope.bank){
                    $scope.employee.bank = $scope.bank;
                }
                if($scope.checkPermission){
                    $scope.employee.permission = vm.permission;
                }
                if(($scope.employee.name) && ($scope.employee.mobNum) && ($scope.employee.email)){
                    HRService.saveEmployee($scope.employee,$scope.files).then(function(res) {
                        $state.reload();
                        alert1('<b>Success</b> - Data Saved Successfully', 'ti-thumb-up', 'success');
                    });
                } else{
                    swal("Warning", "Employee Name, Mobile Number and Email ID is Compulsary Fields.");
                }
            }
        }

        $scope.update = function(){
            if ($scope.employee){
                if($scope.bank){
                    $scope.employee.bank = $scope.bank;
                }
                if($scope.checkPermission){
                    $scope.employee.permission = vm.permission;
                }
                if(($scope.employee.name) && ($scope.employee.mobNum) && ($scope.employee.email)){
                    HRService.updateEmployee($scope.employee,$scope.files).then(function(res){
                        $state.go('HR.employee', null, {reload:true});
                    });
                } else{
                    swal("Warning", "Employee Name, Mobile Number and Email ID is Compulsary Fields.");
                }
            }
        }

        $scope.permissionDialog = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'permissionContent.html',
                backdrop: 'static',
                keyboard: false,
                controller: function permissionController($scope, $uibModalInstance){
                    $scope.permission = vm.permission;
                    $scope.viewAllClicked = function(event, opt1, opt2){
                        angular.forEach($scope.permission[opt1], function (value, key){
                            if (key != opt1) {
                                $scope.permission[opt1][key][opt2] = event.target.checked;
                            }
                        });
                    }

                    $scope.viewClicked = function(opt1, opt3){
                        var check = 0;
                        angular.forEach($scope.permission[opt1], function(value, key){
                            if (key != opt1) {
                                if ($scope.permission[opt1][key][opt3] == false){
                                    check = 1;
                                }
                            }
                        });
                        if (check == 1){
                            $scope.permission[opt1][opt1][opt3] = false;
                        } else{
                            $scope.permission[opt1][opt1][opt3] = true;
                        }
                    }
                    
                    $scope.close = function(){
                        vm.permission = $scope.permission;
                        $uibModalInstance.close();
                    };
                }
            });
        }
    }
})();

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}