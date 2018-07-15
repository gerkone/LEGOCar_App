app.service('arduinoService', arduinoService);

function arduinoService($http) {
	
	this.check = function() {
		return $http({
			method: 'GET',
			url: 'http://localhost:80/check'
		});
	}
	
}