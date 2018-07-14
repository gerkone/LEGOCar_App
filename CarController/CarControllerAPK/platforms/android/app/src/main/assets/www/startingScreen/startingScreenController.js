app.controller("startingScreenController", startingScreenController);

function startingScreenController($scope, $timeout) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.begin = function begin(event) {
		$scope.setLoading(true);
		$timeout(function() {
			$scope.setLoading(false);
			window.screen.orientation.lock("landscape");
			$scope.setStartScreenActive(false);
		}, 1125);
	}
	
}