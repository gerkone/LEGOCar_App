app.controller("indexController", IndexController);

function IndexController($scope) {
	
	$scope.startScreenActive = true;
	$scope.getStartScreenActive = function() { return $scope.startScreenActive }
	$scope.setStartScreenActive = function(set) { $scope.startScreenActive = set}
	
}