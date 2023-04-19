#ifndef SprinklerProject_h
#define SprinklerProject_h

#include <AdminSettingsService.h>
#include <ESP8266React.h>
#include "decoder.h"

#define BLINK_LED 2
#define MAX_DELAY 1000

#define DEFFAULT_URL "https://tinovi.com/api/v1/gw/json"
#define SPRINKLER_SETTINGS_FILE "/config/sprinklerSettings.json"
#define SPRINKLER_SETTINGS_PATH "/rest/sprinklerSettings"
#define DEVICES_SERVICE_PATH "/rest/devices"


class Trigger_t {
 public:
  uint32_t sensEui;  // sensor EUI
  uint8_t switchNum;  // switch number
  uint8_t coil;  // coil number
  uint8_t weekDays;  // bit week days operational
  uint32_t hours;  //bit hours of day operational
  uint8_t minute; /**Trigger on time minute starting 1-60*/
  int16_t onVal;   /**Sensor VWC value to switch On*/
  int16_t offVal;   /**Sensor VWC value to switch off*/
  uint16_t maxTimeSec; /**Max time active seconds*/
  time_t onTime;  //last switched on
  String name;

 public:
   Trigger_t(String name, uint32_t sensEui) : name(name), sensEui(sensEui) {
   }
};



class SprinklerSettings {
 public:
    String url;
    String auth;
    std::list<Trigger_t> triggers;
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
