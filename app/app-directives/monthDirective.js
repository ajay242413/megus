(function() {
    'use strict';
    angular.module('app').directive('monthselect', monthDirective);

    function monthDirective(){
         return {
            restrict: 'E',
            replace: true,     
            scope:{   },
            template: '<select><option></option><option ng-repeat="month in months" value="{{month.value}}" ng-selected="month.value == selected">{{month.text}}</option></select>',
            // template: '<select ng-options="month.value for month in months"></select>',
            controller: ["$scope", "$element", "$attrs", function (scope, element, attrs) {

                scope.months = [];
                scope.months.push({value:1, text:'January'});
                scope.months.push({value:2, text:'February'});
                scope.months.push({value:3, text:'March'});
                scope.months.push({value:4, text:'April'});
                scope.months.push({value:5, text:'May'});
                scope.months.push({value:6, text:'June'});
                scope.months.push({value:7, text:'July'});
                scope.months.push({value:8, text:'August'});
                scope.months.push({value:9, text:'September'});
                scope.months.push({value:10, text:'October'});
                scope.months.push({value:11, text:'November'});
                scope.months.push({value:12, text:'December'});

                scope.selected = moment().month() +1;
            }]
        }
    }
})();