app.controller("startingScreenController", startingScreenController);

function startingScreenController($scope, $timeout, $interval, localStorageService, arduinoService, wifiUtils) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.iterations = 0;
	
	$scope.checkIfConnected = function(ip) {
		wifiUtils.getCurrentSSID().then(function(SSID) {
			if (SSID == $scope.defaultKeys.SSID) {
				wifiUtils.checkArduino(ip, true).then(function(IP) { //set to false per uscire dalla modalità test
					window.screen.orientation.unlock();
					window.screen.orientation.lock("landscape");
					$scope.setStartScreenActive(false);
					$scope.setSettingsScreenActive(false);
					$scope.setConnected(true);
					$scope.setControlsScreenActive(true);
					$scope.setLoading(false);
					$scope.showSimpleToast("Sei connesso ad arduino");
				}, function(exist) {
					window.screen.orientation.unlock();
					window.screen.orientation.lock("landscape");
					$scope.setStartScreenActive(false);
					$scope.setSettingsScreenActive(true);
					$scope.setConnected(false);
					$scope.setControlsScreenActive(false);
					$scope.setLoading(false);
					$scope.showSimpleToast("Non riesco a connettermi! Scegli la rete manualmente");
					wifiUtils.disconnect($scope.network.SSID);
				})
			} else {
				$scope.iterations++;
				$scope.waitForConnection();
			}
		}, function() {
			$scope.iterations++;
			$scope.waitForConnection();
		})
	}
	
	$scope.waitForConnection = function() {
		$timeout(function() {
			wifiUtils.getIpAddress().then(function(ip) {
				$scope.checkIfConnected(ip);
			}, function(error) {
				if ($scope.iterations <= 100) {
					$scope.iterations++;
					$scope.waitForConnection();
				} else {
					window.screen.orientation.unlock();
					window.screen.orientation.lock("landscape");
					$scope.setStartScreenActive(false);
					$scope.setSettingsScreenActive(true);
					$scope.setConnected(false);
					$scope.setControlsScreenActive(false);
					$scope.setLoading(false);
					$scope.showSimpleToast("Non riesco a connettermi! Scegli la rete manualmente");
					wifiUtils.disconnect($scope.network.SSID);
				}
			})
		}, 100)
	}
	
	$scope.begin = function(event) {
		$scope.setLoading(true);
		if ($scope.defaultKeys == null) {
			$timeout(function() {
				window.screen.orientation.unlock();
				window.screen.orientation.lock("landscape");
				$scope.setStartScreenActive(false);
				$scope.setSettingsScreenActive(true);
				$scope.setConnected(false);
				$scope.setControlsScreenActive(false);
				$scope.setLoading(false);
				$scope.showSimpleToast("Configurazioni di default non trovate!");
			}, 3219)
		} else {
			wifiUtils.connectToNetwork($scope.defaultKeys.SSID, $scope.defaultKeys.PWD).then(function() {
				$scope.waitForConnection();
			}, function(reason) {
				window.screen.orientation.unlock();
				window.screen.orientation.lock("landscape");
				$scope.setStartScreenActive(false);
				$scope.setConnected(false);
				$scope.setSettingsScreenActive(true);
				$scope.setControlsScreenActive(false);
				$scope.setLoading(false);
				$scope.showSimpleToast("Connessione fallita! Scegli la rete manualmente");
			});
		}
	}
}