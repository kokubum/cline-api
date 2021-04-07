import { Request, Response, NextFunction } from "express";
import { Connection, getConnection } from "typeorm";
import { UserRepository } from "../repositories";

export interface Context {
  db: {
    connection: Connection;
    userRepository: UserRepository;
  };
}

function buildContext(): Context {
  const connection = getConnection();
  return {
    db: {
      connection,
      userRepository: connection.getCustomRepository(UserRepository),
    },
  };
}

export function injectCtx(callback: Function) {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.ctx = buildContext();
    callback(req, res, next).catch((error: Error) => next(error));
  };
}
