app.controller("startingScreenController", startingScreenController);

function startingScreenController($scope, $timeout, localStorageService) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.defaultKeys = localStorageService.get("defaultWiFiKeys");
	
	$scope.begin = function(event) {
		$scope.setLoading(true);
		if (defaultKeys == null) {
			//non trovo le chiavi di default, mostro la schermata di impostazioni
			$timeout(function() {
				window.screen.orientation.unlock();
				window.screen.orientation.lock("landscape");
				$scope.setStartScreenActive(false);
				$scope.setSettingsScreenActive(true);
				$scope.setControlsScreenActive(false);
			}, 3219)
		} else {
			//trovo le chiavi di default, provo a connettermi automagicamente
			WifiWizard.formatWPAConfig($scope.defaultKeys.SSID, $scope.defaultKeys.PWD);
			WifiWizard.connectNetwork($scope.defaultKeys.SSID, function() {
				//se funziona mostra la pagina di guida
			}, function() {
				//se non funziona mostra la pagina si impostazioni
			});
		}
		$scope.setLoading(false);
	}
}