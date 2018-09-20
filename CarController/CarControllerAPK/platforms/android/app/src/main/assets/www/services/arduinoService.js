app.service('arduinoService', arduinoService);

function arduinoService($http, $q, $mdToast) {
	
	this.check = function(carIp) {
		var address = "http://"+carIp+"/check";
		console.log(address);
		return $http({
				url: "http://"+carIp+":80/check", 
			    method: "GET"
		});
	}
	
	this.drive = function(carIp, drive, steer, gear) {
		return $http({
			url: 'http://'+carIp+':80/drive?d='+drive+'&s='+steer+'&g='+gear,
			method: 'GET'
		});
	}
	
}