import { Connection, getConnection } from "typeorm";
import { SessionInfo } from "../@types/auth.types";
import { UserRepository, ClinicRepository, DoctorRepository, LineRepository, SessionRepository, TokenRepository } from "../repositories";
import { AttendingDayRepository } from "../repositories/health/AttendingDayRepository";
import { ClinicDoctorRepository } from "../repositories/health/ClinicDoctorRepository";
import { LinePatientRepository } from "../repositories/health/LinePatientRepository";
import { PatientRepository } from "../repositories/health/PatientRepository";
import { EmailService, ValidateService, ClinicService } from "../services";

export interface Context {
  db: {
    connection: Connection;
    userRepository: UserRepository;
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

    const db = {
      connection,
      userRepository: connection.getCustomRepository(UserRepository),
      sessionRepository: connection.getCustomRepository(SessionRepository),
      tokenRepository: connection.getCustomRepository(TokenRepository),
      clinicRepository: connection.getCustomRepository(ClinicRepository),
      doctorRepository: connection.getCustomRepository(DoctorRepository),
      lineRepository: connection.getCustomRepository(LineRepository),
      patientRepository: connection.getCustomRepository(PatientRepository),
      clinicDoctorRepository: connection.getCustomRepository(ClinicDoctorRepository),
      linePatientRepository: connection.getCustomRepository(LinePatientRepository),
      attendingDayRepository: connection.getCustomRepository(AttendingDayRepository)

    };

    const services = {
      emailService: new EmailService(),
      validateService: new ValidateService(),
      clinicService: new ClinicService(db.clinicRepository, db.clinicDoctorRepository),
    };

    return {
      db,
      services,
    };
  }
}
