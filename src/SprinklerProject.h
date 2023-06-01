#ifndef SprinklerProject_h
#define SprinklerProject_h

#include <AdminSettingsService.h>
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

 
class Trigger_t {
 public:
  String name;
  String devid;  // device 
  String sensor;  // device sensor 
  String switchName;  // switch 
  uint8_t coil;  // coil number
  bool weekDays[7];  // bit week days operational
  bool hours[24];  //bit hours of day operational
  int16_t onVal;   /**Sensor VWC value to switch On*/
  int16_t offVal;   /**Sensor VWC value to switch off*/
  uint8_t onTimeMinute;  // trigger on minute if hour
  uint16_t maxTimeSec; /**Max time active seconds*/
  time_t lastOnTime;  //last switched on

 public:
   Trigger_t(String name, uint32_t sensEui) : name(name), devid(devid) {
   }
   Trigger_t(String name, String devid, String sensor, String switchName, uint8_t coil, int16_t onVal, int16_t offVal, uint8_t onTimeMinute, uint16_t maxTimeSec) 
   : name(name), devid(devid), sensor(sensor), switchName(switchName), coil(coil), onVal(onVal), onTimeMinute(onTimeMinute), maxTimeSec(maxTimeSec){
   }
};

class Switch_t {
 public:
  uint8_t type;  // 1-i2c , 2 - rs
  int16_t address;   // i2c or rs addrress
  String name;
  int16_t seconds;   // read interval seconds
  time_t lastReadTime;  //last read time
  vals_t readings;
 public:
   Switch_t(uint8_t type, int16_t address, int16_t seconds,  String name) 
      : type(type),address(address),seconds(seconds), name(name) {
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

class SprinklerSettings {
 public:
    String url;
    String auth;
    std::list<Trigger_t> triggers;
    std::list<Switch_t> switches;
};

class SprinklerProject : public AdminSettingsService<SprinklerSettings> {
 public:
  SprinklerProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  ~SprinklerProject();

  void loop();
  
 private:
  unsigned long _lastBlink = 0;
  AsyncWebSocket ws;
  AsyncWebSocketClient* wsClient;
  void devicesList(AsyncWebServerRequest* request);
  void readData();
  void checkTrigger();
  void triggerOutput(Trigger_t *_trigger, uint8_t status);
 protected:
  void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len);
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void send(const char * message);
  
};

#endif
