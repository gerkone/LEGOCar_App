app.controller("settingsController", SettingsController);

function SettingsController($scope, $mdToast, arduinoService) {
	
	$scope.isLoading = false;
	$scope.prov = {
			provIP: $scope.carIP,
			provPort: $scope.carPort
	}
	$scope.settings = {
			gearSpeed: {up: 360, down: 120},
			steerCorrector: 100
	}
	
	$scope.stopSender();
	
	$scope.closeOptions = function() {
		$scope.setDriving(true);
	}
	
	$scope.save = function() {
		arduinoService.save($scope.carIP, $scope.carPort, $scope.settings).then(function(response) {
			if (response.data == "Done") {
				$mdToast.show(
					$mdToast.simple()
					.textContent('Salvataggio eseguito!')
					.position("top right")
					.hideDelay(2500)
				);
			}
		}, function(error) {
			$mdToast.show(
				$mdToast.simple()
				.textContent('Salvataggio fallito, prova a riconnetterti!')
				.position("top right")
				.hideDelay(2500)
			);
		})
	}
	$scope.disconnect = function() {
		$scope.setConnected(false);
		$scope.setCarIP("");
		$scope.setCarPort("");
	}
	$scope.connect = function() {
		$scope.isLoading = true;
		if ($scope.prov.provIP == "" || $scope.prov.provPort == "") {
			$mdToast.show(
				$mdToast.simple()
				.textContent('Non hai compilato tutti i campi!')
				.position("top right")
				.hideDelay(2500)
			);
			$scope.isLoading = false;
		} else {
			arduinoService.check($scope.prov.provIP, $scope.prov.provPort).then(function(response) {
				$scope.isLoading = false;
				if (response.data == "Checked") {
					$mdToast.show(
							$mdToast.simple()
							.textContent('Connesso!')
							.position("top right")
							.hideDelay(2500)
						);
					$scope.setConnected(true);
					$scope.setCarIP($scope.prov.provIP);
					$scope.setCarPort($scope.prov.provPort);
				}
			}, function(error) {
				$scope.isLoading = false;
				$mdToast.show(
						$mdToast.simple()
						.textContent('La macchina non è su questo indirizzo!')
						.position("top right")
						.hideDelay(2500)
					);
			})
		}
	}
	
}