import { User } from "../models";

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
  confirmPassword: string;
  email: string;
}

export interface SessionInfo {
  sessionId: string;
  user: User;
}


