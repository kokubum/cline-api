import { Connection, getConnection } from "typeorm";
import { SessionInfo } from "../@types/auth.types";
import { AttendingDayRepository, ClinicDoctorRepository, ClinicRepository, DoctorRepository, LinePatientRepository, LineRepository, PatientRepository, SessionRepository, TokenRepository } from "../repositories";

import { EmailService, ValidateService, ClinicService, ClinicDoctorService, DoctorService, LineService, LinePatientService, AuthService } from "../services";

export interface Context {
  db: {
    connection: Connection;
    sessionRepository: SessionRepository;
    tokenRepository: TokenRepository;
    clinicRepository: ClinicRepository;
    doctorRepository: DoctorRepository;
    lineRepository: LineRepository;
    patientRepository: PatientRepository;
    linePatientRepository: LinePatientRepository;
    clinicDoctorRepository: ClinicDoctorRepository;
    attendingDayRepository: AttendingDayRepository;
  };
  services: {
    emailService: EmailService;
    validateService: ValidateService;
    clinicService: ClinicService;
    clinicDoctorService:ClinicDoctorService;
    doctorService:DoctorService;
    lineService:LineService;
    linePatientService:LinePatientService;
    authService:AuthService
  };
  signature?: SessionInfo;
}

export class RequestContext {
  private static instance:Context;

  public static getInstance():Context {
    if (!RequestContext.instance) {
      RequestContext.instance = RequestContext.buildContext();
    }
    return RequestContext.instance;
  }

  private static buildContext(): Context {
    const connection = getConnection();

    return {
      db: {
        connection,
        sessionRepository: connection.getCustomRepository(SessionRepository),
        tokenRepository: connection.getCustomRepository(TokenRepository),
        clinicRepository: connection.getCustomRepository(ClinicRepository),
        doctorRepository: connection.getCustomRepository(DoctorRepository),
        lineRepository: connection.getCustomRepository(LineRepository),
        patientRepository: connection.getCustomRepository(PatientRepository),
        clinicDoctorRepository: connection.getCustomRepository(ClinicDoctorRepository),
        linePatientRepository: connection.getCustomRepository(LinePatientRepository),
        attendingDayRepository: connection.getCustomRepository(AttendingDayRepository)

      },
      services: {
        emailService: new EmailService(),
        validateService: new ValidateService(),
        clinicService: new ClinicService(),
        clinicDoctorService: new ClinicDoctorService(),
        doctorService: new DoctorService(),
        lineService: new LineService(),
        linePatientService: new LinePatientService(),
        authService: new AuthService(),
      },
    };
  }
}
