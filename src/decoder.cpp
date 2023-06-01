
#include "decoder.h"
#include <WiFi.h>


#include <HTTPClient.h>



DataMag Sensors[DEMO_SLOT_NUMBER];


  int SlotCounter;       
  int LastSlot;    
uint32_t validSeconds = 60*60*24*2;//2d
int FindEui(uint32_t Eui)
{

  for (LastSlot = 0; LastSlot < (DEMO_SLOT_NUMBER); LastSlot++)
  {
    if (Sensors[LastSlot].Eui == Eui)
    {
      return LastSlot;     /*Slot number is sensor location + 2*/
    }
  }
  for(int i = 0; i<(DEMO_SLOT_NUMBER); i++){
	  if(Sensors[i].lastTime>0 && (millis() - Sensors[i].lastTime)>(validSeconds * 1000)){
		  LastSlot = i;
		  Sensors[LastSlot].Eui = Eui;
		  return LastSlot;
	  }
  }
  if(SlotCounter+1 >= DEMO_SLOT_NUMBER){
	  //APP_LOG(TS_ON, VLEVEL_M, "FindEui too much sensors size: %d reached\n\r", CONC.SlotCounter);
	  return (-1);
  }
  LastSlot = SlotCounter;
  Sensors[LastSlot].Eui = Eui;
  SlotCounter++;
  return LastSlot;
}

String mac;
char *getMacAddress() {
	uint8_t baseMac[6];
	// Get MAC address for WiFi station
	esp_read_mac(baseMac, ESP_MAC_WIFI_STA);
	char *baseMacChr = (char *) malloc(sizeof(char) * 24);
	sprintf(baseMacChr, "GW%02X%02X%02X%02X%02X%02X", baseMac[0], baseMac[1], baseMac[2], baseMac[3], baseMac[4], baseMac[5]);
	return baseMacChr;
}



//[135831][I][http.cpp:24] start_http_json(): Sending {"id":"WIFI6055F9C73E74","devid":"051c3296","set":0,"bat":254,"rssi":-7,"wrssi":-62,"m_dp_":2.648454098e-43,"m_vwc_":-0.052999999,"_dp_":2.802596929e-43,"_vwc_":-0.052999999,"dp_":6.67018069e-43,"vwc_":-0.052999999,"p_":7.707141554e-43,"wc_":-0.052999999,"_":-0.052999999,"c_":-0.052999999,"":4.344025239e-44,"m_temp_":4.091791516e-43,"_temp_":8.26766094e-44,"temp_":3.124895575e-43}


double bytesToSigned(uint8_t *byteArray, int pos, double dev) {
  uint8_t sign = byteArray[pos] & (1 << 7);
  int16_t x = ((byteArray[pos] & 0xFF) << 8) | (byteArray[pos+1] & 0xFF);
  if (sign) {
    x = 0xFFFF0000 | x; 
  }
  return x/dev;
}

// float bytes16ToFloat(uint8_t *byteArray, int pos, int dev) {
// 	int16_t retp;
// 	uint8_t *pointer = (uint8_t *)&retp;
// 	pointer[0] = byteArray[pos];
// 	pointer[1] = byteArray[pos+1];
//     return retp/dev;
// }

float bytesToFloat32(uint8_t *byteArray, int pos) {
	float retp;
	uint8_t *pointer = (uint8_t *)&retp;
	pointer[0] = byteArray[pos];
	pointer[1] = byteArray[pos+1];
	pointer[2] = byteArray[pos+2];
	pointer[3] = byteArray[pos+3];
    return retp;
}

int32_t bytesToInt32(uint8_t *byteArray, int pos) {
	int32_t retp;
	uint8_t *pointer = (uint8_t *)&retp;
	pointer[0] = byteArray[pos];
	pointer[1] = byteArray[pos+1];
	pointer[2] = byteArray[pos+2];
	pointer[3] = byteArray[pos+3];
    return retp;
}

