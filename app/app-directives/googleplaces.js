(function() {
    'use strict';
    app.directive('googlePlaces', function(){
  return {
    restrict:'E',
    replace:true,
    scope: {location:'='},
    template: '<input id="google_places_ac" name="google_places_ac" type="text" class="form-control area_input transition" />',
      link: function($scope, elm, attrs){
              if(attrs.city =='cities'){
                var options = {
                  types: ['(cities)'],
                  componentRestrictions: {country: 'IN'}
                }
              }
              else{
                var options = {
                  componentRestrictions: {country: 'IN'}
                }
              }
              //var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], options);
              var autocomplete = new google.maps.places.Autocomplete(elm[0], options);

              google.maps.event.addListener(autocomplete, 'place_changed', function() {
               
                var place = autocomplete.getPlace();
                if(attrs.city =='cities'){
                  $scope.location = $("#google_places_ac")[0].value + '"' +place.geometry.location.lat() + '"' + place.geometry.location.lng();
                }
                else{
                  $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                }
                $scope.$apply();
              });
      }
  };
});
  
})();