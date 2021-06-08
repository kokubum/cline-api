import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedJWT, SessionInfo, SessionPatient } from "../@types/auth.types";
import { secretKey } from "../config";
import { AppError } from "../helpers/appError";

export async function protect(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const { ctx } = req;

  const rawToken = req.headers.authorization;

  if (!rawToken) {
    throw new AppError("Missing Token", 400);
  }

  const rawTokenArr = rawToken.split(" ");

  const [bearer, token] = rawTokenArr;
  if (rawTokenArr.length !== 2 || !/^Bearer$/iu.test(bearer)) {
    throw new AppError("Misformatted Token", 400);
  }

  let decodedToken: DecodedJWT;

  try {
    decodedToken = jwt.verify(token, secretKey) as DecodedJWT;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Expired Token", 401);
    }

    throw new AppError("Token Error", 401);
  }

  const session = await ctx.db.sessionRepository.getValidSession(decodedToken!.id);
  if (!session) {
    throw new AppError("This Session is no longer active", 401);
  }

  const patient:SessionPatient = await ctx.db.patientRepository.findById(session.patientId);
  delete patient.password;

  const sessionInfo: SessionInfo = {
    sessionId: session.id,
    patient,
  };

  req.ctx.signature = sessionInfo;

  return next();
}
