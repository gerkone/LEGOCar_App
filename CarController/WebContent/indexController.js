app.controller("indexController", IndexController);

function IndexController($scope, $interval) {
	
	$scope.isDriving = true; //impostare su false per mostrare le impostazioni
	
	$scope.isConnected = true;
	$scope.carIP = "192.168.1.107";
	
	$scope.gas = 0;
	$scope.steer = 50;
	$scope.gear = 1;
	
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
	
	
	$scope.sendToCar = function() {
		if ($scope.isConnected && $scope.carIP != null) {
			var Pgas = $("#gasButton").position().top;
			var Psteer = $("#steerButton").position().left;
			
			//calcolo distanza dall'origine
			var distGas = $scope.Oy - Pgas;
			var distSteer = $scope.Ox - Psteer;
			
			$scope.gas = distGas;
			$scope.steer = distSteer;
		}
	}
	
	$interval($scope.sendToCar, 100);
}