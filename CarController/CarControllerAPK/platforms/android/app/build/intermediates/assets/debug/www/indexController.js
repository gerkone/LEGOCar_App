app.controller("indexController", IndexController);

function IndexController($scope) {
	
	$scope.startScreenActive = true;
	$scope.getStartScreenActive = function() { return $scope.startScreenActive }
	$scope.setStartScreenActive = function(set) { $scope.startScreenActive = set}

	$scope.settingsScreenActive = false;
	$scope.getSettingsScreenActive = function() { return $scope.settingsScreenActive }
	$scope.setSettingsScreenActive = function(set) { $scope.settingsScreenActive = set }
	
	$scope.controlsScreenActive = false;
	$scope.getControlsScreenActive = function() { return $scope.controlsScreenActive }
	$scope.setControlsScreenActive = function(set) { $scope.controlsScreenActive = set }
	
}