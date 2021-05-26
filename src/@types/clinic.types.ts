import { SimpleDoctor } from "./doctor.types";

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