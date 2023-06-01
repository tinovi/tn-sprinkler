
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


export interface Trigger {
  name: string;
  devid: string;
  sensor: string;
  switchName: string;
  coil: number;
  weekDays: boolean[];
  hours: boolean[];
  onVal: number;
  offVal: number;
  onTimeMinute: number;
  maxTimeSec: number;
  lastOnTime: number;
}

export interface Switch {
  name: string;
  coils: boolean[];
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

