app.controller("settingsScreenController", settingsScreenController);

function settingsScreenController($scope, $timeout, $mdDialog, localStorageService) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.locked = function(i) {
		var patt = new RegExp("WPA|WPS|WPA2");
		return patt.test($scope.availableNetworks[i].capabilities);
	}
	
	$scope.stopRecurring = true;
	$scope.availableNetworks = [];
	$scope.iterations = 0;
	
	$scope.compileNetworkList = function() {
		WifiWizard.getScanResults({numLevels: 101}, function(scannedNetworks) {
			$timeout(function() {
				console.log(scannedNetworks);
				$scope.availableNetworks = scannedNetworks;
				$scope.iterations++;
				if ($scope.iterations <= 100 && $scope.iterations != -9) {
					$scope.compileNetworkList();
				} else if ($scope.iterations == -9) {
					$scope.iterations = 0;
				} else {
					$scope.showSimpleToast("Scansione terminata");
					$scope.iterations = 0;
				}
			}, 100, false, scannedNetworks)
		}, function() {
			$timeout(function() {
				$scope.showSimpleToast("Non riesco ad ottenere i risultati dello scan");
			}, 100)
		});
	}
	
	$scope.startScan = function(event) {
		WifiWizard.startScan(function() {
			$scope.permissions.checkPermission($scope.requiredPerms[1], function(a) {
				$timeout(function() {
					console.log(a);
					$scope.availableNetworks = [];
					$scope.showSimpleToast("Scansione iniziata...");
					$scope.compileNetworkList();
				}, 350, false, a);
			}, function() {
				$timeout(function() {
					$scope.showSimpleToast("Non hai tutti i permessi abilitati...");
					$scope.permissions.requestPermissions($scope.requiredPerms, function() {}, function() {});
				}, 100)
			})
		}, function() {
			$scope.showSimpleToast("Non riesco ad iniziare lo scan, controlla le impostazioni!");
		});
	}
	
	$scope.connect = function(event, index) {
		$scope.iterations = -10;
		$timeout(function() {
			$mdDialog.show({
				templateUrl : 'connectToNetworkDialog/connectToNetworkDialog.html',
				fullscreen : true,
			    parent: angular.element(document.body),
			    locals : {network: $scope.availableNetworks[index]},
			    controller: "connectToNetworkController"
			}).then(function(response) {
				if (response != false) {
					$scope.setCarIp(response);
					$scope.setStartScreenActive(false);
					$scope.setSettingsScreenActive(false);
					$scope.setConnected(true);
					$scope.setControlsScreenActive(true);
					$scope.setLoading(false);
					$scope.stopRecurring = false;
					$scope.showSimpleToast("Sei connesso ad arduino");
				}
			}, function() {})
		}, 100)
	}
	
}