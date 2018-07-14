app.controller("settingsScreenController", settingsScreenController);

function settingsScreenController($scope, $timeout, localStorageService) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.availableNetworks = [];
	
	$scope.startScan = function() {
		console.log("starting!");
	}
	
}