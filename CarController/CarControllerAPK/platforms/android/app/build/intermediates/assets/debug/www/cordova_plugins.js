cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.pylonproducts.wifiwizard.WifiWizard",
    "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
    "pluginId": "com.pylonproducts.wifiwizard",
    "clobbers": [
      "window.WifiWizard"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "com.pylonproducts.wifiwizard": "0.2.11"
};
// BOTTOM OF METADATA
});