app.controller("settingsScreenController", settingsScreenController);

function settingsScreenController($scope, $timeout, localStorageService) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.availableNetworks = [];
	
	$scope.compileNetworkList = function() {
		WifiWizard.getScanResults({numLevels: 5}, function(scannedNetworks) {
			$timeout(function() {
				console.log(scannedNetworks);
				$scope.compileNetworkList();
			}, 1000);
//			$timeout(function() {
//				if (scannedNetworks.length == 0) {
//					$scope.compileNetworkList();
//				} else {
//					if ($scope.availableNetworks.length == 0) {
//						$scope.availableNetworks = scannedNetworks;
//					} else {
//						//controllare se unici e inserire
//					}
//				}
//			}, 100)
		}, function() {
			$timeout(function() {
				$scope.showSimpleToast("Non riesco ad ottenere i risultati dello scan");
			}, 100)
		});
	}
	
	$scope.startScan = function(event) {
		WifiWizard.startScan(function() {
			$scope.permissions.checkPermission($scope.requiredPerms[1], function() {
				$timeout(function() {
					$scope.showSimpleToast("Scansione iniziata...");
					$scope.setLoading(true);
					$scope.compileNetworkList();
				}, 1000);
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
	
}