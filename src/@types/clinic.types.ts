import { SimpleDoctor } from "./doctor.types";

export interface SimpleClinic {
  id:string;
  name:string;
  isAttendingToday:boolean;
}


export interface ClinicInfo{
  id:string;
  name:string;
  phone:string;
  address:string;
}

export interface ClinicWithDoctors{
  clinic:ClinicInfo;
  doctors:SimpleDoctor[];
}

export interface SearchBody{
  search:string;
}