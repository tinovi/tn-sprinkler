#include <OTASettingsService.h>

OTASettingsService::OTASettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, OTA_SETTINGS_SERVICE_PATH, OTA_SETTINGS_FILE) {
#ifdef ESP32
  WiFi.onEvent(std::bind(&OTASettingsService::onStationModeGotIP, this, std::placeholders::_1, std::placeholders::_2),
               WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
#elif defined(ESP8266)
  _onStationModeGotIPHandler =
      WiFi.onStationModeGotIP(std::bind(&OTASettingsService::onStationModeGotIP, this, std::placeholders::_1));
#endif
}

OTASettingsService::~OTASettingsService() {
}

void OTASettingsService::loop() {
  if ( _settings.enabled && _arduinoOTA) {
    _arduinoOTA->handle();
  }
}

void OTASettingsService::onConfigUpdated() {
  configureArduinoOTA();
}

void OTASettingsService::readFromJsonObject(JsonObject& root) {
  _settings.enabled = root["enabled"] | DEFAULT_OTA_ENABLED;
  _settings.port = root["port"] | DEFAULT_OTA_PORT;
  _settings.password = root["password"] | DEFAULT_OTA_PASSWORD;
}

void OTASettingsService::writeToJsonObject(JsonObject& root) {
  root["enabled"] = _settings.enabled;
  root["port"] = _settings.port;
  root["password"] = _settings.password;
}

void OTASettingsService::configureArduinoOTA() {
  if (_arduinoOTA) {
#ifdef ESP32
    _arduinoOTA->end();
#endif
    delete _arduinoOTA;
    _arduinoOTA = nullptr;
  }
  if (_settings.enabled) {
    log_i("Starting OTA Update Service \n");
    _arduinoOTA = new ArduinoOTAClass;
    _arduinoOTA->setPort(_settings.port);
    _arduinoOTA->setPassword(_settings.password.c_str());
    _arduinoOTA->onStart([]() { log_i("Starting \n"); });
    _arduinoOTA->onEnd([]() { log_i("\nEnd \n"); });
    _arduinoOTA->onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    });
    _arduinoOTA->onError([](ota_error_t error) {
      log_i("Error[%u]: \n", error);
      if (error == OTA_AUTH_ERROR)
        log_i("Auth Failed\n");
      else if (error == OTA_BEGIN_ERROR)
        log_i("Begin Failed\n");
      else if (error == OTA_CONNECT_ERROR)
        log_i("Connect Failed\n");
      else if (error == OTA_RECEIVE_ERROR)
        log_i("Receive Failed\n");
      else if (error == OTA_END_ERROR)
        log_i("End Failed\n");
    });
    _arduinoOTA->begin();
  }
}
#ifdef ESP32
void OTASettingsService::onStationModeGotIP(WiFiEvent_t event, WiFiEventInfo_t info) {
  configureArduinoOTA();
}
#elif defined(ESP8266)
void OTASettingsService::onStationModeGotIP(const WiFiEventStationModeGotIP& event) {
  configureArduinoOTA();
}
#endif
