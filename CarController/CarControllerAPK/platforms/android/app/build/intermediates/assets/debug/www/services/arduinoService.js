app.service('arduinoService', arduinoService);

function arduinoService($http, $mdToast) {
	
	this.check = function() {
		networkinterface.getWiFiIPAddress(function(address) {
			doRequest(address.ip);
		}, function() {
			return $q(function(resolve, reject) {
				reject("error");
			})
		})
		function doRequest(ip) {
			return $http({
				method: 'GET',
				url: 'http://'+ip+':80/check'
			});
		}
	}
	
}