import { randomBytes, randomInt } from "crypto";
import { addDays, addMinutes } from "date-fns";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { expiresDays, jwtExpirationTime, linkExpirationTime, secretKey } from "../config";
import { AppError } from "./appError";
import { Token } from "../models";

export interface DecodedJWT {
  id: string;
  iat: number;
  exp: number;
}

export function generateRandomCode(): string {
  return randomInt(0, 999999).toString().padStart(6, "0");
}

export function generateTokenCode(): string {
  return randomBytes(32).toString("hex");
}

export function generateLinkExpireTime(): Date {
  return addMinutes(new Date(Date.now()), linkExpirationTime);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function generateJwt(sessionId: string): Promise<string> {
  return jwt.sign({ id: sessionId }, secretKey, {
    expiresIn: jwtExpirationTime,
  });
}

export function generateSessionExpireTime(): Date {
  return addDays(new Date(Date.now()), expiresDays);
}

export function checkTokenExpiration(token: Token): void {
  const currentDate = new Date(Date.now());

  if (currentDate > token.expiresAt) {
    throw new AppError("Token has expired", 401);
  }
}
