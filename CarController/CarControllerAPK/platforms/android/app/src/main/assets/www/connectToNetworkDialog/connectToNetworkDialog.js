app.controller("connectToNetworkController", connectToNetworkController);

function connectToNetworkController($scope, $mdDialog, $timeout, $mdToast, wifiUtils, arduinoService, localStorageService, network) {
	
	$scope.network = network;
	$scope.showPassword = false;
	$scope.network.PWD = "";
	$scope.loading = false;
	$scope.setAsFavorite = false;
	$scope.protectionSystem = network.capabilities;
	
	$scope.iterations = 0;
	$scope.checkIfConnected = function(ip) {
		wifiUtils.getCurrentSSID().then(function(SSID) {
			if (SSID == $scope.network.SSID) {
				wifiUtils.checkArduino(ip, false).then(function(IP) { //set to false per uscire dalla modalità test
					if ($scope.setAsFavorite) {
						localStorageService.set("defaultWiFiKeys", $scope.network);
					}
					$scope.loading = false;
					$mdDialog.hide(IP);
				}, function(exist) {
					if (exist) {
						$mdToast.show(
							$mdToast.simple()
								.textContent("Risposta del server non corretta")
								.position("top right")
								.hideDelay(3000)
						);
						wifiUtils.disconnect($scope.network.SSID);
						$scope.loading = false;
						$mdDialog.hide(false);
					} else {
						$mdToast.show(
							$mdToast.simple()
								.textContent("Il server non risponde")
								.position("top right")
								.hideDelay(3000)
						);
						wifiUtils.disconnect($scope.network.SSID);
						$scope.loading = false;
						$mdDialog.hide(false);
					}
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
					$mdToast.show(
						$mdToast.simple()
							.textContent("Non riesco a connettermi al wifi")
							.position("top right")
							.hideDelay(3000)
					);
					wifiUtils.disconnect($scope.network.SSID);
					$scope.loading = false;
				}
			})
		}, 100)
	}
	
	$scope.tryToConnect = function(event) {
		$scope.loading = true;
		wifiUtils.connectToNetwork($scope.network.SSID, $scope.network.PWD).then(function() {
			$scope.waitForConnection();
		}, function(reason) {
			$scope.loading = false;
		});
	}
	
	$scope.cancel = function(event) {
		$mdDialog.cancel();
	}
	
}