void decodeUplink(int cnum) {
  					// int rssi = atoi(rxd.substr(16,rxd.find_first_of(",", 16)).c_str());
					// std::size_t dataStart = rxd.find_last_of(",");
					// uint8_t byteArray[128];
					// int len = hexCharacterStringToBytes(byteArray, rxd.substr(dataStart+1, rx.length()-dataStart-1).c_str());
  uint8_t bytes[64];       
	Sensors[cnum].len = hexCharacterStringToBytes(bytes, Sensors[cnum].dataStr);
	log_i("len=%i\n", Sensors[cnum].len);
  int pos = 1;
  Sensors[cnum].data.clear();
	Sensors[cnum].set = bytes[0];
  Sensors[cnum].bat = bytes[pos++]; 
	if(((bytes[0] >> BIT_SOIL1) & 1)==1){ //SOIL
    Sensors[cnum].data["e25"] = bytesToSigned(bytes, pos, 100.0);
    pos = pos+2;
    Sensors[cnum].data["ec"] = bytesToSigned(bytes,pos,10.0);
    pos = pos+2;
    Sensors[cnum].data["temp"] = bytesToSigned(bytes,pos,100.0);
    pos = pos+2;
    Sensors[cnum].data["vwc"] = bytesToSigned(bytes,pos,1.0);
    pos = pos+2;
  }
  if(((bytes[0] >> BIT_BME) & 1)==1){ //BME
    Sensors[cnum].data["airTemp"] = bytesToSigned(bytes,pos,100.0);
    pos = pos+2;
    Sensors[cnum].data["airHum"] = bytesToSigned(bytes,pos,100.0);
    pos = pos+2;
    Sensors[cnum].data["airPres"] = bytesToSigned(bytes,pos,1.0)+50000;
    pos = pos+2;
  }
  if(((bytes[0] >> BIT_OPT) & 1)==1){ //OPT
    Sensors[cnum].data["lux"] = bytesToInt32(bytes,pos)/10;
    pos = pos+4;
  }
  if(((bytes[0] >> BIT_PULSE) & 1)==1){ //PULSE
    Sensors[cnum].data["pulse"]=bytesToInt32(bytes,pos);
    pos = pos+4;
  }
  if(((bytes[0] >> BIT_SOIL2) & 1)==1){ //SOIL
    Sensors[cnum].data["e25_1"] = bytesToSigned(bytes,pos,100.0);
    pos = pos+2;
    Sensors[cnum].data["ec_1"] = bytesToSigned(bytes,pos,10.0);
    pos = pos+2;
    Sensors[cnum].data["temp_1"] = bytesToSigned(bytes,pos,100.0);
    pos = pos+2;
    Sensors[cnum].data["vwc_1"] = bytesToSigned(bytes,pos,1.0);
    pos = pos+2;
  }
  if(((bytes[0] >> BIT_PRES) & 1)==1){ //PRESSURE
    Sensors[cnum].data["press"] = bytesToSigned(bytes,pos,100.0);
    pos = pos+2;
  }
  if(Sensors[cnum].len >(pos+1)){
	  Sensors[cnum].set1 =  bytes[pos++];
    if(((Sensors[cnum].set1 >> BIT1_LEAF) & 1)==1){ //LEAF
      Sensors[cnum].data["leafHum"] = bytesToSigned(bytes,pos,100.0);
      pos = pos+2;
      Sensors[cnum].data["leafTemp"] = bytesToSigned(bytes,pos,100.0);
      pos = pos+2;
    }
    if(((Sensors[cnum].set1 >> BIT1_ADC) & 1)==1){ //ADC
      Sensors[cnum].data["adc"] = bytesToFloat32(bytes,pos);
      pos = pos+4;
    }
    if(((Sensors[cnum].set1 >> BIT1_WIND) & 1)==1){ //WIND
      Sensors[cnum].data["windDir"] = bytes[pos++];
      Sensors[cnum].data["windSpeed"] = bytesToFloat32(bytes,pos);
      pos = pos+4;
    }
    if(((Sensors[cnum].set1 >> BIT1_SCALE) & 1)==1){ //SCALE
      Sensors[cnum].data["scale"] = bytesToInt32(bytes,pos)/10;
      pos = pos+4;
    }
    if(((Sensors[cnum].set1 >> BIT1_SOIL_MULTI) & 1)==1){ //BIT1_SOIL_MULTI
      uint8_t mult_v=bytes[pos++];//ver
      for(uint8_t c=0;c < 6;c++){
        Sensors[cnum].m_dp[c] = bytesToSigned(bytes,pos,100.0);
        Sensors[cnum].m_vwc[c] = ((int)((4.3e-6 * pow(Sensors[cnum].m_dp[c],3) - 5.5e-4*pow(Sensors[cnum].m_dp[c],2) + 2.92e-2*Sensors[cnum].m_dp[c] - 5.3e-2)*10000))/100.0;
        pos = pos+2;
      }
      for(uint8_t i = 0;i < 3;i++){
        Sensors[cnum].m_temp[i] = bytesToSigned(bytes,pos,100.0);
        pos = pos+2;
      }
      Sensors[cnum].data["m_dp_1"] = Sensors[cnum].m_dp[0];
      Sensors[cnum].data["m_vwc_1"] = Sensors[cnum].m_vwc[0];
      Sensors[cnum].data["m_dp_2"] = Sensors[cnum].m_dp[1];
      Sensors[cnum].data["m_vwc_2"] = Sensors[cnum].m_vwc[1];
      Sensors[cnum].data["m_dp_3"] = Sensors[cnum].m_dp[2];
      Sensors[cnum].data["m_vwc_3"] = Sensors[cnum].m_vwc[2];
      Sensors[cnum].data["m_dp_4"] = Sensors[cnum].m_dp[3];
      Sensors[cnum].data["m_vwc_4"] = Sensors[cnum].m_vwc[3];
      Sensors[cnum].data["m_dp_5"] = Sensors[cnum].m_dp[4];
      Sensors[cnum].data["m_vwc_5"] = Sensors[cnum].m_vwc[4];
      Sensors[cnum].data["m_dp_6"] = Sensors[cnum].m_dp[5];
      Sensors[cnum].data["m_vwc_6"] = Sensors[cnum].m_vwc[5];
      Sensors[cnum].data["m_temp_1"] = Sensors[cnum].m_temp[0];
      Sensors[cnum].data["m_temp_2"] = Sensors[cnum].m_temp[1];
      Sensors[cnum].data["m_temp_3"] = Sensors[cnum].m_temp[2];

    }
  }
}





