#include <SprinklerProject.h>
#include <ESPAsyncWebServer.h>
#include <functional>
#include "decoder.h"
#include <lwip/apps/sntp.h>

SprinklerProject::SprinklerProject(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, SPRINKLER_SETTINGS_PATH, SPRINKLER_SETTINGS_FILE),
    ws("/ws"), _triggers(server, fs, securityManager) {
  
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


void SprinklerProject::begin() {
  SettingsService::begin();
  _triggers.begin();
}

void SprinklerProject::devicesList(AsyncWebServerRequest* request) {
  AsyncJsonResponse* response = new AsyncJsonResponse(false, MAX_ESP_STATUS_SIZE);
  JsonObject root = response->getRoot();
  JsonArray array = root.createNestedArray("devices");
  for (int i = 0; i < SlotCounter;i++){
	    JsonObject object = array.createNestedObject();
      object["devid"] = Sensors[i].devid;
      object["rssi"] = Sensors[i].rssi;
      object["bat"] = Sensors[i].bat;
      object["time"] = Sensors[i].time;
      object["data"] = Sensors[i].data.as<JsonObject>();
	}
  response->setLength();
  request->send(response);
  // Serial.println("devicesList sent "+SlotCounter);

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
  Serial.println(dataIn);
    int pipe = dataIn.indexOf('|');
    String key = dataIn.substring(0,pipe);
    String value = dataIn.substring(pipe + 1);
    log_i("Data received: %s   %s \n", key, value);
    if (key = "switch"){
      int cols = dataIn.indexOf(':');
      String swName = value.substring(0,cols);
      String vakc = value.substring(cols + 1);
      int ekv = vakc.indexOf('=');
      int swIdx = vakc.substring(0,ekv).toInt();
      int swState = vakc.substring(ekv+1).toInt();
      for (Switch_t _switch : _settings.switches) {
        if(swName.equals(_switch.name) && _switch.type == 1){
          SWI2C sw;
          sw.init(_switch.address, &Wire);
          if(swState){
            bitSet(_switch.readings.coils, swIdx);
          }else{
            bitClear(_switch.readings.coils, swIdx);
          }
          sw.setCoils(_switch.readings.coils);
        }
      }
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
	void SprinklerProject::readData(){
		for (; Serial.available(); ) {
			rxd+=Serial.read();
		}
		int pp = rxd.find('\r');
		if(pp == std::string::npos){
			pp = rxd.find('\n');
		}
		if(pp != std::string::npos){
			if (rxd.find("AT+RCV=", 0) != std::string::npos){
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
						String output="";
	          Sensors[snum].data["rssi"] = Sensors[snum].rssi;
            Sensors[snum].data["bat"] = Sensors[snum].bat;
	          serializeJson(Sensors[snum].data, output);
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


// #define ADCS 0
// #define TEMPS 2
// #define PULS 4


 void SprinklerProject::triggerOutput(Trigger_t *_trigger, uint8_t status){

  }
 

  #define CHECK_BIT(var,pos) ((var) & (1<<(pos)))
 

  void SprinklerProject::checkSwitch(){
    struct tm timeinfo;
    time_t now = time(nullptr);

    ///
    if(!getLocalTime(&timeinfo)){
      log_i(“Failed to obtain time”);
      return;
    }
    SWI2C sw;
    for (Switch_t _switch : _settings.switches) {
      if(_switch.seconds && (now - _switch.lastReadTime) > _switch.seconds && _switch.type ==1){
        sw.init(_switch.address, &Wire);
	      sw.newReading(); // start sensor reading
	      delay(100); //let sensor read data
        sw.getData((byte *)&_switch.readings);
        _switch.lastReadTime = now;
        uint32_t eui = _switch.type * 1000 + _switch.address;
        int snum = FindEui(eui);
        Sensors[snum].time = now;
        sprintf(Sensors[snum].devid, "SW_%d",eui);
        Sensors[snum].data.clear();
        if(_switch.readings.holdingRegs[0]!=0){
          Sensors[snum].data["adc1"] =  _switch.readings.holdingRegs[0] / 100.0;
        }
        if(_switch.readings.holdingRegs[1]!=0){
          Sensors[snum].data["adc2"] =  _switch.readings.holdingRegs[1] / 100.0;
        }
        if(_switch.readings.holdingRegs[2]!=0){
          Sensors[snum].data["temp1"] =  _switch.readings.holdingRegs[2] / 100.0;
        }
        if(_switch.readings.holdingRegs[3]!=0){
          Sensors[snum].data["temp2"] =  _switch.readings.holdingRegs[3] / 100.0;
        }
      }
    }
  }
	
  void SprinklerProject::loop(){
    delay(100);
    readData();
    //checkSwitch();
  }



void SprinklerProject::readFromJsonObject(JsonObject& root) {
  _settings.url = root["url"] | DEFFAULT_URL;
  _settings.auth = root["auth"]| "";
    // users
  _settings.switches.clear();
  if (root["switches"].is<JsonArray>()) {
    for (JsonVariant switcht : root["switches"].as<JsonArray>()) {
     _settings.switches.push_back(Switch_t(switcht["type"], switcht["address"], switcht["seconds"], switcht["name"], switcht["coilsCount"], switcht["allowMulti"]));
    }
  }
}


void SprinklerProject::writeToJsonObject(JsonObject& root) {
  root.clear();
  root["url"] = _settings.url;
  root["auth"] = _settings.auth;
  JsonArray switches = root.createNestedArray("switches");
  for (Switch_t _switch : _settings.switches) {
    JsonObject switcht = switches.createNestedObject();
    switcht["name"] = _switch.name;
    switcht["type"] = _switch.type;
    switcht["address"] = _switch.address;
    switcht["seconds"] = _switch.seconds;
    switcht["coilsCount"] = _switch.coilsCount;
    switcht["allowMulti"] = _switch.allowMulti;
    
    JsonArray coils = switcht.createNestedArray("coils");
    for(int i=0; i<_switch.coilsCount;i++){
      coils.add((bool)(CHECK_BIT(_switch.readings.coils, i)?true:false));
    }
  }

}
