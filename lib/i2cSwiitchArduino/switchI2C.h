/*
 * vcs3i2c.h
 *
 */

#ifndef SWI2C_H_
#define SWI2C_H_

#include <Arduino.h>
#include <Wire.h>

#define  REG_READ    0x01

#define  REG_RES     0x02

#define  REG_SET     0x03

#define REG_ADDR 0x08
#define REG_DATA 0x09

 typedef struct{
	  int16_t holdingRegs[6];
	  uint16_t coils;
  } vals_t;


class SWI2C
{
public:
  SWI2C();
  int init(int address, TwoWire *the_wire);
  int init(int address);
  int setCoils(uint16_t coils);
  int newAddress(byte newAddr);
  int newReading();
  void getData(vals_t readings);
private:
  TwoWire *_wire;
  uint16_t addr;
  int getState();
  int16_t getVal(byte reg);
  int setReg8(byte reg, byte val);
  int setReg(byte reg);
  bool i2cdelay(int size);

};

#endif /* SWI2C_H_ */

