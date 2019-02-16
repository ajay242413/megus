var app = angular.module('app');

  	// On esc event
app.directive('onEsc', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attr.onEsc);
      }
    });
  };
});

// On enter event
app.directive('onEnter', function() {
  return function(scope, elm, attr) {
    elm.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attr.onEnter);
      }
    });
  };
});

// Inline edit directive
app.directive('editInPlace', function($timeout) {
  return {
  	restrict: 'AE',
    /*scope: {
      model: '=inlineEdit',
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },*/
    scope: { value: '=' },
    link: function(scope, elm, attr) {
      var previousValue;
      
      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;
        
        $timeout(function() {
          elm.find('input')[0].focus();
        }, 0, false);
      };
      scope.save = function() {
        scope.editMode = false;
        scope.handleSave({value: scope.model});
      };
      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
    },
    //templateUrl: 'inline-edit.html'
    templateUrl: '<h1> Prema here  </h1>'
  };
});

/*
app.directive('editInPlace', function() {
  		return {
    		restrict: 'E',
	    	scope: { value: '=' },
	    	template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value"></input>',
	    	link: function ( $scope, element, attrs ) {
		      	
		      	// Let's get a reference to the input element, as we'll want to reference it.
		    	var inputElement = angular.element( element.children()[1] );
		      
		      	// This directive should have a set class so we can style it.
		      	element.addClass('edit-in-place' );
		      
		      	// Initially, we're not editing.
		      	$scope.editing = false;
		      
		      	// ng-click handler to activate edit-in-place
		      	$scope.edit = function () {
		        	$scope.editing = true;
		        
		        	// We control display through a class on the directive itself. See the CSS.
		        	element.addClass('active');
		        
		        	// And we must focus the element. 
		        	// `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
		        	// we have to reference the first element in the array.
		        	inputElement[0].focus();
	      		};
	      
		      	// When we leave the input, we're done editing.
		      	inputElement.prop('onblur', function() {
		        	$scope.editing = false;
		        	element.removeClass('active');
		      	});
	    	}
	  	};
	});*/
	