uint8_t nibble(char c)
{
  if (c >= '0' && c <= '9')
    return c - '0';

  if (c >= 'a' && c <= 'f')
    return c - 'a' + 10;

  if (c >= 'A' && c <= 'F')
    return c - 'A' + 10;

  return 0;  // Not a valid hexadecimal character
}


uint8_t hexCharacterStringToBytes(uint8_t *byteArray, const char *hexString)
{
  bool oddLength = strlen(hexString) & 1;
	log_i("oddLength=%i\n", oddLength);
	
  uint8_t currentByte = 0;
  uint8_t byteIndex = 0;

  for (uint8_t charIndex = 0; charIndex < strlen(hexString); charIndex++)
  {
    bool oddCharIndex = charIndex & 1;

    if (oddLength)
    {
      // If the length is odd
      if (oddCharIndex)
      {
        // odd characters go in high nibble
        currentByte = nibble(hexString[charIndex]) << 4;
      }
      else
      {
        // Even characters go into low nibble
        currentByte |= nibble(hexString[charIndex]);
        byteArray[byteIndex++] = currentByte;
        currentByte = 0;
      }
    }
    else
    {
      // If the length is even
      if (!oddCharIndex)
      {
        // Odd characters go into the high nibble
        currentByte = nibble(hexString[charIndex]) << 4;
      }
      else
      {
        // Odd characters go into low nibble
        currentByte |= nibble(hexString[charIndex]);
        byteArray[byteIndex++] = currentByte;
        currentByte = 0;
      }
    }
  }
  return byteIndex+1;
}

HTTPClient http;

int start_http_json(String output, const String& devid, const String& url, const String& auth) {
	if(url == nullptr || url.length() == 0){
		return 0;
	}

	http.begin(url); //Specify destination for HTTP request
	http.addHeader("Content-Type", "application/json");  //Specify content-type header
	if(url != nullptr && auth.length() > 0){
		http.addHeader("Authorization",auth);
	}
	int httpResponseCode = http.POST(output); //Send the actual POST request

	if (httpResponseCode > 0) {
		String inputString = http.getString();
		log_i("Resp: %i ret=%s\n", httpResponseCode, inputString.c_str());
		if(inputString.length() && inputString.length()<50 && !inputString.equals("no device found")){
			Serial.print("AT+DOWN=");
			Serial.print(devid);
			Serial.print(":");
			Serial.println(inputString);

			// size_t decodedLength;
			// byte * decoded = base64_decode((const unsigned char *)inputString.c_str(), inputString.length(), &decodedLength);
			//loraCmd(decoded ,0, decodedLength);
		}

	} else {
		log_i("rror http: %i \n", httpResponseCode);
	}
	http.end();  //Free resources
	log_i("http.end(): \n");
	return httpResponseCode;
}
