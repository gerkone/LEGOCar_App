app.controller("drivingScreenController", drivingScreenController);

function drivingScreenController($scope, $timeout, $interval, localStorageService, arduinoService, wifiUtils) {
	
	$scope.setGasButton($("#gasIcon"));
	$scope.setSteerButton($("#steerIcon"));
	
	
	$scope.setMax(window.innerWidth*0.6+28, window.innerWidth-28, 28, window.innerHeight*0.8);
	
	var gasDefX =window.innerWidth*0.2-28;
	var gasDefY = window.innerHeight*0.8-28;
	var steerDefX = window.innerWidth*0.8-28;
	var steerDefY = window.innerHeight*0.5-28;
	
	$scope.getGasButton().css("left", gasDefX+"px");
	$scope.getSteerButton().css("left", steerDefX+"px");
	$scope.getGasButton().css("top", gasDefY+"px");
	$scope.getSteerButton().css("top", steerDefY+"px");
	
	$scope.sendData();
	
	$("#gasIconLogic").on("touchstart", function(ev) {
		$scope.getGasButton().stop();
		targetY = ev.targetTouches.item(0).pageY;
		if (targetY <= $scope.maxUp) {
			$scope.getGasButton().css("top", ($scope.maxUp-28)+"px");
		} else if (targetY >= $scope.maxDown) {
			$scope.getGasButton().css("top", ($scope.maxDown-28)+"px");
		} else {
			$scope.getGasButton().css("top", targetY-28+"px");
		}
	});
	$("#gasIconLogic").on("touchmove", function(ev) {
		$scope.getGasButton().stop();
		targetY = ev.targetTouches.item(0).pageY;
		if (targetY <= $scope.maxUp) {
			$scope.getGasButton().css("top", ($scope.maxUp-28)+"px");
		} else if (targetY >= $scope.maxDown) {
			$scope.getGasButton().css("top", ($scope.maxDown-28)+"px");
		} else {
			$scope.getGasButton().css("top", targetY-28+"px");
		}
	});
	$("#gasIconLogic").on("touchend", function(ev) {
		if (ev.targetTouches.length == 0) {
			$scope.getGasButton().animate({top: gasDefY+"px"}, 300, "swing");
		} else {
			$scope.getGasButton().stop();
			targetY = ev.targetTouches.item(0).pageY;
			if (targetY <= $scope.maxUp) {
				$scope.getGasButton().css("top", ($scope.maxUp-28)+"px");
			} else if (targetY >= $scope.maxDown) {
				$scope.getGasButton().css("top", ($scope.maxDown-28)+"px");
			} else {
				$scope.getGasButton().css("top", targetY-28+"px");
			}
		}
	});
	
	$("#steerIconLogic").on("touchstart", function(ev) {
		$scope.getSteerButton().stop();
		targetX = ev.targetTouches.item(0).pageX
		if (targetX <= $scope.maxLeft) {
			$scope.getSteerButton().css("left", ($scope.maxLeft-28)+"px");
		} else if (targetX >= $scope.maxRight) {
			$scope.getSteerButton().css("left", ($scope.maxRight-28)+"px");
		} else {
			$scope.getSteerButton().css("left", targetX-28+"px");
		}
	});
	$("#steerIconLogic").on("touchmove", function(ev) {
		$scope.getSteerButton().stop();
		targetX = ev.targetTouches.item(0).pageX
		if (targetX >= $scope.maxRight) {
			$scope.getSteerButton().css("left", ($scope.maxRight-28)+"px");
		} else if (targetX <= $scope.maxLeft) {
			$scope.getSteerButton().css("left", ($scope.maxLeft-28)+"px");
		} else {
			$scope.getSteerButton().css("left", targetX-28+"px");
		}
	});
	$("#steerIconLogic").on("touchend", function(ev) {
		if (ev.targetTouches.length == 0) {
			$scope.getSteerButton().animate({left: steerDefX+"px"}, 300, "swing");
		} else {
			$scope.getSteerButton().stop();
			targetX = ev.targetTouches.item(0).pageX
			if (targetX <= $scope.maxLeft) {
				$scope.getSteerButton().css("left", ($scope.maxLeft-28)+"px");
			} else if (targetX >= $scope.maxRight) {
				$scope.getSteerButton().css("left", ($scope.maxRight-28)+"px");
			} else {
				$scope.getSteerButton().css("left", targetX-28+"px");
			}
		}
	});
	
	$("#settingsButton").on("touchend", function(ev) {
		if (ev.originalEvent.target.id == "settingsButton" || ev.originalEvent.target.id == "settingsIcon") {
			$timeout(function() {
				$scope.setControlsScreenActive(false);
				$scope.setSettingsScreenActive(true);
				$scope.stopRecurring = true;
			}, 200)
		}
	})
	$("#gearUpButton").on("touchend", function(ev) {
		if ((ev.originalEvent.target.id == "gearUpButton" || ev.originalEvent.target.id == "gearUpIcon") && !$scope.gearDisable) {
			var currentGear = $scope.getGear();
			if (currentGear + 1 <=3 ) {
				$scope.gearDisable = true;
				$scope.gear = currentGear+1;
			}
		}
	})
	$("#gearDownButton").on("touchend", function(ev) {
		if ((ev.originalEvent.target.id == "gearDownButton" || ev.originalEvent.target.id == "gearDownIcon") && !$scope.gearDisable) {
			var currentGear = $scope.getGear();
			if (currentGear - 1 >= 1) {
				$scope.gearDisable  = true;
				$scope.gear = currentGear-1;
			}
		}
	})
	
//	$scope.changeGear = function(ev, direction) {
//		var currentGear = $scope.getGear();
//		if (direction == 1) { //se sale di marcia
//			if (currentGear + 1 <=3 ) {
//				$scope.setGearDisable(true);
//				$scope.setGear(currentGear+1);
//			}
//		} else { //se scende di marcia
//			if (currentGear - 1 >= 1) {
//				$scope.setGearDisable(true);
//				$scope.setGear(currentGear-1);
//			}
//		}
//	}
	
}