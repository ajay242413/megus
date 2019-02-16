(function() {
    'use strict';
    angular.module('app').controller('GEO.IndexController', geoController);

    function geoController(ClientService, $scope, $http) {

		var vm=this;
		var customIcons = {
      		restaurant: {
        		icon: 'reports/mapsfiles/icons/map_off.png'
      		},
		    rest: {
		       	icon: 'reports/mapsfiles/icons/map_off.png'
		    },
		    bar: {
		       	icon: 'reports/mapsfiles/icons/map_icon.png'
		    }
		};
		loadDefault();

		function loadDefault(){
			$scope.geoOptions = ['Employee','Dealer','Item - Model 1'];
			$scope.geoOption = $scope.geoOptions[0];
			
			initController();
    		refreshPicker();
			// loadTable();
		}

		function refreshPicker() {
			angular.element(document).ready(function() { 
   				$('.selectpicker').selectpicker("refresh");
   			});
		}

		function initController() {
			
        }

		$scope.generalOptChange = function(){
			// loadTable();
			$scope.reset();
		}

	 	$scope.loadEmpMap = function() {
			var map = new google.maps.Map(document.getElementById("map"), {
			    center: new google.maps.LatLng(11.341128,77.717562),
			    zoom: 10,
			    mapTypeId: 'roadmap'
			});
			var infoWindow = new google.maps.InfoWindow;

			// Change this depending on the name of your PHP file
			downloadUrl("reports/mapsfiles/emp_data.xml", function(data) {
			    var xml = data.responseXML;
			    var markers = xml.documentElement.getElementsByTagName("marker");
			    for (var i = 0; i < markers.length; i++) {
			    	var name = markers[i].getAttribute("name");
			        var address = markers[i].getAttribute("address");
			        var type = markers[i].getAttribute("type"); var time= markers[i].getAttribute("time");
			        var point = new google.maps.LatLng(parseFloat(markers[i].getAttribute("lat")),parseFloat(markers[i].getAttribute("lng")));
			       	var html = "<b>" + name + "</b> <br/>" + address + "<br>" +time;
			        var icon = customIcons[type] || {};
			        var marker = new google.maps.Marker({
			           	map: map,
			           	position: point,
			           	icon: icon.icon
			        });
			        bindInfoWindow(marker, map, infoWindow, html);
			    }
			});
		}
		
		$scope.loadDealerMap = function() {
			var xmlStoreList = document.createElement("markers");

			ClientService.readDealer()
			.then(function(res) {
				var myData = res.data;
				myData.forEach(function(item) {
					var xmlStoreList_marker = document.createElement("marker");
	
					xmlStoreList_marker.setAttribute("name",item.name);
					xmlStoreList_marker.setAttribute("address",item.address);
					xmlStoreList_marker.setAttribute("lat",item.latitude);
					xmlStoreList_marker.setAttribute("lng",item.longitude);
					xmlStoreList_marker.setAttribute("type","bar");
					xmlStoreList_marker.setAttribute("time",item.creationTime);

					xmlStoreList.appendChild(xmlStoreList_marker);
				});
				var map = new google.maps.Map(document.getElementById("map"), {
				    center: new google.maps.LatLng(11.341128,77.717562),
				    zoom: 10,
				    mapTypeId: 'roadmap'
				});
				var infoWindow = new google.maps.InfoWindow;
				var xml = xmlStoreList;
				var markers = xml.getElementsByTagName("marker");
			    for (var i = 0; i < markers.length; i++) {
			    	var name = markers[i].getAttribute("name");
			        var address = markers[i].getAttribute("address");
			        var type = markers[i].getAttribute("type"); var time= markers[i].getAttribute("time");
			        var point = new google.maps.LatLng(parseFloat(markers[i].getAttribute("lat")),parseFloat(markers[i].getAttribute("lng")));
			       	var html = "<b>" + name + "</b> <br/>" + address + "<br>" +time;
			        var icon = customIcons[type] || {};
			        var marker = new google.maps.Marker({
			           	map: map,
			           	position: point,
			           	icon: icon.icon
			        });
			        bindInfoWindow(marker, map, infoWindow, html);
			    }

			});
	    }

	    //this is dummy code, yet to work on this
	    $scope.loadItemMap = function() {
			var xmlStoreList = document.createElement("markers");

			ClientService.readDealer()
			.then(function(res) {
				var myData = res.data;
				myData.forEach(function(item) {
					var xmlStoreList_marker = document.createElement("marker");
	
					xmlStoreList_marker.setAttribute("name",item.name);
					xmlStoreList_marker.setAttribute("address",item.address);
					xmlStoreList_marker.setAttribute("lat",item.latitude);
					xmlStoreList_marker.setAttribute("lng",item.longitude);
					xmlStoreList_marker.setAttribute("type","bar");
					xmlStoreList_marker.setAttribute("time",item.creationTime);

					xmlStoreList.appendChild(xmlStoreList_marker);
				});
				var map = new google.maps.Map(document.getElementById("map"), {
				    center: new google.maps.LatLng(11.341128,77.717562),
				    zoom: 10,
				    mapTypeId: 'roadmap'
				});
				var infoWindow = new google.maps.InfoWindow;
				var xml = xmlStoreList;
				var markers = xml.getElementsByTagName("marker");
			    for (var i = 0; i < markers.length; i++) {
			    	var name = markers[i].getAttribute("name");
			        var address = markers[i].getAttribute("address");
			        var type = markers[i].getAttribute("type"); var time= markers[i].getAttribute("time");
			        var point = new google.maps.LatLng(parseFloat(markers[i].getAttribute("lat")),parseFloat(markers[i].getAttribute("lng")));
			       	var html = "<b>" + name + "</b> <br/>" + address + "<br>" +time;
			        var icon = customIcons[type] || {};
			        var marker = new google.maps.Marker({
			           	map: map,
			           	position: point,
			           	icon: icon.icon
			        });
			        bindInfoWindow(marker, map, infoWindow, html);
			    }

			});
	    }

		function bindInfoWindow(marker, map, infoWindow, html) {
      		google.maps.event.addListener(marker, 'click', function() {
	        	infoWindow.setContent(html);
	        	infoWindow.open(map, marker);
	      	});
	    }

	    function downloadUrl(url, callback) {
	    	var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
	    	request.onreadystatechange = function() {
		        if (request.readyState == 4) {
		          request.onreadystatechange = doNothing;
		          callback(request, request.status);
		        }
	      	};
        	request.open('GET', url, true);
	    	request.send(null);
	    }

	    function doNothing() {

	    }

	    $scope.reset = function(){
			vm.submitted = undefined;
			switch($scope.generalOption) {
				case 'Area':
					if(vm.areaForm) {
						// vm.areaForm.name.$dirty = false;
						// vm.areaForm.code.$dirty = false;
					}
					break;
			}

			$scope.buttons = btnObj[0];
			refreshPicker();
		}
	}
}());