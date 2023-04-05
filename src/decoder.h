#ifndef __TNDECODER_H__
#define __TNDECODER_H__


#include <stdint.h>
// #define ARDUINOJSON_ENABLE_STD_STRING 1
#define ARDUINOJSON_USE_DOUBLE 1
#include <ArduinoJson.h>

#define BIT_SOIL1 0
#define BIT_BME 1
#define BIT_OPT 2
#define BIT_SOIL2 3
#define BIT_PULSE 4
#define BIT_PRES 5
#define BIT_LEAK 6
#define BIT_VALVE 7

#define BIT1_GPS 0
#define BIT1_LEAF 1
#define BIT1_ADC 2
#define BIT1_WIND 3
#define BIT1_SCALE 4
#define BIT1_SOIL_MULTI 5
#define BIT1_REZ6 6
#define BIT1_REZ7 7


typedef struct {
    bool hasData;
    char devid[8];
    uint32_t Eui;
    uint32_t up_cnt; 
    long lastTime;
    uint32_t time;
    int rssi;
    int snr;
    uint8_t bat;
    uint8_t len;
    uint8_t clen;
	char dataStr[128];

    uint8_t set;
    uint8_t set1;
   	double e25;
	double ec;
	double temp;
	double vwc;
   	double e25_1;
	double ec_1;
	double temp_1;
	double vwc_1;
	double airTemp;
	double airHum;
	double airPres;
	int32_t lux;
	int32_t pulse;
	double leafHum;
	double leafTemp;
	double press;
	double adc;
	uint8_t windDir;
	int32_t windSpeed;
	double scale;
	double m_dp[6];
	double m_vwc[6];
	double m_temp[3];

} DataMag;


typedef struct
{
  uint32_t sensEui;  // sensor EUI
  uint8_t switchNum;  // switch number
  uint32_t hours;  //bit hours of day operational
  uint8_t weekDays;  // bit week days operational
  int16_t onVal;   /**Sensor VWC value to switch On*/
  int16_t offVal;   /**Sensor VWC value to switch off*/
  uint8_t onTimeHour; /**Trigger on time*/
  uint8_t onTimeMinute; /**Trigger on time*/
  uint8_t onTimeWkDay; /**Trigger on time*/
  uint16_t maxTimeSec; /**Max time active seconds*/
  uint32_t onTime;  //last switched on
  String name;
} Trigger_t;


#define DEMO_SLOT_NUMBER 50

extern DataMag Sensors[DEMO_SLOT_NUMBER];
extern String mac;
int FindEui(uint32_t Eui);
extern StaticJsonDocument<1024> data;
extern int SlotCounter;   
uint8_t hexCharacterStringToBytes(uint8_t *byteArray, const char *hexString);
void decodeUplink(int cnum);
void generateStr(int cnum);
int start_http_json(String output, const String& devid, const String& url, const String& auth);
char *getMacAddress();
#endif /* __TNDECODER_H__ */
