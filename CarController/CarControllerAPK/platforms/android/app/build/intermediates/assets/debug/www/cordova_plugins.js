cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "es6-promise-plugin.Promise",
    "file": "plugins/es6-promise-plugin/www/promise.js",
    "pluginId": "es6-promise-plugin",
    "runs": true
  },
  {
    "id": "wifiwizard2.WifiWizard2",
    "file": "plugins/wifiwizard2/www/WifiWizard2.js",
    "pluginId": "wifiwizard2",
    "clobbers": [
      "window.WifiWizard2"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "es6-promise-plugin": "4.1.0",
  "wifiwizard2": "3.0.0"
};
// BOTTOM OF METADATA
});