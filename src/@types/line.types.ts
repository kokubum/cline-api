
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
  students:PatientInLineInfo[];
}

export interface GetInLineBody {
  studentId:string;
}

export interface AttendPatientInLineBody {
  coordinatorId:string;
}

export interface FinishAttendment{
  lineStudentId:string;
  coordinatorId:string;
}

export interface CalledPatient {
  lineStudentId:string;
  studentId:string;
  studentName:string;
}