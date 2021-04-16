import { Request, Response, NextFunction } from "express";
import { Connection, getConnection } from "typeorm";
import { UserRepository } from "../repositories";
import { SessionRepository } from "../repositories/SessionRepository";
import { TokenRepository } from "../repositories/TokenRepository";
import { EmailService, ValidateService } from "../services";

export interface Context {
  db: {
    connection: Connection;
    userRepository: UserRepository;
    sessionRepository: SessionRepository;
    tokenRepository: TokenRepository;
  };
  services: {
    emailService: EmailService;
    validateService: ValidateService;
  };
}

export function buildContext(): Context {
  const connection = getConnection();
  return {
    db: {
      connection,
      userRepository: connection.getCustomRepository(UserRepository),
      sessionRepository: connection.getCustomRepository(SessionRepository),
      tokenRepository: connection.getCustomRepository(TokenRepository),
    },
    services: {
      emailService: new EmailService(),
      validateService: new ValidateService(),
    },
  };
}

export function injectCtx(callback: Function) {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.ctx = buildContext();
    callback(req, res, next).catch((error: Error) => next(error));
  };
}
