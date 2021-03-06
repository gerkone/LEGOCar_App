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
    "id": "cordova-plugin-android-permissions.Permissions",
    "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
    "pluginId": "cordova-plugin-android-permissions",
    "clobbers": [
      "cordova.plugins.permissions"
    ]
  },
  {
    "id": "cordova-plugin-networkinterface.networkinterface",
    "file": "plugins/cordova-plugin-networkinterface/www/networkinterface.js",
    "pluginId": "cordova-plugin-networkinterface",
    "clobbers": [
      "window.networkinterface"
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
    "id": "cordova-dhcp-plugin.DHCP",
    "file": "plugins/cordova-dhcp-plugin/www/DHCP.js",
    "pluginId": "cordova-dhcp-plugin",
    "clobbers": [
      "DHCPInfo"
    ]
  },
  {
    "id": "cordova-plugin-android-wifi-manager.WifiManager",
    "file": "plugins/cordova-plugin-android-wifi-manager/www/index.js",
    "pluginId": "cordova-plugin-android-wifi-manager",
    "clobbers": [
      "cordova.plugins.WifiManager"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com.pylonproducts.wifiwizard": "0.2.11",
  "cordova-plugin-android-permissions": "1.0.0",
  "cordova-plugin-networkinterface": "2.0.0",
  "es6-promise-plugin": "4.2.2",
  "cordova-plugin-screen-orientation": "3.0.1",
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-dhcp-plugin": "1.0.2",
  "cordova-plugin-android-wifi-manager": "1.0.0"
};
// BOTTOM OF METADATA
});