(function(){
    'use strict';
    angular.module('app').controller('MyProfile.IndexController', myProfileController);

    function myProfileController(SettingService, MasterService, HRService, UserService, $scope, $rootScope){

        var vm=this, activeObj={active:true};
        loadDefault();
        refreshPicker();
        
        function loadDefault() {
            $scope.user = $scope.rootUser;
            $scope.companyName = '';
            $scope.defaultPhoto = "../img/faces/face-4.png";
            $scope.profile = {};
            initController();
            if(($scope.rootUser.refName == 'client') || ($scope.rootUser.authorID == $scope.rootUser._id)){
                HRService.readProfile().then(function(res){
                    if(res.data){
                        $scope.empID = angular.copy(res.data._id);
                        if(res.data.profile){
                            $scope.profile = angular.copy(res.data.profile);
                            if(res.data.files){
                                $scope.profile.files = angular.copy(res.data.files);
                            }
                            setDropdownVaue();
                        }
                    }
                });
            } else {
                $scope.profile = angular.copy($scope.rootUser.refID);
                setDropdownVaue();
            }
        }

        function initController(){
            SettingService.readSetting().then(function(res){
                if(res.data.length){
                    if(res.data[0].company){
                        if(res.data[0].company.name){
                            $scope.companyName = res.data[0].company.name;
                        }
                    }
                }
            });

            MasterService.readCountry(activeObj).then(function(res){      
                $scope.countryList = res.data;
                refreshPicker();
            });
            
            MasterService.readState(activeObj).then(function(res){
                $scope.stateList = res.data;
                refreshPicker();
            });

            MasterService.readCity(activeObj).then(function(res){
                $scope.cityList = res.data;
                refreshPicker();
            });

            MasterService.readArea(activeObj).then(function(res){
                $scope.areaList = res.data;
                refreshPicker();
            }); 
        }

        function refreshPicker(){
            angular.element(document).ready(function() { 
                $('.selectpicker').selectpicker("refresh");
            });
        }

        $scope.updateProfile = function(){
            if($scope.photo){
                $scope.files={photo:$scope.photo};
            } else{
                $scope.files={};
            }
            if(($scope.rootUser.refName == 'client') || ($scope.rootUser.authorID == $scope.rootUser._id)){
                HRService.updateProfile({profile:$scope.profile, _id:$scope.empID}, $scope.files).then(function(res){
                    if(res.data){
                        $scope.empID = angular.copy(res.data._id);
                        if(res.data.profile){
                            $scope.profile = angular.copy(res.data.profile);
                            alert1('<b>Success</b> - Updated Successfully', 'ti-thumb-up', 'success');
                            setDropdownVaue();
                        }
                    }
                });
            } else{
                HRService.updateEmployee($scope.profile, $scope.files).then(function(res){
                    if(res.data){
                        $scope.profile = angular.copy(res.data);
                        $scope.rootUser.refID = angular.copy(res.data);
                        alert1('<b>Success</b> - Updated Successfully', 'ti-thumb-up', 'success');
                        setDropdownVaue();
                    }
                });
            }
        }

        $scope.updatePasswd = function() {
            var usrObj = {email: $scope.user.email, password: $scope.user.password};
            UserService.updatePasswd(usrObj)
            .then(function(res) {
                UserService.getCurrentUser().then(function(user) {
                    $rootScope.rootUser = user.data;
                    loadDefault();
                    alert1('<b>Success</b> - Updated Successfully', 'ti-thumb-up', 'success');
                });
            })
            .catch(function(err) {
                alert('Failed to update password');
            });
        }

        function setDropdownVaue(){
            if($scope.profile.files){
                if($scope.profile.files.photo){
                    $scope.defaultPhoto = "../upload_files/hr/" + $scope.profile.files.photo;
                }
            }
            if($scope.profile.country){
                $scope.profile.country = angular.copy($scope.profile.country._id);
            }
            if($scope.profile.state){
                $scope.profile.state = angular.copy($scope.profile.state._id);
            }
            if($scope.profile.city){
                $scope.profile.city = angular.copy($scope.profile.city._id);
            }
            if($scope.profile.area){
                $scope.profile.area = angular.copy($scope.profile.area._id);
            }
            refreshPicker();
        }
    }
}());

function alert1(msg, icn, clr){
    demo.showNotification('bottom', 'right', msg, icn, clr);
}