(function() {
    'use strict';
    angular.module('app').controller('Master.ImportDealer.IndexController', importDealerController);

    function importDealerController(MasterService, ClientService, CustomService, ExcelService, $scope, $state) {

        var vm = this, activeObj = { active: true};
        loaDefault();

        function loaDefault(){
            $scope.dealers = [];
            $scope.errormsg = "";
            $scope.accounts = {};
            initController();
        }

        function initController(){
            MasterService.readState(activeObj).then(function(res){
                if(res.data){
                    $scope.states = res.data;
                }
            });

            MasterService.readArea(activeObj).then(function(res){
                if(res.data){
                    $scope.areas = res.data;
                }
            });

            MasterService.readFinancialYear(activeObj).then(function(res){
                if(res.data){
                    $scope.finYear = res.data;
                    var finInd = $scope.finYear.findIndex(x => x.status === true);
                    if(($scope.finYear.length == 0) || (finInd < 0)){
                        $scope.errormsg = $scope.errormsg + 'Add Financial Year In Master Accounts\n';
                    } else{
                        $scope.accounts['finYear'] = $scope.finYear[finInd]['_id'];
                    }
                    loadLedger();
                }
            });

            function loadLedger(){
                MasterService.readLedgerGroup().then(function(res){
                    if(res.data){
                        $scope.ledger = CustomService.getObject(res.data, 'name', 'Sundry Debtors');
                        if((!$scope.ledger)){
                            $scope.errormsg = $scope.errormsg + 'Ledger Group("sundry debtors") not found !!!'
                            swal('', 'Missing Values');
                        } else{
                            $scope.accounts['ledger'] = $scope.ledger['_id'];
                        }
                    }

                });
            }

            ClientService.readClientCode().then(function(res){
                if(res.data){
                    $scope.code = res.data.code;
                }
            });
        }

        $scope.back = function(){
            $state.go('master.dealer');
        }

        $scope.upload = function(){
            $scope.dealers = [];
            var file = $scope.excelSheet;
            if(file){
                swal({title: "Validating", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/gear.gif'});
                var reader = new FileReader();
                reader.onload = function(e){
                    var data = e.target.result, workbook = XLSX.read(data, {type:'binary'}), sheetName = workbook.SheetNames[0], excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    $scope.inValid = [];
                    if(excelData.length > 0){
                        var code =  parseInt($scope.code);
                        for(var i=0; i<excelData.length; i++) {
                            var check = 0, dealer = {};
                            if(excelData[i]['Name']){
                                dealer['name'] = excelData[i]['Name'];
                                check = check + 1;
                            }
                            if(excelData[i]['Phone Number']){
                                dealer['phoneno'] = excelData[i]['Phone Number'];
                                check = check + 1;
                            }
                            if(excelData[i]['Area']){
                                var areaInd = $scope.areas.findIndex(x => x.name === excelData[i]['Area']);
                                if(areaInd >= 0){
                                    dealer['area'] = $scope.areas[areaInd]['_id'];
                                    check = check + 1;
                                }
                            }
                            if(excelData[i]['State']){
                                var stateInd = $scope.states.findIndex(x => x.name === excelData[i]['State']);
                                if(stateInd >= 0){
                                    dealer['state'] = $scope.states[stateInd]['_id'];
                                    check = check + 1;
                                }
                            }
                            if(excelData[i]['Credit Days']){
                                dealer['creditDays'] = excelData[i]['Credit Days'];
                                check = check + 1;
                            }
                            if(excelData[i]['Credit Limit']){
                                dealer['creditLimit'] = excelData[i]['Credit Limit'];
                                check = check + 1;
                            }
                            if(check == 6){
                                $scope.dealers.push(dealer);
                                $scope.dealers[$scope.dealers.length - 1]['code'] = code;
                                code = parseInt(code) + 1;
                            } else {
                                $scope.inValid.push(excelData[i]);
                            }
                        }
                        swal.close();
                        if($scope.inValid.length != 0){
                            ExcelService.exportCSV($scope.inValid, '', 'Invalid Dealers');
                            swal("", "Invalid Dealers");
                        }
                    }
                    else{
                        swal.close();
                        swal("", "Check Excel Sheet");
                    }
                }
                reader.onerror = function(ex){
                    swal.close();
                    swal("", "Check Excel Sheet");
                }
                reader.readAsBinaryString(file);
            }
        }

        $scope.create = function(){
            if($scope.dealers.length){
                swal({title: "Validating", showCancelButton:false, showConfirmButton:false, allowOutsideClick:false, allowEscapeKey:false, imageUrl:'../images/200px/gear.gif'});
                ClientService.importDealer({dealer: $scope.dealers, account: $scope.accounts}).then(function(res){
                    if(res.data){
                        swal.close();
                        swal('', 'Created Successfully');
                    }
                });
            }
        }
	}
}());