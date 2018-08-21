app.controller("drivingScreenController", drivingScreenController);

function drivingScreenController($scope, $timeout, $interval, localStorageService, arduinoService, wifiUtils) {
	
	
	$scope.gasButton = $("#gasIcon");
	$scope.steerButton = $("#steerIcon");
	
	var gasDefX =window.innerWidth*0.2-28;
	var gasDefY = window.innerHeight/2-28;
	var steerDefX = window.innerWidth*0.8-28;
	var steerDefY = window.innerHeight/2-28;
	
	$scope.gasButton.css("left", gasDefX+"px");
	$scope.steerButton.css("left", steerDefX+"px");
	$scope.gasButton.css("top", gasDefY+"px");
	$scope.steerButton.css("top", steerDefY+"px");
	
	$scope.steer = function(event, end) {
		console.log(event);
		console.error(end);
		if (!end) {
			$scope.steerButton.css("left", event.center.x-28);
			//controlli sulla posizione
			//modifica variabile accelerazione globale
		} else {
			$scope.steerButton.animate({left: steerDefX+"px"}, 1000, "swing");
		}
	}
	
	$scope.gas = function(event, end) {
		console.log(event);
		console.error(end);
		if (!end) {
			$scope.gasButton.css("top", event.center.y-28);
			//controlli sulla posizione
			//modifica variabile sterzo globale
		} else {
			$scope.gasButton.animate({top: gasDefY+"px"}, 1000, "swing");
		}
	}
	
}