(function(){
    'use strict';
    angular.module('app').controller('settings.IndexController', settingsController);

    function settingsController(MasterService, SettingService, $scope){

        var vm=this, activeObj ={active: true};
        $scope.logoUrl = "../img/faces/face-0.jpg";
        $scope.user = $scope.rootUser;
        $scope.spName = "Stock Point";
        $scope.chart1 = 'Primary Sales ( RDS WISE)';
        $scope.chart2 = 'Seondary Sales ( RDS WISE)';
        loadDefault();

        function loadDefault(){
            $scope.companySetting = {};
            $scope.invoiceSetting = {};
            $scope.defaultSetting = {};
            $scope.formatSetting = {};
            initController();
        }

        function initController(){
            MasterService.readState(activeObj).then(function(res) {
                $scope.states = res.data;
                refreshPicker();
            });

            MasterService.readSalePoint(activeObj).then(function(res) {
                $scope.salepoints = res.data;
                refreshPicker();
            });

            SettingService.readSetting().then(function(res) {
                if(res.data.length){
                    if(res.data[0].company){
                        $scope.companySetting = res.data[0].company;
                        $scope.companySetting.state = res.data[0].company.state._id;
                        if($scope.companySetting.logo){
                            $scope.logoUrl = '../upload_files/logo/' + $scope.companySetting.logo;
                        }
                    }
                    if(res.data[0].invoice){
                        $scope.invoiceSetting = res.data[0].invoice;
                    }
                    if(res.data[0].format){
                        $scope.formatSetting = res.data[0].format;
                        if(res.data[0].format.stockPoint){
                            $scope.spName = res.data[0].format.stockPoint;
                        }
                    }
                    if(res.data[0].default){
                        $scope.defaultSetting = res.data[0].default;
                    }
                }
                refreshPicker();
            });
        }

        function refreshPicker(){
            angular.element(document).ready(function() { 
                $('.selectpicker').selectpicker("refresh");
            });
        }

        $scope.saveCompanySetting = function(){
            sweetAlert();
            if($scope.logo){
                $scope.files = {logo:$scope.logo};
            } else{
                $scope.files = {};
            }
            SettingService.updateSetting({company: $scope.companySetting}, $scope.files).then(function(res){
                if(res.data){
                    swal.close();
                    swal("","Saved Successfully");
                }
            });
        }

        $scope.saveInvoiceSetting = function(){
            sweetAlert();
            if($scope.invoiceSetting){
                SettingService.updateSetting({invoice: $scope.invoiceSetting}).then(function(res){
                    if(res.data){
                        swal.close();
                        swal("","Saved Successfully");
                    }
                });
            }
        }

        $scope.saveFormatSetting = function(){
            sweetAlert();
            if($scope.formatSetting){
                SettingService.updateSetting({format: $scope.formatSetting}).then(function(res){
                    if(res.data){
                        swal.close();
                        initController();
                        swal("","Saved Successfully");
                    }
                });
            }
        }

        $scope.saveDefaultSetting = function(){
            sweetAlert();
            if($scope.defaultSetting){
                SettingService.updateSetting({default: $scope.defaultSetting}).then(function(res){
                    if(res.data){
                        swal.close();
                        swal("","Saved Successfully");
                    }
                });
            }
        }

        function sweetAlert(){
            swal({
                title: "Saving",
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                imageUrl: '../images/200px/spinner.gif'
            });
        }
    }
}());