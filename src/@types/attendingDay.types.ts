export interface TimeInfo{
  start:string;
  end:string;
}

export interface AttendingInfo{
  isAttendingToday:boolean;
  onDuty:boolean;
  time:TimeInfo|null;
}
