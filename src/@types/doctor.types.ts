import { TimeInfo } from "./attendingDay.types";
import { BasicLineInfo } from "./line.types";

export interface SimpleDoctor {
  id:string;
  name:string;
  isAttendingToday:boolean;
}

export interface DoctorInfo extends SimpleDoctor{
  onDuty:boolean;
  time:TimeInfo|null;
}


export interface DoctorLine{
  doctor:DoctorInfo,
  line:BasicLineInfo
}