import { Patient } from "../models";

export interface ReqFields {
  [field: string]: any;
}

export interface EmailBody {
  email: string;
}

export interface RecoverPasswordBody {
  password: string;
  confirmPassword: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignUpBody {
  firstName: string;
  lastName: string;
  password: string;
  document:string;
  confirmPassword: string;
  email: string;
}

export interface SessionPatient extends Omit<Patient,"password">{
  password?:string;
}

export interface SessionInfo {
  sessionId: string;
  patient: SessionPatient;
}


