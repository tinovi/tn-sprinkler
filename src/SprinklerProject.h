#ifndef SprinklerProject_h
#define SprinklerProject_h

#include <AdminSettingsService.h>
#include <Triggers.h>
#include <ESP8266React.h>
#include "decoder.h"
#include "switchI2C.h"
#include "time.h"

#define BLINK_LED 2
#define MAX_DELAY 1000

#define DEFFAULT_URL "https://tinovi.com/api/v1/gw/json"
#define SPRINKLER_SETTINGS_FILE "/config/sprinklerSettings.json"
#define SPRINKLER_SETTINGS_PATH "/rest/sprinklerSettings"
#define DEVICES_SERVICE_PATH "/rest/devices"

class Switch_t {
 public:
  uint8_t type;  // 1-i2c , 2 - rs
  int16_t address;   // i2c or rs addrress
  String name;
  int16_t seconds;   // read interval seconds
  time_t lastReadTime;  //last read time
  vals_t readings;
  uint8_t coilsCount;  // coils count
  bool allowMulti;
 public:
   Switch_t(uint8_t type, int16_t address, int16_t seconds,  String name, uint8_t coilsCount, bool allowMulti) 
      : type(type),address(address),seconds(seconds), name(name), coilsCount(coilsCount), allowMulti(allowMulti){
   }
};

class SwitchType_t {
 public:
  uint8_t type;  // 1-i2c , 2 - rs
  int16_t address;   // i2c or rs addrress
  uint8_t coils;  // coils count
  String name;

 public:
   SwitchType_t(uint8_t type, int16_t address, uint8_t coils, String name) 
      : type(type),address(address),coils(coils), name(name) {
   }
};


class DeviceName_t {
 public:
  String devid;
  String name;

 public:
   DeviceName_t(String devid, String name) 
      : devid(devid), name(name) {
   }
};

class SprinklerSettings {
 public:
    String url;
    String auth;
    std::list<Switch_t> switches;
    std::list<DeviceName_t> devices;
};

class SprinklerProject : public AdminSettingsService<SprinklerSettings> {
 public:
  SprinklerProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  ~SprinklerProject();

  void loop();
  void begin();
  
 private:
  Triggers _triggers;
  unsigned long _lastBlink = 0;
  AsyncWebSocket ws;
  AsyncWebSocketClient* wsClient;
  void devicesList(AsyncWebServerRequest* request);
  void readData();
  void checkSwitch();
  void triggerOutput(Trigger_t *_trigger, uint8_t status);
 protected:
  void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len);
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void send(const char * message);
  
};

#endif
