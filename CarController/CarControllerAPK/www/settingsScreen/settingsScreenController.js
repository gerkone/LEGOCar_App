app.controller("settingsScreenController", settingsScreenController);

function settingsScreenController($scope, $timeout, localStorageService) {
	
	$scope.loading = false;
	$scope.getLoading = function() { return $scope.loading }
	$scope.setLoading = function(set) { $scope.loading = set }
	
	$scope.availableNetworks = [];
	
	$scope.startScan = function() {
		console.log("starting!");
	}
	
	$scope.openMenu = function($mdMenu, ev) {
	      originatorEv = ev;
	      $mdMenu.open(ev);
	    };
	    
	$scope.scanWiFi = function() {
		WifiWizard.getScanResults({numLevels: 5}, $scope.updateWiFiList(result), $scope.updateWiFiList(false));
	}    
	
	$scope.updateWiFiList = function(result) {
		if(()!result) || (result==null)) {
			//TODO show simple tost mostrando errore
		} else {
			for(i = 0; i < result.lenght; i++) {
				$scope.availableNetworks[i] = result[i];
			}
		}
	}
	
	$scope.showDefaults = function() {
		
	}
	
}