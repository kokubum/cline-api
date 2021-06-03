import { LinePatient } from "../models";

export interface PatientInLineInfo {
  id:string;
  position:number;
  waitingTime:string|null;
  name:string;
} 

export interface BasicLineInfo{
  id:string;
  active:boolean;
  length:number;
  patients:PatientInLineInfo[];
}

export interface GetInLineBody {
  patientId:string;
}

export interface AttendPatientInLineBody {
  doctorId:string;
}

export interface FinishAttendment{
  linePatientId:string;
  doctorId:string;
}

export interface CalledPatient {
  linePatientId:string;
  patientId:string;
  patientName:string;
}