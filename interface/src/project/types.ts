
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
  switchNum: number;
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

export interface TriggerSettings {
  url: string;
  auth: string;
  triggers: Trigger[];
}

