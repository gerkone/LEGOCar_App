app.controller("settingsScreenController", settingsScreenController);

function settingsScreenController($scope, $timeout, $mdDialog, localStorageService) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.locked = function(i) {
		var patt = new RegExp("WPA|WPS|WPA2");
		return patt.test($scope.availableNetworks[i].capabilities);
	}
	
	$scope.availableNetworks = [];
	
	$scope.compileNetworkList = function() {
		$timeout(function() {
			WifiWizard.getScanResults({numLevels: 101}, function(scannedNetworks) {
				$timeout(function() {
					if (scannedNetworks.length == 0) {
						$scope.showSimpleToast("Non riesco a trovare reti wifi");
					} else {
						$scope.availableNetworks = scannedNetworks;
					}
					$scope.setLoading(false);
				}, 100)
			}, function() {
				$timeout(function() {
					$scope.showSimpleToast("Non riesco ad ottenere i risultati dello scan");
				}, 100)
			});
		}, 7500);
	}
	
	$scope.startScan = function(event) {
		WifiWizard.startScan(function() {
			$scope.permissions.checkPermission($scope.requiredPerms[1], function() {
				$timeout(function() {
					$scope.setLoading(true);
					$scope.showSimpleToast("Scansione iniziata...");
					$scope.compileNetworkList();
				}, 350);
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
		$mdDialog.show({
			templateUrl : 'connectToNetworkDialog/connectToNetworkDialog.html',
			fullscreen : true,
		    parent: angular.element(document.body),
		    locals : {network: $scope.availableNetworks[index]},
		    controller: "connectToNetworkController"
		})
	}
	
}