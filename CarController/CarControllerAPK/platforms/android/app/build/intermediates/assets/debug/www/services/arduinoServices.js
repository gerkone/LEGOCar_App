app.service("arduinoService", ArduinoService);

function ArduinoService($q, $http) {
	
	this.drive = function(ip, port, gas, steer, gear) {
		steer = 50*steer + 50;
		return $http({
		    url: "http://"+ip+":"+port+"/drive", 
		    method: "GET",
		    params: {
		    	t: gas,
		    	s: steer,
		    	g: gear
		    }
		 });
	}
	
	this.save = function(ip, port, settings) {
		
		return $http({
		    url: "http://"+ip+":"+port+"/setupCar", 
		    method: "GET",
		    params: {
		    	gsu: settings.gearSpeed.up,
		    	gsd: settings.gearSpeed.down,
		    	sc: settings.steerCorrector
		    }
		 });
	}
	
	this.check = function(ip, port) {
		if (port != "none") {
			return $http({
			    url: "http://"+ip+":"+port+"/check", 
			    method: "GET"
			 });
		} else {
			return $http({
			    url: "http://"+ip+"/", 
			    method: "GET"
			 });
		}
	}
	
}