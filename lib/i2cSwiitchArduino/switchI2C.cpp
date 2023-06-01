/*
 * switchI2C.cpp
 *
 */
#include "switchI2C.h"


SWI2C::SWI2C(){
  addr=0x55; //85 dec
}

int SWI2C::init(int address, TwoWire *the_wire){
  _wire = the_wire;
  addr = address;
  return 0;
}

int SWI2C::init(int address){
  addr = address;
  return 0;
}


bool SWI2C::i2cdelay(int size){
  int i=0;
  for (;_wire->available() < size && i<=size;i++) {
	  delay(2);
  }
  if(i>=size){
	  return false;
  }else{
	  return true;
  }
}

int SWI2C::getState(){ //-1:no data, 0:err, 1:ok
  _wire->requestFrom(addr, (uint8_t)1);
   if(i2cdelay(1)){
    return _wire->read();
  }else{
    return -1;
  }
}

int16_t SWI2C::getVal(byte reg){

  _wire->beginTransmission(addr); // transmit to device
  _wire->write(reg);              // sends one byte
  _wire->endTransmission();    // stop transmitting
 
  _wire->requestFrom(addr, (uint8_t)2);
  int16_t ret=0;
  if(i2cdelay(2)){
	byte *pointer = (byte *)&ret;
    pointer[0] = _wire->read();
    pointer[1] = _wire->read();
  }
  return ret;
}


int SWI2C::setReg8(byte reg, byte val){
  _wire->beginTransmission(addr); // transmit to device
  _wire->write(reg);              // sends one byte
  _wire->write(val);              // sends one byte
  _wire->endTransmission();    // stop transmitting
  return getState();
}

int SWI2C::setReg(byte reg){
  _wire->beginTransmission(addr); // transmit to device
  _wire->write(reg);              // sends one byte
  _wire->endTransmission();    // stop transmitting
  delay(2);
  return getState();
}

  int SWI2C::setCoils(uint16_t coils){
    _wire->beginTransmission(addr);
    _wire->write(REG_SET);
    uint8_t *pointer = (uint8_t *)&coils;
    _wire->write((uint8_t *)&pointer[0],1);
    _wire->write((uint8_t *)&pointer[1],1);
    _wire->endTransmission();
    return getState();
  }

int SWI2C::newAddress(byte newAddr){
  if(setReg8(REG_ADDR, newAddr)){
    addr = newAddr;
  }
  else{
    return 0;
  }
  return 1;
}

int SWI2C::newReading(){
  _wire->beginTransmission(addr); // transmit to device
  _wire->write(REG_READ_DATA);              // sends one byte
  _wire->endTransmission();    // stop transmitting
  delay(300);
  return getState();
}

//vals_t readings
void SWI2C::getData(byte *pointer){
  _wire->beginTransmission(addr); // transmit to device
  _wire->write(REG_DATA);              // sends one byte
  _wire->endTransmission();    // stop transmitting
  _wire->requestFrom(addr, (uint8_t)14);
  if(i2cdelay(14)){
    for (int k = 0; k < 14; k++){
		  pointer[k] = (byte) _wire->read();
	  }
  }
}
