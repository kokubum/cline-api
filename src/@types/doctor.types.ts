import { TimeInfo } from "./attendingDay.types";
import { SimpleClinic } from "./clinic.types";
import { BasicLineInfo } from "./line.types";

export interface SimpleDoctor {
  id:string;
  name:string;
  isAttendingToday:boolean;
}

export interface BaseDoctor extends SimpleDoctor{
  onDuty:boolean;
  time:TimeInfo|null;
}

export interface DoctorInfo{
  id:string;
  name:string;
  crm:string;  
}

export interface DoctorWithClinics {
  coordinator:DoctorInfo;
  universities:SimpleClinic[];
}


export interface DoctorLine{
  coordinator:BaseDoctor,
  line:BasicLineInfo
}