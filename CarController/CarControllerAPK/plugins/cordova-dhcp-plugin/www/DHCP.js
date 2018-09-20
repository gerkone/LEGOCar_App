
/**
 * Get DHCP info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */

var DHCPInfo=function() {
};
DHCPInfo.getDHCPInfo = function(success, fail) {
    cordova.exec(success, fail, "DHCPInfo", "getDHCP", []);
};

module.exports = DHCPInfo;


