#include <SprinklerProject.h>
#include <ESP8266React.h>
#include <FS.h>
#include <Wire.h>
#include "decoder.h"
#define SERIAL_BAUD_RATE 9600

AsyncWebServer server(80);
ESP8266React esp8266React(&server, &SPIFFS);
SprinklerProject sprinklerProject = SprinklerProject(&server, &SPIFFS, esp8266React.getSecurityManager());

void setup() {
  	mac = String(getMacAddress());

  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);
  log_i("setup... \n");
	Wire.begin();
  // start the file system (must be done before starting the framework)
#ifdef ESP32
  SPIFFS.begin(true);
#elif defined(ESP8266)
  SPIFFS.begin();
#endif

  // start the framework and demo project
  esp8266React.begin();

  // start the demo project
  sprinklerProject.begin();

  // start the server
  server.begin();
}

void loop() {
  // run the framework's loop function
  esp8266React.loop();

  // run the demo project's loop function
  sprinklerProject.loop();
}
