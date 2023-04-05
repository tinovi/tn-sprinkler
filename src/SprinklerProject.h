#ifndef SprinklerProject_h
#define SprinklerProject_h

#include <AdminSettingsService.h>
#include <ESP8266React.h>
#include "decoder.h"

#define BLINK_LED 2
#define MAX_DELAY 1000

#define DEFFAULT_URL "https://tinovi.com/api/v1/gw/json"
#define DEMO_SETTINGS_FILE "/config/sprinklerSettings.json"
#define DEMO_SETTINGS_PATH "/rest/sprinklerSettings"
#define DEVICES_SERVICE_PATH "/rest/devices"

class SprinklerSettings {
 public:
    String url;
    String auth;
    Trigger_t triggers[100];
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

 protected:
  void onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len);
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
  void send(const char * message);
  
};

#endif
