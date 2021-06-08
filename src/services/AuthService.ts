import { randomBytes, randomInt } from "crypto";
import { addDays, addMinutes } from "date-fns";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { expiresDays, jwtExpirationTime, linkExpirationTime, secretKey } from "../config";
import { AppError } from "../helpers/appError";
import { Context } from "../helpers/requestContext";
import { Patient, Session, Token } from "../models";
import { SignUpBody } from "../@types/auth.types";
import { capitalizeName } from "../helpers/utils";

export class AuthService {
  async checkLoginCredentials(ctx:Context, email: string, password: string): Promise<Patient> {
    const patient = await ctx.db.patientRepository.findByEmail(email);

    if (!patient || !(await bcrypt.compare(password, patient.password))) {
      throw new AppError("Invalid credentials", 401);
    }

    return patient;
  }

  async registerPatient(ctx:Context, patient: SignUpBody): Promise<Patient> {
    const password = await AuthService.hashPassword(patient.password);
    return ctx.db.patientRepository.save({
      email: patient.email,
      document: patient.document,
      password,
      firstName: capitalizeName(patient.firstName),
      lastName: capitalizeName(patient.lastName),
    });
  }

  async saveToken(ctx:Context, patientId:string):Promise<Token> {
    const tokenCode = AuthService.generateTokenCode();

    return ctx.db.tokenRepository.save({
      tokenCode,
      patientId,
      expiresAt: AuthService.generateLinkExpireTime(),
    });
  }

  async createSession(ctx:Context, patientId: string): Promise<Session> {
    const sessionId = uuidV4();
    const token = await AuthService.generateJwt(sessionId);

    return ctx.db.sessionRepository.save({
      patientId,
      id: sessionId,
      token,
      expiresAt: AuthService.generateSessionExpireTime(),
    });
  }

  checkTokenExpiration(token: Token): void {
    const currentDate = new Date(Date.now());

    if (currentDate > token.expiresAt) {
      throw new AppError("Token has expired", 401);
    }
  }

  static async generateJwt(sessionId: string): Promise<string> {
    return jwt.sign({ id: sessionId }, secretKey, {
      expiresIn: jwtExpirationTime,
    });
  }

  static generateTokenCode():string {
    return randomBytes(32).toString("hex");
  }

  static generateSessionExpireTime(): Date {
    return addDays(new Date(Date.now()), expiresDays);
  }

  static generateLinkExpireTime(): Date {
    return addMinutes(new Date(Date.now()), linkExpirationTime);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static generateRandomCode(): string {
    return randomInt(0, 999999).toString().padStart(6, "0");
  }
}
