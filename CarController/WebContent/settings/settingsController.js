app.controller("settingsController", SettingsController);

function SettingsController($scope, $mdToast, arduinoService) {
	
	$scope.isLoading = false;
	$scope.provIP = "localhost";
	$scope.provPort = "8080";
	$scope.stopSender();
	
	$scope.closeOptions = function() {
		$scope.setDriving(true);
	}
	
	$scope.connect = function() {
		$scope.isLoading = true;
		if ($scope.provIP == "" || $scope.provPort == "") {
			$mdToast.show(
				$mdToast.simple()
				.textContent('Non hai compilato tutti i campi!')
				.position("top right")
				.hideDelay(2500)
			);
			$scope.isLoading = false;
		} else {
			arduinoService.check($scope.provIP, $scope.provPort).then(function(response) {
				$scope.isLoading = false;
				if (response.data == "Checked") {
					$mdToast.show(
							$mdToast.simple()
							.textContent('Connesso!')
							.position("top right")
							.hideDelay(2500)
						);
					$scope.setConnected(true);
				}
			}, function(error) {
				$scope.isLoading = false;
				$mdToast.show(
						$mdToast.simple()
						.textContent('Connessione fallita a questo IP!')
						.position("top right")
						.hideDelay(2500)
					);
			})
		}
	}
	
}