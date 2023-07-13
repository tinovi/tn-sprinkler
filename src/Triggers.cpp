#include <Triggers.h>

Triggers::Triggers(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    AdminSettingsService(server, fs, securityManager, TRIGGERS_SERVICE_PATH, TRIGGERS_SETTINGS_FILE) {
}

Triggers::~Triggers() {
}

void Triggers::begin() {
  SettingsService::begin();
}

void Triggers::loop() {
}


void Triggers::readFromJsonObject(JsonObject& root) {
    // users
  _settings.clear();
  if (root["triggers"].is<JsonArray>()) {
    for (JsonVariant trigger : root["triggers"].as<JsonArray>()) {
      Trigger_t trig(trigger["name"], trigger["switchName"], trigger["coil"], trigger["onTimeMinute"], trigger["maxTimeSec"]);
      int i = 0;
      for (JsonVariant weekDay : trigger["weekDays"].as<JsonArray>()) {
        trig.weekDays[i++] = weekDay;
      }
      i = 0;
      for (JsonVariant hour : trigger["hours"].as<JsonArray>()) {
        trig.hours[i++] = hour;
      }
      i = 0;
      trig.conditions.clear();
      for (JsonVariant cond : trigger["conditions"].as<JsonArray>()) {
        trig.conditions.push_back(TriggerCondition_t(cond["devid"],cond["sensor"],cond["onVal"],cond["offVal"]));
        i++;
      }
      _settings.push_back(trig);
    }
  }
}


void Triggers::writeToJsonObject(JsonObject& root) {
  root.clear();
  JsonArray triggers = root.createNestedArray("triggers");
  for (Trigger_t _trigger : _settings) {
    JsonObject trigger = triggers.createNestedObject();
    trigger["name"] = _trigger.name;
    trigger["switchName"] = _trigger.switchName;
    trigger["coil"] = _trigger.coil;
    JsonArray weekDays = trigger.createNestedArray("weekDays");
    for(bool day:_trigger.weekDays){
      weekDays.add(day);
    }
    JsonArray hours = trigger.createNestedArray("hours");
    for(bool hour:_trigger.hours){
      hours.add(hour);
    }
    trigger["onTimeMinute"] = _trigger.onTimeMinute;
    trigger["maxTimeSec"] = _trigger.maxTimeSec;

    JsonArray conditions = trigger.createNestedArray("conditions");
      int i = 0;
    for(TriggerCondition_t cond:_trigger.conditions){
      JsonObject condition = conditions.createNestedObject();
      condition["devid"] = cond.devid;
      condition["sensor"] = cond.sensor;
      condition["onVal"] = cond.onVal;
      condition["offVal"] = cond.offVal;
      i++;
    }
  }
  }