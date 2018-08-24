# cordova-dhcp-plugin

 Plugin retrives DHCP information for iOS and Android. It retrieves IPV6 information if applicable.




## Installation

> cordova plugin add cordova-dhcp-plugin

## Usage
```js
 function success(results) {
            console.log(JSON.stringify(results));
          };
  function err(e) {
            console.log(JSON.stringify(e));
          };
 
 DHCPInfo.getDHCPInfo(success,err);
 ```
 
 ## Response
 
 ```json
 {"gateway":"192.0.0.0",
 "ipaddr":"192.0.0.0",
 "netmask":"0.0.0.0",
 "dns1":"192.x.x.x",
 "dns2":"192.x.x.x",
 "Ipv6":[{"addr":"xxx0::xxxx:xxxx:xxxx:xxxx"},
         {"addr":"192.x.x.x",
         "networkName":"192.x.x.x"}
         ]
}
 ```
