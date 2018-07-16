app.controller("indexController", IndexController);

function IndexController($scope, $timeout, $mdToast) {
	
	$scope.permissions = cordova.plugins.permissions;
	$scope.requiredPerms = [
		$scope.permissions.ACCESS_COARSE_LOCATION,
		$scope.permissions.ACCESS_FINE_LOCATION,
		$scope.permissions.ACCESS_WIFI_STATE,
		$scope.permissions.CHANGE_WIFI_STATE
	];
	$scope.permissions.requestPermissions($scope.requiredPerms, function() {}, function() {});
	window.screen.orientation.lock("portrait");
	
	$scope.showSimpleToast = function(msg) {
		$mdToast.show(
			$mdToast.simple()
				.textContent(msg)
			    .position("top right")
			    .hideDelay(3000)
		);
	}
	
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