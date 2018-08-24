#import "CDVDHCP.h"
#import <ifaddrs.h>
#import <arpa/inet.h>
#include <resolv.h>
#include <dns.h>


#include <stdio.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <sys/sysctl.h>
#if TARGET_OS_SIMULATOR
#import <net/route.h>
#else
#import "route.h"
#endif
#include <net/if.h>
#include <string.h>
//#import <arpa/inet.h>





#import <Foundation/Foundation.h>
@implementation CDVDHCP
NSMutableDictionary *result1 ;
NSMutableArray *arrayout ;

#define CTL_NET         4

#define ROUNDUP(a) \
((a) > 0 ? (1 + (((a) - 1) | (sizeof(long) - 1))) : sizeof(long))





- (int) getdefaultgateway: (in_addr_t *) addr
{
    int mib[] = {CTL_NET, PF_ROUTE, 0, AF_INET,
        NET_RT_FLAGS, RTF_GATEWAY};
    size_t l;
    char * buf, * p;
    struct rt_msghdr * rt;
    struct sockaddr * sa;
    struct sockaddr * sa_tab[RTAX_MAX];
    int i;
    int r = -1;
    if(sysctl(mib, sizeof(mib)/sizeof(int), 0, &l, 0, 0) < 0) {
        return -1;
    }
    if(l>0) {
        buf = malloc(l);
        if(sysctl(mib, sizeof(mib)/sizeof(int), buf, &l, 0, 0) < 0) {
            return -1;
        }
        for(p=buf; p<buf+l; p+=rt->rtm_msglen) {
            rt = (struct rt_msghdr *)p;
            sa = (struct sockaddr *)(rt + 1);
            for(i=0; i<RTAX_MAX; i++) {
                if(rt->rtm_addrs & (1 << i)) {
                    sa_tab[i] = sa;
                    sa = (struct sockaddr *)((char *)sa + ROUNDUP(sa->sa_len));
                } else {
                    sa_tab[i] = NULL;
                }
            }
            
            if( ((rt->rtm_addrs & (RTA_DST|RTA_GATEWAY)) == (RTA_DST|RTA_GATEWAY))
               && sa_tab[RTAX_DST]->sa_family == AF_INET
               && sa_tab[RTAX_GATEWAY]->sa_family == AF_INET) {
                
                
                if(((struct sockaddr_in *)sa_tab[RTAX_DST])->sin_addr.s_addr == 0) {
                    char ifName[128];
                    if_indextoname(rt->rtm_index,ifName);
                    
                    if(strcmp("en0",ifName)==0){
                        
                        *addr = ((struct sockaddr_in *)(sa_tab[RTAX_GATEWAY]))->sin_addr.s_addr;
                        r = 0;
                    }
                }
            }
        }
        free(buf);
    }
    return r;
}






- (void) getDHCP:(CDVInvokedUrlCommand*)command


{
  [self.commandDelegate runInBackground:^{
    result1 = [[NSMutableDictionary alloc] init];
    arrayout =[[NSMutableArray alloc]init];
    [self getIPAddress];
    //NSLog(@"%@", address);
    [self getDNSAddressesStr];
    //NSLog(@"%@", dnsa);
    
    
    struct in_addr gatewayaddr;
    int r = [self getdefaultgateway: &(gatewayaddr.s_addr)];
    if (r >= 0) {
        NSString *ipString = [NSString stringWithFormat: @"%s",inet_ntoa(gatewayaddr)];
        NSLog(@"default gateway : %@", ipString );
        [result1 setValue:ipString forKey:@"gateway"];
    }
    
    
    
    CDVPluginResult* pluginResult = nil;
    
    
    
    pluginResult =    [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result1];
    
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    
   }]; 
    
    
}

- (void)getIPAddress {
    
    NSString *address = @"error";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    if (success == 0) {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        while(temp_addr != NULL) {
            if(temp_addr->ifa_addr->sa_family == AF_INET) {
                // Check if interface is en0 which is the wifi connection on the iPhone
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"])
                {
                    // Get NSString from C String
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
                    NSString *mask = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_netmask)->sin_addr)];
                    NSLog(@"%s->IPv4:%@", temp_addr->ifa_name, address);
                    NSLog(@"%s->mask:%@", temp_addr->ifa_name, mask);
                    
                    [result1 setValue:address forKey:@"ipaddr"];
                    [result1 setValue:mask forKey:@"netmask"];
                    
                    
                }
            }
            else if(temp_addr->ifa_addr->sa_family == AF_INET6) {
                NSDictionary * dict;
                char str[INET6_ADDRSTRLEN];
                inet_ntop(AF_INET6, &(((struct sockaddr_in6 *)temp_addr->ifa_addr)->sin6_addr), str, INET6_ADDRSTRLEN);
                NSString *ipvaddr= [NSString stringWithFormat:@"%s", str];
                NSLog(@"%s->IPv6:%s", temp_addr->ifa_name, str);
                inet_ntop(AF_INET6, &(((struct sockaddr_in6 *)temp_addr->ifa_netmask)->sin6_addr), str, INET6_ADDRSTRLEN);
                NSLog(@"%s->6mask:%s", temp_addr->ifa_name, str);
                
                dict =@{@"addr":ipvaddr};
                [arrayout addObject:dict];
                
                
            }
            
            temp_addr = temp_addr->ifa_next;
        }
        
        [result1 setValue:arrayout forKey:@"Ipv6"];
    }
    
    // Free memory
    freeifaddrs(interfaces);
    //return result1;
    
}

- (void) getDNSAddressesStr
{
    NSMutableString *addressStr = [[NSMutableString alloc]initWithString:@"DNS Addresses \n"];
    
    
    
    
    
    res_state res = malloc(sizeof(struct __res_state));
    
    int result = res_ninit(res);
    
    
    if ( result == 0 )
    {
        int i = 0;
        for (i = 0; i < res->nscount; i++ )
        {
            NSString *s = [NSString stringWithUTF8String :  inet_ntoa(res->nsaddr_list[i].sin_addr)];
            [addressStr appendFormat:@"%@\n",s];
            NSString *dns= [NSString stringWithFormat:@"%@%d", @"dns", i+1];
            NSLog(@"%@",s);
            [result1 setValue:s forKey:dns];
            
        }
    }
    else
        [addressStr appendString:@" res_init result != 0"];
    
    
    //return result1;
    
    
    
}





@end
