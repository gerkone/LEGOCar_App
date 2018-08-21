var app = angular.module("LegoCarApp", ["ngMaterial","ngMessages","ngAnimate","ngSanitize","ngAria","LocalStorageModule", "hmTouchEvents"]);

app.config(function(localStorageServiceProvider, $mdThemingProvider){
	
	localStorageServiceProvider.setPrefix('LegoCarApp');
	localStorageServiceProvider.setDefaultToCookie(false);
	
	$mdThemingProvider.setDefaultTheme('default-dark');
	$mdThemingProvider.alwaysWatchTheme(true);
	
	$mdThemingProvider.theme('default')
	    .primaryPalette('deep-orange')
	    .accentPalette('red')
	    .warnPalette('blue')
	
	$mdThemingProvider.theme('default-dark')
	    .primaryPalette('deep-orange')
	    .accentPalette('red')
	    .warnPalette('indigo')
	    .dark();
});
//inizializzazione cordova
var xApp = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
    	
        var body = document.getElementById('LegoCarAppID');
        angular.bootstrap(body, ["LegoCarApp"]);
    }

};
