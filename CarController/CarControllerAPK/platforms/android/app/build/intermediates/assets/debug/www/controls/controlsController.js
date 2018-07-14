app.controller("controlsController", ControlsController);

function ControlsController($scope, $timeout) {
	
	$scope.openSettings = function() {
		$scope.setDriving(false);
	}
	
	$scope.moveCallsLeft = 0;
	$scope.moveCallsRight = 0;
	$scope.onHammer = function (event, id, type, release) {
		
		if (release == null) {
			if (type=="gas") {
				if ($scope.moveCallsLeft == 0) {
					$scope.setOy($("#"+id).position().top);
					$scope.moveCallsLeft = $scope.getOy();
				} else {
					$scope.setOy($scope.moveCallsLeft);
				}
				var eh = $("#"+id).outerHeight();
				var Py = event.center.y - (eh/2);
				var Pdy = event.center.y;
				var destY = Py - $scope.getOy();
				//calcolo se la destinazione è nei limiti
				var PDY = event.center.y;
				var DCBS = 0;
				var DCBI = window.innerHeight;
				if (PDY >= DCBS && PDY <= DCBI) {
					angular.element("#"+id).css("top", destY+"px");
				}
			}
			if (type=="steer") {
				if ($scope.moveCallsRight == 0) {
					$scope.setOx($("#"+id).position().left);
					$scope.moveCallsRight = $scope.getOx();
				} else {
					$scope.setOx($scope.moveCallsRight);
				}
				var ew = $("#"+id).outerWidth();
				var Px = event.center.x - (ew/2);
				var destX = Px - $scope.getOx();
				//calcolo se la destinazione è nei limiti
				var PDX = event.center.x;
				var DCB = window.innerWidth;
				var DCC = window.innerWidth*0.6
				if (PDX <= DCB && PDX >= DCC) {
					angular.element("#"+id).css("left", destX+"px");
				}
			}
		} else if (release == true){
			
			$("#"+id).animate({ 
				top: "0px",
				left: "0px"
			},  300);
			
		}
	}
	
	$timeout($scope.sendToCar, 200);
	
	
}