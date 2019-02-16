(function(){
    'use strict';
     angular.module('app').controller('dashboard.IndexController', homeController);

    function homeController(HRService, InventoryService, ClientService, MasterService, UserService, $scope){
        
        var vm=this;
        UserService.getCurrentUser().then(function(res){
            $scope.user = res.data;
            if($scope.user.userType == "b"){
                loadDefault();
            }
        });
        loadController();

        function loadController(){
            // HRService.readEmployee().then(function (res) {
            //     $scope.hrs = res.data;
            // });

            // ClientService.readClient().then(function (res) {
            //     $scope.rds = res.data;
            // });

            // MasterService.readSupplier().then(function (res) {
            //     $scope.suppliers = res.data;
            // });
        }
        
        function loadDefault(){
            var check = 0;
            ClientService.readClient().then(function(res){
                if(res.data){
                    $scope.clients = res.data;
                    check = check + 1;
                    if(check == 2){
                        initController();
                    }
                }
            });

            MasterService.readProductItem({active:true}).then(function(res){
                if(res.data){
                    $scope.productItems = res.data;
                    check = check + 1;
                    if(check == 2){
                        initController();
                    }
                }
            });

        }
        
        function initController(){
           /*  InventoryService.readRdsSalesReport({type: 'ps'}).then(function(res){
                if(res.data){
                    $scope.primarySales = res.data;
                    // primaryReport();
                }
            });

            InventoryService.readRdsSalesReport({type: 'ss'}).then(function(res){
                if(res.data){
                    $scope.secondarySales = res.data;
                    // secondaryReport();
                }
            }); */
            chartForActivationTrendOfPriceRange();
            initVectorMap();
            
        }
         function initVectorMap(){
            
            var mapData = {
                   "IN-DL": 690,
                   "IN-MH": 1300,                  
                   "IN-KA": 760,                 
                   "IN-TN": 2920,
                   "IN-GJ": 600,
                   "IN-WB": 550
                 
               };
   
               $('#indiaMap').vectorMap({
                   map: 'in_mill_en',
                   backgroundColor: "transparent",
                   zoomOnScroll: false,
                   regionStyle: {
                       initial: {
                           fill: '#AED6F1',
                            
                           stroke: 'none',
                           "stroke-width": 0,
                           "stroke-opacity": 0
                       }
                   },
   
                   series: {
                       regions: [{
                           values: mapData,
                           scale: ["#76D7C4","#0E6251"],
                           normalizeFunction: 'polynomial'
                       }]
                   },
                   onRegionTipShow: function(e, el, code){
                    el.html(el.html()+' (GDP - '+mapData[code]+')');
                  }
               });
       }

        function chartForActivationTrendOfPriceRange(){            
            var chart = c3.generate({
                bindto: '#activationTrendPerPriceRange',
                data: {
                    x: 'x',
                    xFormat: '%Y-%m-%d',
                    columns: [
                        ['x', '2019-01-03', '2019-01-04', '2019-01-05', '2019-01-06', '2019-01-07', '2019-01-08', '2019-01-09', '2019-01-10', '2019-01-11', '2019-01-12', '2019-01-13', '2019-01-14', '2019-01-15', '2019-01-16', '2019-01-17', '2019-01-18', '2019-01-19', '2019-01-20', '2019-01-21', '2019-01-22', '2019-01-23', '2019-01-24', '2019-01-25', '2019-01-26', '2019-01-27', '2019-01-28', '2019-01-29', '2019-01-30', '2019-01-31', '2019-02-01'],
                        ['Basic', 30, 200, 100, 400, 150, 250, 323, 300, 400, 450, 250, 200, 150, 300, 400, 543, 780, 1022, 500, 200, 50, 100, 444, 400, 600, 300, 500, 300, 400, 240],
                        ['Midend', 130, 300, 200, 500, 250, 450, 300, 100, 600, 730, 240, 300, 500, 300, 400, 800, 600, 1000, 1200, 1300, 1200, 900, 950, 1000, 400, 300, 200, 300, 450, 512],
                        ['Hignend', 0, 0,200,100, 100, 300, 500, 400, 500, 700, 400, 200, 400, 300, 200, 100, 40, 90, 10, 30, 40, 30, 20, 100, 400, 500, 300, 400, 250, 612]
                    ]
                },            
          

            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                         
                    },
                    label: { // ADD
                        text: 'Date',
                        position: 'outer-middle'
                      }
                },
                y: {
                    
                    label: { // ADD
                        text: 'Number of Activations',
                        position: 'outer-right'
                      }
                }
            },                
           
        });
          
    }

        /* PRIMARY SALES - BAR CHART */
      /*   function primaryReport(){
            var dataPS={labels:[], series:[]};
            for(var i=0; i<$scope.clients.length; i++){
                var cliInd = $scope.primarySales.findIndex(x => x.clientID == $scope.clients[i]._id);
                if(cliInd >= 0){
                    for(var j=0; j<$scope.productItems.length; j++){
                        var itmInd = $scope.primarySales[cliInd].item.findIndex(x => x.name._id == $scope.productItems[j]._id);
                        var quantity = 0;
                        if(itmInd >= 0){
                            quantity = $scope.primarySales[cliInd].item[itmInd].quantity;
                        }
                        var serInd = dataPS.series.findIndex(x => x.name == $scope.productItems[j].itemName);
                        if(serInd >= 0){
                            dataPS.series[serInd].data.push(quantity);
                        } else{
                            dataPS.series.push({name:$scope.productItems[j].itemName, data:[quantity]});
                        }
                    }
                } else{
                    for(var j=0; j<$scope.productItems.length; j++){
                        var quantity = 0;
                        var serInd = dataPS.series.findIndex(x => x.name == $scope.productItems[j].itemName);
                        if(serInd >= 0){
                            dataPS.series[serInd].data.push(quantity);
                        } else{
                            dataPS.series.push({name:$scope.productItems[j].itemName, data:[quantity]});
                        }
                    }
                }
            }
            dataPS.labels = $scope.clients.map(a => a.name);
            var optionsPS = {
                stackBars:true,
                axisX:{
                    offset:100,
                    showGrid:false
                },
                height:"300px",
                plugins:[
                    Chartist.plugins.tooltip()
                ]
            };
    
            Chartist.Bar('#primarySales', dataPS, optionsPS).on('draw', function(data){
                if(data.type === 'bar'){
                    data.element.attr({
                        style:'stroke-width: 30px'
                    });
                }
            });
        } */

        /* SECONDARY SALES - BAR CHART */
    /*     function secondaryReport(){
            var dataSS={
                labels: ['RDS 1', 'RDS 2', 'RDS 3', 'RDS 4'],
                series: [
                    {name: "MODEL A", data: [600, 400, 800, 700]},
                    {name: "MODEL B", data: [400, 300, 700, 650]},
                    {name: "MODEL C", data: [800, 300, 100, 600]}
                ]
            } */
           /*  var dataSS={labels:[], series:[]};
            for(var i=0; i<$scope.clients.length; i++){
                var cliInd = $scope.secondarySales.findIndex(x => x.clientID == $scope.clients[i]._id);
                if(cliInd >= 0){
                    for(var j=0; j<$scope.productItems.length; j++){
                        var itmInd = $scope.secondarySales[cliInd].item.findIndex(x => x.name._id == $scope.productItems[j]._id);
                        var quantity = 0;
                        if(itmInd >= 0){
                            quantity = $scope.secondarySales[cliInd].item[itmInd].quantity;
                        }
                        var serInd = dataSS.series.findIndex(x => x.name == $scope.productItems[j].itemName);
                        if(serInd >= 0){
                            dataSS.series[serInd].data.push(quantity);
                        } else{
                            dataSS.series.push({name:$scope.productItems[j].itemName, data:[quantity]});
                        }
                    }
                } else{
                    for(var j=0; j<$scope.productItems.length; j++){
                        var quantity = 0;
                        var serInd = dataSS.series.findIndex(x => x.name == $scope.productItems[j].itemName);
                        if(serInd >= 0){
                            dataSS.series[serInd].data.push(quantity);
                        } else{
                            dataSS.series.push({name:$scope.productItems[j].itemName, data:[quantity]});
                        }
                    }
                }
            }
            dataSS.labels = $scope.clients.map(a => a.name); */
           /*  var optionsSS={
                seriesBarDistance:10,
                axisX:{
                    offset:100,
                    showGrid:false
                },
                height: "300px"
            },
            responsiveOptionsSS=[
                ['screen and (max-width: 640px)', {
                    seriesBarDistance:5,
                    axisX:{
                        labelInterpolationFnc:function(value){
                            return value[0];
                        }
                    }
                }]
            ];
    
            Chartist.Bar('#sceondarySales', dataSS, optionsSS, responsiveOptionsSS).on('draw', function(data){
                if(data.type === 'bar'){
                    data.element.attr({
                        style: 'stroke-width: 10px'
                    });
                    var g = data.element._node;
                    //Cambia el color de la rebanada
                    if(g.parentNode.classList[1] === "ct-series-a"){
                        data.element.attr({
                            style: 'stroke:#0074D9'
                        });
                    }
                    if(g.parentNode.classList[1] === "ct-series-b"){
                        data.element.attr({
                            style: 'stroke: #001f3f'
                        });
                    }
                    if(g.parentNode.classList[1] === "ct-series-c"){
                        data.element.attr({
                            style: 'stroke:#7FDBFF'
                        });
                    }
                }
            });
        } */
    }
})();