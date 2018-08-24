package org.apache.cordova.android;

import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.util.Collections;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.DhcpInfo;
import android.net.wifi.WifiManager;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Settings;

import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import android.net.TrafficStats;

public class DHCP extends CordovaPlugin {

    public DHCP() {

    }

    public boolean execute(String action, JSONArray args,
            CallbackContext callbackContext) {
        JSONObject r = new JSONObject();
        try {

            if (action.equals("getDHCP")) {
                JSONObject ip = getRouterIPAddress();
                callbackContext.success(ip);
                return true;
            } 
            else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        callbackContext.success(r);
        return true;
    }

    private String formatIP(int ip) {
        return String.format("%d.%d.%d.%d", (ip & 0xff), (ip >> 8 & 0xff),
                (ip >> 16 & 0xff), (ip >> 24 & 0xff));
    }

    private JSONObject getRouterIPAddress() {
        WifiManager wifiManager = (WifiManager) cordova.getActivity()
                .getSystemService(Context.WIFI_SERVICE);
        DhcpInfo dhcp = wifiManager.getDhcpInfo();
        JSONObject dhcpData = new JSONObject();
        try {
            dhcpData.put("gateway", formatIP(dhcp.gateway));
            dhcpData.put("ipaddr", formatIP(dhcp.ipAddress));
            dhcpData.put("netmask", formatIP(dhcp.netmask));
            dhcpData.put("dns1", formatIP(dhcp.dns1));
            dhcpData.put("dns2", formatIP(dhcp.dns2));
            dhcpData.put("Ipv6", ipv6Address(false));

        } catch (Exception e) {
            e.printStackTrace();
        }
        return dhcpData;
    }

    private JSONArray ipv6Address(Boolean useIPv4) {
        String val = "";
        JSONObject r = new JSONObject();
        JSONArray recordArray = new JSONArray();
        try {
            List<NetworkInterface> interfaces = Collections
                    .list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf
                        .getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        JSONObject obj = new JSONObject();
                        String sAddr = addr.getHostAddress();
                        boolean isIPv4 = sAddr.indexOf(':') < 0;
                        if (isIPv4) {
                            obj.put("addr", sAddr);
                            obj.put("networkName", addr.getHostName());
                            recordArray.put(obj);
                            val = val + ';' + sAddr;
                        }
                        if (!isIPv4) {
                            int delim = sAddr.indexOf('%');
                            val = val
                                    + ';'
                                    + (delim < 0 ? sAddr.toUpperCase() : sAddr
                                            .substring(0, delim).toUpperCase());// drop
                            obj.put("addr", (delim < 0 ? sAddr.toUpperCase()
                                    : sAddr.substring(0, delim).toUpperCase()));
                            recordArray.put(obj);
                        }

                    }
                }

            }
            r.put("result", recordArray);

        } catch (Exception ex) {
        } // for now eat exceptions
        return recordArray;

    }

}