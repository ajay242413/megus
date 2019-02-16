angular.module('app', [])
.directive('myAutoCompleteSearch', function($timeout) {
  return {
    controller: 'myAutoCompleteController',
    restrict: 'E',
    replace: true,
    scope: {
      choices: '=',
      enteredtext: '=',
      minlength: '=',
      selected: '='
    },
    templateUrl: 'autocomplete.html'
  }
}).
controller('myAutoCompleteController', function($scope) {
  
  $scope.filteredChoices = [];
  $scope.isVisible = {
    suggestions: false
  };
  
  $scope.filterItems = function () {
    if($scope.minlength <= $scope.enteredtext.length) {
      $scope.filteredChoices = querySearch($scope.enteredtext);
      $scope.isVisible.suggestions = $scope.filteredChoices.length > 0 ? true : false;
    }
    else {
      $scope.isVisible.suggestions = false;
    }
  };
  
  
  /**
   * Takes one based index to save selected choice object
   */
  $scope.selectItem = function (index) {
    $scope.selected = $scope.choices[index - 1];
    $scope.enteredtext = $scope.selected.label;
    $scope.isVisible.suggestions = false;
  };
  
  /**
   * Search for states... use $timeout to simulate
   * remote dataservice call.
   */
  function querySearch (query) {
    // returns list of filtered items
    return  query ? $scope.choices.filter( createFilterFor(query) ) : [];
  }
  
  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(item) {
      // Check if the given item matches for the given query
      var label = angular.lowercase(item.label);
      return (label.indexOf(lowercaseQuery) === 0);
    };
  }
});


angular.module('autocompleteApp').
controller('mainController', function ($scope) {
  var choices = [
    { index: 1, id: 'ABC1', label: 'One' },
    { index: 2, id: 'ABC2', label: 'Two' },
    { index: 3, id: 'ABC3', label: 'Three' },
    { index: 4, id: 'ABC4', label: 'Four' },
    { index: 5, id: 'ABC5', label: 'Five' },
    { index: 6, id: 'ABC6', label: 'Six' },
    { index: 7, id: 'ABC7', label: 'Seven' },
    { index: 8, id: 'ABC8', label: 'Eight' },
    { index: 9, id: 'ABC9', label: 'Nine' },
    { index: 10, id: 'ABC10', label: 'Ten' },
  ];
  
  $scope.items = choices;
  $scope.text = '';
  $scope.minlength = 1;
  $scope.selected = {};
});
