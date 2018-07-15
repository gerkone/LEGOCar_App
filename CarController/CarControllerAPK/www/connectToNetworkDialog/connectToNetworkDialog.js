app.controller("connectToNetworkController", connectToNetworkController);

function connectToNetworkController($scope, $mdDialog, $timeout, $mdToast, arduinoService, network) {
	
	$scope.network = network;
	$scope.showPassword = false;
	$scope.network.PWD = "";
	$scope.loading = false;
	$scope.setAsFavorite = false;
	$scope.tries = 0;
	
	$scope.waitForConnection = function() {
		WifiWizard.getCurrentSSID(function(SSID) {
			//se ottiene l'ssid
			$timeout(function() {
				if (SSID != '\"'+$scope.network.SSID+'\"' && $scope.tries <= 150) {
					//se non si è ancora connesso
					$scope.tries++;
					$scope.waitForConnection();
				} else if (SSID != '\"'+$scope.network.SSID+'\"' && $scope.tries > 150) {
					//se scade il tempo per la connessione
					$scope.loading = false;
					$scope.showSimpleToast("Non riesco a connettermi! Scegli la rete manualmente");
				} else {
					//se va tutto bene
					arduinoService.check().then(function(response) {
						if (response.data == "OK") {
							$scope.loading = false;
							$mdDialog.hide(true);
							$mdToast.show(
								$mdToast.simple()
									.textContent("Connesso!")
								    .position("top right")
								    .hideDelay(3000)
							);
						} else {
							$scope.loading = false;
							$mdDialog.hide(false);
							$mdToast.show(
								$mdToast.simple()
									.textContent("Arduino non è su questa rete wifi!")
								    .position("top right")
								    .hideDelay(3000)
							);
						}
					}, function(response) {
						$scope.loading = false;
						$mdDialog.hide(false);
						$mdToast.show(
							$mdToast.simple()
								.textContent("Arduino non è su questa rete wifi o c'è stato un'errore!")
							    .position("top right")
							    .hideDelay(3000)
						);
					})
				}
			}, 100, false, SSID);
		}, function(a) {
			//se non ottiene l'ssid
			$timeout(function() {
				$scope.loading = false;
				console.log(a);
				$scope.showSimpleToast("Non riesco ad ottenere l'SSID corrente");
			}, 100, false, a)
		});
	}
	
	$scope.tryToConnect = function(event) {
		$scope.loading = true;
		WifiWizard.addNetwork(WifiWizard.formatWPAConfig($scope.network.SSID, $scope.network.PWD), function() {
			//se aggiunge la rete
			$timeout(function() {
				WifiWizard.connectNetwork($scope.network.SSID, function(a) {
					//se si connette
					$timeout(function() {
						$scope.tries++;
						$scope.waitForConnection();
					}, 100);
				}, function(a) {
					//se non si connette
					$timeout(function() {
						console.log(a);
						$scope.loading = false;
						$mdToast.show(
								$mdToast.simple()
									.textContent("Errore nella connessione!")
								    .position("top right")
								    .hideDelay(3000)
						);
					}, 100, false, a)
				});
			}, 100)
		}, function(a) {
			//se non aggiunge la rete
			$timeout(function() {
				console.log(a);
				$scope.loading = false;
				$mdToast.show(
						$mdToast.simple()
							.textContent("Errore nell'aggiunta della rete!")
						    .position("top right")
						    .hideDelay(3000)
				);
			}, 100, false, a)
		});
	}
	
	$scope.cancel = function(event) {
		$mdDialog.cancel();
	}
	
}