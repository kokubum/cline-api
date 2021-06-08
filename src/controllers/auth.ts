import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { EmailBody, LoginBody, RecoverPasswordBody, SignUpBody } from "../@types/auth.types";

import { AppError } from "../helpers/appError";

import { Session } from "../models";

export async function signup(req: Request, res: Response) {
  const { ctx } = req;

  const requiredFields = ["firstName", "lastName", "password", "confirmPassword", "email", "document"];
  const validBody = ctx.services.validateService.requestBody<SignUpBody>(req.body, requiredFields);

  ctx.services.validateService.confirmPasswordEquality(validBody.confirmPassword, validBody.password);

  await ctx.db.patientRepository.checkForRegisteredPatient(validBody.email);

  const patient = await ctx.services.authService.registerPatient(ctx, validBody);

  const token = await ctx.services.authService.saveToken(ctx, patient.id);

  ctx.services.emailService.sendEmailLink(patient.email, token.tokenCode, patient.firstName, "activation");

  return res.status(201).json({
    status: "success",
    data: {
      id: patient.id,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { ctx } = req;

  const requiredFields = ["email", "password"];

  const validBody = ctx.services.validateService.requestBody<LoginBody>(req.body, requiredFields);

  const patient = await ctx.services.authService.checkLoginCredentials(ctx, validBody.email, validBody.password);

  if (!patient.active) {
    throw new AppError("This account is not activated yet", 403);
  }

  const session = await ctx.services.authService.createSession(ctx, patient.id);

  return res.status(200).json({
    status: "success",
    data: {
      token: session.token,
    },
  });
}

export async function activateAccount(req: Request, res: Response) {
  const { ctx } = req;
  const tokenCode = req.params.token;

  const token = await ctx.db.tokenRepository.findTokenByCode(tokenCode);

  ctx.services.authService.checkTokenExpiration(token);

  const patient = await ctx.db.patientRepository.findById(token.patientId);

  patient.active = true;
  await ctx.db.patientRepository.save(patient);

  await ctx.db.tokenRepository.remove(token);

  return res.status(200).json({
    status: "success",
    data: null,
  });
}

export async function sendActivationLink(req: Request, res: Response) {
  const { ctx } = req;
  const validBody = ctx.services.validateService.requestBody<EmailBody>(req.body, ["email"]);

  const patient = await ctx.db.patientRepository.findRegisteredPatient(validBody.email);

  if (patient.active) {
    throw new AppError("This email is already active", 400);
  }

  await ctx.db.tokenRepository.removeExistingTokenIfExists(patient.id);

  const token = await ctx.services.authService.saveToken(ctx, patient.id);

  ctx.services.emailService.sendEmailLink(patient.email, token.tokenCode, patient.firstName, "activation");

  return res.status(200).json({
    status: "success",
    data: null,
  });
}

export async function sendRecoverPasswordLink(req: Request, res: Response) {
  const { ctx } = req;

  const validBody = ctx.services.validateService.requestBody<EmailBody>(req.body, ["email"]);

  const patient = await ctx.db.patientRepository.findByEmail(validBody.email);

  if (patient && patient.active) {
    await ctx.db.tokenRepository.removeExistingTokenIfExists(patient.id);

    const token = await ctx.services.authService.saveToken(ctx, patient.id);

    ctx.services.emailService.sendEmailLink(patient.email, token.tokenCode, patient.firstName, "recovery");
  }

  return res.status(200).json({
    status: "success",
    data: null,
  });
}

export async function verifyRecoverPasswordLink(req: Request, res: Response) {
  const { ctx } = req;
  const tokenCode = req.params.token;

  const token = await ctx.db.tokenRepository.findTokenByCode(tokenCode);
  ctx.services.authService.checkTokenExpiration(token);

  await ctx.db.patientRepository.findById(token.patientId);

  return res.status(200).json({
    status: "success",
    data: null,
  });
}

export async function recoverPassword(req: Request, res: Response) {
  const { ctx } = req;
  const tokenCode = req.params.token;

  const token = await ctx.db.tokenRepository.findTokenByCode(tokenCode);

  ctx.services.authService.checkTokenExpiration(token);
  const user = await ctx.db.patientRepository.findById(token.patientId);

  const requiredFields = ["password", "confirmPassword"];
  const validBody = ctx.services.validateService.requestBody<RecoverPasswordBody>(req.body, requiredFields);
  ctx.services.validateService.confirmPasswordEquality(validBody.confirmPassword, validBody.password);

  user.password = await bcrypt.hash(validBody.password, 12);
  await ctx.db.patientRepository.save(user);
  await ctx.db.tokenRepository.remove(token);

  return res.status(200).json({
    status: "success",
    data: null,
  });
}

export async function logout(req: Request, res: Response) {
  const { ctx } = req;

  const session = await ctx.db.sessionRepository.getValidSession(ctx.signature!.sessionId) as Session;

  session.active = false;
  await ctx.db.sessionRepository.save(session);

  return res.status(200).json({
    status: "success",
    data: null,
  });
}
