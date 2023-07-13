#ifndef Triggers_h
#define Triggers_h

#include <AdminSettingsService.h>


#define TRIGGERS_SETTINGS_FILE "/config/triggerSettings.json"
#define TRIGGERS_SERVICE_PATH "/rest/triggerSettings"

class TriggerCondition_t {
 public:
  String devid;  // device 
  String sensor;  // device sensor 
  int16_t onVal;   /**Sensor VWC value to switch On*/
  int16_t offVal;   /**Sensor VWC value to switch off*/

 public:
   TriggerCondition_t(){
   } 

   TriggerCondition_t( String devid, String sensor, int16_t onVal, int16_t offVal) 
   : devid(devid), sensor(sensor), onVal(onVal), offVal(offVal){
   }
};
 
class Trigger_t {
 public:
  String name;
  String switchName;  // switch 
  uint8_t coil;  // coil number
  bool weekDays[7];  // bit week days operational
  bool hours[24];  //bit hours of day operational
  uint8_t onTimeMinute;  // trigger on minute if hour
  uint16_t maxTimeSec; /**Max time active seconds*/
  time_t lastOnTime;  //last switched on
  std::list<TriggerCondition_t> conditions;  // bit week days operational
  
 public:
   Trigger_t(String name, String switchName, uint8_t coil, uint8_t onTimeMinute, uint16_t maxTimeSec) 
   : name(name), switchName(switchName), coil(coil), onTimeMinute(onTimeMinute), maxTimeSec(maxTimeSec){
   }
};


class Triggers : public AdminSettingsService<std::list<Trigger_t>> {
 public:
  Triggers(AsyncWebServer* server, FS* fs, SecurityManager* securityManager);
  ~Triggers();

  void begin();
  void loop();

  std::list<Trigger_t>* getTriggers() {
    return &_settings;
  }
 private:
 protected:
  void readFromJsonObject(JsonObject& root);
  void writeToJsonObject(JsonObject& root);
 
};

#endif
