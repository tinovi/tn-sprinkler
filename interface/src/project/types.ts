
export interface DerviceInfoList {
  devices: DerviceInfo[];
}

export interface DerviceInfo {
  rssi: number;
  bat: number;
  time: number;
  devid: string;
  data: object;
}


export interface Trigger {
  name: string;
  sensEui: number;
  switchName: string;
  coil: number;
  weekDays: number;
  onVal: number;
  offVal: number;
  onTimeHour: number;
  onTimeMinute: number;
  onTimeWkDay: number;
  maxTimeSec: number;
  onTime: number;
}

export interface Switch {
  name: string;
  coils: number;
  type: number;
  address: number;
}

export interface SprinklerSettings {
  url: string;
  auth: string;
  triggers: Trigger[];
  switches: Switch[];
}

