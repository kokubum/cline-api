import { Connection, getConnection } from "typeorm";
import { SessionInfo } from "../@types/auth.types";
import { UserRepository, ClinicRepository, DoctorRepository, LineRepository, SessionRepository, TokenRepository } from "../repositories";
import { EmailService, ValidateService } from "../services";

export interface Context {
  db: {
    connection: Connection;
    userRepository: UserRepository;
    sessionRepository: SessionRepository;
    tokenRepository: TokenRepository;
    clinicRepository: ClinicRepository;
    doctorRepository: DoctorRepository;
    lineRepository: LineRepository;
  };
  services: {
    emailService: EmailService;
    validateService: ValidateService;
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
        userRepository: connection.getCustomRepository(UserRepository),
        sessionRepository: connection.getCustomRepository(SessionRepository),
        tokenRepository: connection.getCustomRepository(TokenRepository),
        clinicRepository: connection.getCustomRepository(ClinicRepository),
        doctorRepository: connection.getCustomRepository(DoctorRepository),
        lineRepository: connection.getCustomRepository(LineRepository),
      },
      services: {
        emailService: new EmailService(),
        validateService: new ValidateService(),
      },
    };
  }
}
