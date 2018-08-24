app.controller("indexController", IndexController);

function IndexController($scope, $timeout, $mdToast, localStorageService, arduinoService) {
	
	$scope.permissions = cordova.plugins.permissions;
	$scope.requiredPerms = [
		$scope.permissions.ACCESS_COARSE_LOCATION,
		$scope.permissions.ACCESS_FINE_LOCATION,
		$scope.permissions.ACCESS_WIFI_STATE,
		$scope.permissions.CHANGE_WIFI_STATE
	];
	
	$scope.defaultKeys = localStorageService.get("defaultWiFiKeys");
	
	$scope.permissions.requestPermission($scope.requiredPerms[0], function() {
		$timeout(function() {
			$scope.permissions.requestPermission($scope.requiredPerms[1], function() {
				$timeout(function() {
					$scope.permissions.requestPermission($scope.requiredPerms[2], function() {
						$timeout(function() {
							$scope.permissions.requestPermission($scope.requiredPerms[3], function() {}, function() {});
						})
					}, function() {});
				})
			}, function() {});
		})
	}, function() {});
	
	window.screen.orientation.lock("portrait");
	
	$scope.showSimpleToast = function(msg) {
		$mdToast.show(
			$mdToast.simple()
				.textContent(msg)
			    .position("top right")
			    .hideDelay(3000)
		);
	}
	
	//VARIABILI PER IL CONTROLLER
	$scope.gasButton;
	$scope.steerButton;
	$scope.getGasButton = function() {return $scope.gasButton}
	$scope.getSteerButton = function() {return $scope.steerButton}
	$scope.setGasButton = function(set) {$scope.gasButton = set}
	$scope.setSteerButton = function(set) {$scope.steerButton = set}
	$scope.gear = 1;
	$scope.gearDisable = false;
	$scope.setGearDisable = function(set) {$scope.gearDisable = set}
	$scope.getGear = function() {return $scope.gear}
	$scope.setGear = function(set) {$scope.gear = set}
	
	$scope.maxLeft = window.innerWidth*0.6+28;
	$scope.maxRight = window.innerWidth-28;
	$scope.maxUp = 28;
	$scope.maxDown = window.innerHeight*0.8;
	$scope.setMax = function(l, r, u, d) {$scope.maxLeft = l; $scope.maxRight = r; $scope.maxUp = u; $scope.maxDown = d;}
	//FINE VARIABILI PER IL CONTROLLO
	
	//LOOP PER IL COMANDO AD ARDUINO
	$scope.stopRecurring = false;
	$scope.sendData = function() {
		
		//calcola drive, gear e steer
		
		var drive = 586;
		var steer = 67;
		var gear = $scope.gear;
		
		arduinoService.drive($scope.carIp, drive, steer, gear).then(function(response) {
			if (response.status == 200) {
				if ($scope.gearDisable) {
					$scope.gearDisable = false;
				}
				//ricorsione condizionale
				if (!$scope.stopRecurring) {
					$scope.sendData();
				}
			} else if (response.status == 201) {
				//ricorsione condizionale
				if (!$scope.stopRecurring) {
					$scope.sendData();
				}
			} else if (response.status == 202) {
				if ($scope.gearDisable) {
					$scope.gearDisable = false;
				}
				$scope.gear--;
				//ricorsione condizionale
				if (!$scope.stopRecurring) {
					$scope.sendData();
				}
			} else {
				//ricorsione condizionale
				if (!$scope.stopRecurring) {
					$scope.sendData();
				}
			}
		}, function(response) {
			if (response.status == 500) {
				//ricorsione condizionale
				if (!$scope.stopRecurring) {
					$scope.sendData();
				}
			} else {
				$scope.connected = false;
				$scope.controlsScreenActive = true;
				$scope.settingsScreenActive = false;
			}
		})
		
	}
	//FINE LOOP PER IL COMANDO AD ARDUINO
	
	$scope.carIp = "";
	$scope.getCarIp = function() { return $scope.carIp }
	$scope.setCarIp = function(set) { $scope.carIp = set }
	
	$scope.startScreenActive = true;
	$scope.getStartScreenActive = function() { return $scope.startScreenActive }
	$scope.setStartScreenActive = function(set) { $scope.startScreenActive = set}

	$scope.settingsScreenActive = false;
	$scope.getSettingsScreenActive = function() { return $scope.settingsScreenActive }
	$scope.setSettingsScreenActive = function(set) { $scope.settingsScreenActive = set }
	
	$scope.controlsScreenActive = false;
	$scope.getControlsScreenActive = function() { return $scope.controlsScreenActive }
	$scope.setControlsScreenActive = function(set) { $scope.controlsScreenActive = set }
	
	$scope.connected = false;
	$scope.getConnected = function() { return $scope.connected }
	$scope.setConnected = function(set) { $scope.connected = set }
	
}