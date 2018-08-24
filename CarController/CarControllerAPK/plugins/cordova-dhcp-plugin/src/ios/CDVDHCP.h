#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVInvokedUrlCommand.h>
#include <ifaddrs.h>
#include <arpa/inet.h>

@interface CDVDHCP : CDVPlugin

- (void) getDHCP:(CDVInvokedUrlCommand*)command;

@end
