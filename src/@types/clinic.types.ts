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
  university:ClinicInfo;
  coordinators:SimpleDoctor[];
}

export interface SearchBody{
  search:string;
}