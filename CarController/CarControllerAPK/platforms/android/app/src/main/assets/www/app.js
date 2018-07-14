var app = angular.module("LegoCarApp", ["ngMaterial","ngMessages","ngAnimate","ngSanitize","ngAria","LocalStorageModule", "hmTouchEvents"]);

app.config(function(localStorageServiceProvider){
	
	localStorageServiceProvider.setPrefix('LegoCarApp');
	localStorageServiceProvider.setDefaultToCookie(false);
	
	
});