app.service('arduinoService', arduinoService);

function arduinoService($http, $q, $mdToast) {
	
	this.check = function(carIp) {
		return $http({
			method: 'GET',
			url: 'http://'+carIp+':80/check'
		});
	}
	
}