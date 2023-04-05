#include <SprinklerProject.h>
#include <ESPAsyncWebServer.h>
#include <functional>
#include "decoder.h"
#include <lwip/apps/sntp.h>

SprinklerProject::SprinklerProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, DEMO_SETTINGS_PATH, DEMO_SETTINGS_FILE),
    ws("/ws") {
  // pinMode(BLINK_LED, OUTPUT);
  
  // ledcSetup(0, 5000, 8);
  // ledcAttachPin(BLINK_LED, 0);
    // configure LED PWM functionalitites
  
  //Wensockets handle
   ws.onEvent(std::bind(&SprinklerProject::onWsEvent, this, std::placeholders::_1, std::placeholders::_2, 
                        std::placeholders::_3, std::placeholders::_4, std::placeholders::_5, std::placeholders::_6));
   server->addHandler(&ws);

   server->on(DEVICES_SERVICE_PATH,
             HTTP_GET,
             securityManager->wrapRequest(std::bind(&SprinklerProject::devicesList, this, std::placeholders::_1),
                                          AuthenticationPredicates::IS_AUTHENTICATED));

}

SprinklerProject::~SprinklerProject() {
}

void SprinklerProject::devicesList(AsyncWebServerRequest* request) {
  AsyncJsonResponse* response = new AsyncJsonResponse(false, MAX_ESP_STATUS_SIZE);
  JsonObject root = response->getRoot();
  JsonArray array = root.createNestedArray("list");
  for (int i = 0; i < SlotCounter;i++){
	    JsonObject object = array.createNestedObject();
      object["devid"] = Sensors[i].devid;
      object["rssi"] = Sensors[i].rssi;
      object["bat"] = Sensors[i].bat;
      object["time"] = Sensors[i].time;
	}
  response->setLength();
  request->send(response);
  log_i("devicesList sent %i \n",SlotCounter);

}
void SprinklerProject::onWsEvent(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type, void * arg, uint8_t *data, size_t len){

  if(type == WS_EVT_CONNECT){

    log_i("Websocket client connection received \n");
    wsClient = client;
    // const String &token = ((const AsyncWebServerRequest *) (arg))->arg("Authorization");
    // if (token.startsWith(AUTHORIZATION_HEADER_PREFIX)) {
    //    Authentication authentication = ((SecuritySettingsService *)(this->_securityManager))->authenticateJWT(token.substring(AUTHORIZATION_HEADER_PREFIX_LEN));
    //    if (!getAuthenticationPredicate()(authentication)) {
    //      log_i("Unauthorized invalid token \n");
    //      client->close(401,"Invalid Token");  
    //    }else{
    //     wsClient = client;
    //    }
    // }else{
    //   log_i("Unauthorized token missing \n");
    //   client->close(401,"Invalid Token"); 
    // }
  } else if(type == WS_EVT_DISCONNECT){
    wsClient = nullptr;
    log_i("Client disconnected \n");
  } else if(type == WS_EVT_DATA){

    data[len-1] = '\0';
    String dataIn((char*) data);
    int separator = dataIn.indexOf('|');
    String key = dataIn.substring(0,separator);
    String value = dataIn.substring(separator + 1);
    log_i("Data received: %s   %s \n", key, value);
    if (key = "blink_speed"){
       
       // ledcWrite(0, ivalue);
    }
  }
}

void SprinklerProject::send(const char * message){
  if(wsClient != nullptr && wsClient->canSend()) {
    wsClient->text(message);
  }
}


//AT+RCV=051c3296,11,-7,8,00FE2001014A014E01BA01D701B7020C087208170857
// AT+RCV=051c3296,1,-16,8,00FE20010192018201D301F001C8022107FD079A0811
//AT+DOWN=051c3296:010000001E

	std::string rxd;

	void SprinklerProject::loop(){
		for (; Serial.available(); ) {
			rxd+=Serial.read();
		}
		int pp = rxd.find('\r');
		if(pp == std::string::npos){
			pp = rxd.find('\n');
		}
		if(pp != std::string::npos){
			if (rxd.find("AT+RCV=", 0) != std::string::npos){
				//SerialBLE.print(rxd.c_str());
				int ep = rxd.find('=');
				std::string devid = rxd.substr(ep+1,8);
				uint32_t eui;
				hexCharacterStringToBytes((uint8_t *)&eui, devid.c_str()); 
				int snum = FindEui(eui);
				int lp =  rxd.rfind(',');
				log_i("lp=%i, pp=%i snum=%i eui=%i devid=%s %s\n", lp, pp,snum, eui, devid.c_str(), rxd.c_str());
				if(snum>-1){
					rxd.substr(lp+1, pp - lp - 1).copy(Sensors[snum].dataStr, rxd.length() - lp - 1);
					Sensors[snum].lastTime = millis();
          Sensors[snum].time = time(nullptr);
					Sensors[snum].clen =  pp - lp - 1;
					Sensors[snum].dataStr[Sensors[snum].clen] = '\0';
					devid.copy(Sensors[snum].devid,8);
					log_i("data: %s len=%i  \n", Sensors[snum].dataStr, Sensors[snum].clen);
					sscanf(rxd.substr(ep+10, lp-ep-10).c_str(), "%u,%i,%i", &Sensors[snum].up_cnt, &Sensors[snum].rssi, &Sensors[snum].snr);
					log_i("parsed :: %i,%i,%i devid=%s\n", Sensors[snum].up_cnt, Sensors[snum].rssi, Sensors[snum].snr, Sensors[snum].devid);
					decodeUplink(snum);
					if(WiFi.status() == WL_CONNECTED){
						generateStr(snum);
	          String output="";
	          serializeJson(data, output);
	          log_i("Sending %s\n",output.c_str());
            send(output.c_str());
						start_http_json(output, Sensors[snum].devid, _settings.url, _settings.auth);
						Sensors[snum].hasData = false;
					}else{
						Sensors[snum].hasData = true;
						//hasData = true;
					}
				}
			}
			rxd = "";
		}

	}



void SprinklerProject::readFromJsonObject(JsonObject& root) {
  _settings.url = root["url"] | DEFFAULT_URL;
  _settings.auth = root["auth"]| "";
}

void SprinklerProject::writeToJsonObject(JsonObject& root) {
  root["url"] = _settings.url;
  root["auth"] = _settings.auth;
}
