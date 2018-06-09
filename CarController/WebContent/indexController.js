app.controller("indexController", IndexController);

function IndexController($scope, $interval, arduinoService) {
	
	$scope.isDriving = true; //impostare su false per mostrare le impostazioni
	$scope.setDriving = function(set) {
		$scope.isDriving = set;
	}
	
	$scope.isConnected = false;
	$scope.setConnected = function(set) {
		$scope.isConnected = set;
	}
	$scope.carIP = "";
	$scope.carPort = "";
	$scope.setCarIP = function(set) {
		$scope.carIP = set;
	}
	$scope.setCarPort = function(set) {
		$scope.carPort = set;
	}
	$scope.sender;
	$scope.stopSender = function() {
		$interval.cancel($scope.sender)
	}
	$scope.startSender = function() {
		$scope.sender = $interval($scope.sendToCar, 10000);
	}
	
	$scope.gas = 0;
	$scope.steer = 0;
	$scope.gear = 1;
	$scope.speed = 0;
	$scope.setSpeed = function(set) {
		$scope.speed = set;
	}
	
	$scope.Ox;
	$scope.setOx = function(set) {
		$scope.Ox = set;
	}
	$scope.getOx = function() {
		return $scope.Ox;
	}
	$scope.Oy;
	$scope.setOy = function(set) {
		$scope.Oy = set;
	}
	$scope.getOy = function() {
		return $scope.Oy;
	}
	
	$scope.doGear = function(event, gear) {
		
		if (gear == "up") {
			if ($scope.gear + 1 <= 3) {
				$scope.gear++;
			}
		} else if (gear == "down") {
			if ($scope.gear - 1 >= 1) {
				$scope.gear--;
			}
		}
		
	}
	
	$scope.sendToCar = function() {
		if ($scope.isDriving && $scope.isConnected && $scope.carIP != "" && $scope.carPort != "") {
			var Pgas = $("#gasButton").position().top;
			var Psteer = $("#steerButton").position().left;
			//calcolo distanza dall'origine
			var distGas = $scope.Oy - Pgas;
			var distSteer = Psteer - $scope.Ox;
			
			if (isNaN(distGas)) {
				distGas = 0;
				$scope.gas = 0;
			}
			if (isNaN(distSteer)) {
				distSteer = 0;
				$scope.steer = 0;
			}
			//Assegnazione valore di gas
			var maxGas = $scope.Oy-40;
			if (isNaN($scope.Oy)) {
				$scope.gas = 0;
			} else {
				if (distGas > maxGas) {
					$scope.gas = 1;
				} else if (distGas < 0) {
					$scope.gas = 0;
				} else {
					$scope.gas = distGas/maxGas
				}
			}
			$scope.gas = Number($scope.gas.toFixed(3));
			//Assegnazione valore di sterzo
			var maxSteer = ($("#steerContainer").outerWidth()-80)/2;
			if (distSteer < -maxSteer) {
				$scope.steer = -1;
			} else if (distSteer > maxSteer) {
				$scope.steer = 1;
			} else {
				$scope.steer = distSteer/maxSteer;
			}
			$scope.steer = Number($scope.steer.toFixed(3));
			
			//Richiesta alla macchina
			arduinoService.drive($scope.carIP, $scope.carPort, $scope.gas*1000, $scope.steer, $scope.gear)
				.then(function(response) {
					$scope.setSpeed(response.data.speed);
				}, function(error) {
					$scope.isConnected = false;
					$scope.carIp = "";
					$scope.carPort = "";
				});
		}
	}
}