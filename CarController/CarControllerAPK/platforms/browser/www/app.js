var app = angular.module("LegoCarApp", ["ngMaterial","ngMessages","ngAnimate","ngSanitize","ngAria","LocalStorageModule", "hmTouchEvents"]);

app.config(function(localStorageServiceProvider){
	
	localStorageServiceProvider.setPrefix('LegoCarApp');
	localStorageServiceProvider.setDefaultToCookie(false);
		
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

xApp.initialize();
