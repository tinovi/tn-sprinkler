
export interface DerviceInfoList {
  devices: DerviceInfo[];
}

export interface DerviceInfo {
  devid: string;
  rssi: number;
  bat: number;
  time: number;
  data: object;
}


export interface TriggerCondition {
  devid: string;
  sensor: string;
  onVal: number;
  offVal: number;
}

export interface Trigger {
  name: string;
  switchName: string;
  coil: number;
  weekDays: boolean[];
  hours: boolean[];
  onTimeMinute: number;
  maxTimeSec: number;
  lastOnTime: number;
  conditions: TriggerCondition[];
}

export interface Switch {
  name: string;
  coils: boolean[];
  coilsCount: number;
  type: number;
  address: number;
  seconds: number;
  lastReadTime: number;
}

export interface SwitchType {
  type: number;
  name: string;
  coils: number;
  address: number;
}

export interface SprinklerSettings {
  url: string;
  auth: string;
  triggers: Trigger[];
  switches: Switch[];
  switchTypes: Switch[];
}

