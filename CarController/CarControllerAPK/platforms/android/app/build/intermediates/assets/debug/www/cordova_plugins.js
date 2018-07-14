cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.pylonproducts.wifiwizard.WifiWizard",
    "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
    "pluginId": "com.pylonproducts.wifiwizard",
    "clobbers": [
      "window.WifiWizard"
    ]
  },
  {
    "id": "es6-promise-plugin.Promise",
    "file": "plugins/es6-promise-plugin/www/promise.js",
    "pluginId": "es6-promise-plugin",
    "runs": true
  },
  {
    "id": "cordova-plugin-screen-orientation.screenorientation",
    "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
    "pluginId": "cordova-plugin-screen-orientation",
    "clobbers": [
      "cordova.plugins.screenorientation"
    ]
  },
  {
    "id": "cordova-plugin-fullscreen.AndroidFullScreen",
    "file": "plugins/cordova-plugin-fullscreen/www/AndroidFullScreen.js",
    "pluginId": "cordova-plugin-fullscreen",
    "clobbers": [
      "AndroidFullScreen"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "com.pylonproducts.wifiwizard": "0.2.11",
  "es6-promise-plugin": "4.2.2",
  "cordova-plugin-screen-orientation": "3.0.1",
  "cordova-plugin-fullscreen": "1.1.0"
};
// BOTTOM OF METADATA
});