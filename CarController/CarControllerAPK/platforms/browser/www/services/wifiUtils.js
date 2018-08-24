app.service('wifiUtils', wifiUtils);

function wifiUtils($q, $mdToast, $timeout, arduinoService) {
	
	this.checkArduino = function(ip, test) {
		return $q(function(resolve, reject) {
			if (!test) {
				arduinoService.check(ip).then(function(response) {
					if (response.data == "Checked") {
						resolve(ip);
					} else {
						reject(true);
					}
				}, function(reason) {
					reject(false);
				})
			} else {
				resolve(ip);
			}
		})
	}
	
	this.getCurrentSSID = function() {
		return $q(function(resolve, reject) {
			WifiWizard.getCurrentSSID(function(SSID) {
				$timeout(function() {
					SSID = SSID.substring(1, SSID.length-1);
					resolve(SSID)
				}, 10, false, SSID)
			}, function() {
				$timeout(function() {
					reject();
				}, 10)
			})
		})
	}
	
	this.getIpAddress = function() {
		return $q(function(resolve, reject) {
			wifi.getInfo(function(address) {
				var ip = address.ip;
				$timeout(function() {
					if (typeof ip == 'undefined') {
						reject("NOT IP");
					} else {
						resolve(ip);
					}
				}, 10, false, ip);
			}, function(address) {
				$timeout(function() {
					reject("NOT IP");
				}, 10, false, address)
			})
		})
	}
	
	this.disconnect = function(SSID) {
		return $q(function(resolve, reject) {
			WifiWizard.disconnectNetwork(SSID, function() {
				resolve();
			}, function() {
				concole.log("errore durante la disconnessione");
				reject();
			})
		})
	}
	
	this.connectToNetwork = function(SSID, PWD) {
		return $q(function(resolve, reject) {
			/*--------*/
			WifiWizard.addNetwork(WifiWizard.formatWPAConfig(SSID, PWD), function() {
				/*--------*/
				$timeout(function() {
					WifiWizard.connectNetwork(SSID, function() {
						/*--------*/
						$timeout(function() {
							resolve();
							$mdToast.show(
									$mdToast.simple()
										.textContent("Mi sto connettendo...")
									    .position("top right")
									    .hideDelay(3000)
							);
						})
						/*--------*/
					}, function() {
						/*--------*/
						$timeout(function() {
							reject("connection");
							$mdToast.show(
									$mdToast.simple()
										.textContent("Errore nella connessione!")
									    .position("top right")
									    .hideDelay(3000)
							);
						}, 10, false)
						/*--------*/
					});
				}, 10)
				/*--------*/
			}, function() {
				/*--------*/
				$timeout(function() {
					reject("addition");
					$mdToast.show(
							$mdToast.simple()
								.textContent("Non riesco ad aggiungere la rete!")
							    .position("top right")
							    .hideDelay(3000)
					);
				}, 10, false)
				/*--------*/
			})
			/*--------*/
		})
	}
	
}