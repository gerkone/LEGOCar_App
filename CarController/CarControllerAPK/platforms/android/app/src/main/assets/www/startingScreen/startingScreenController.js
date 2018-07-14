app.controller("startingScreenController", startingScreenController);

function startingScreenController($scope, $timeout) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.begin = function(event) {
		
		$scope.setLoading(true);
		WifiWizard.formatWPAConfig("JENIA-DL", "antepo71!fama");
		WifiWizard.connectNetwork("JENIA-DL", function() {
			$timeout(function() {
				window.screen.orientation.unlock();
				window.screen.orientation.lock("landscape");
				$scope.setStartScreenActive(false);
				$scope.setSettingsScreenActive(false);
				$scope.setControlsScreenActive(true);
			}, 100)
		}, function() {
			$timeout(function() {
				window.screen.orientation.unlock();
				window.screen.orientation.lock("landscape");
				$scope.setStartScreenActive(false);
				$scope.setSettingsScreenActive(true);
				$scope.setControlsScreenActive(false);
			}, 100)
		});
		$scope.setLoading(false);
	}
}