import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { EmailBody, LoginBody, RecoverPasswordBody, SignUpBody } from "../@types/auth.types";
import { AppError } from "../helpers/appError";
import { checkTokenExpiration } from "../helpers/auth";

export async function signup(req: Request, res: Response) {
  const { ctx } = req;

  const requiredFields = ["firstName", "lastName", "password", "confirmPassword", "email"];
  const validBody = ctx.services.validateService.requestBody<SignUpBody>(req.body, requiredFields);

  ctx.services.validateService.confirmPasswordEquality(validBody.confirmPassword, validBody.password);

  await ctx.db.userRepository.checkForRegisteredUser(validBody.email);

  const user = await ctx.db.userRepository.registerUser(validBody);

  const token = await ctx.db.tokenRepository.saveToken(user.id);

  ctx.services.emailService.sendEmailLink(user.email, token.tokenCode, user.firstName, "activation");

  return res.status(201).send({
    status: "success",
    data: {
      id: user.id,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { ctx } = req;

  const requiredFields = ["email", "password"];

  const validBody = ctx.services.validateService.requestBody<LoginBody>(req.body, requiredFields);

  const user = await ctx.db.userRepository.checkLoginCredentials(validBody.email, validBody.password);

  if (!user.active) {
    throw new AppError("This account is not activated yet", 403);
  }

  const session = await ctx.db.sessionRepository.createSession(user.id);

  return res.status(200).send({
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

  checkTokenExpiration(token);

  const user = await ctx.db.userRepository.findById(token.userId);

  user.active = true;
  await ctx.db.userRepository.save(user);

  await ctx.db.tokenRepository.remove(token);

  return res.status(200).send({
    status: "success",
    data: null,
  });
}

export async function sendActivationLink(req: Request, res: Response) {
  const { ctx } = req;
  const validBody = ctx.services.validateService.requestBody<EmailBody>(req.body, ["email"]);

  const user = await ctx.db.userRepository.checkForUnregisteredUser(validBody.email);

  if (user.active) {
    throw new AppError("This email is already active", 400);
  }

  await ctx.db.tokenRepository.removeExistingTokenIfExists(user.id);

  const token = await ctx.db.tokenRepository.saveToken(user.id);

  ctx.services.emailService.sendEmailLink(user.email, token.tokenCode, user.firstName, "activation");

  return res.status(200).send({
    status: "success",
    data: null,
  });
}

export async function sendRecoverPasswordLink(req: Request, res: Response) {
  const { ctx } = req;

  const validBody = ctx.services.validateService.requestBody<EmailBody>(req.body, ["email"]);

  const user = await ctx.db.userRepository.findByEmail(validBody.email);

  if (user && user.active) {
    await ctx.db.tokenRepository.removeExistingTokenIfExists(user.id);

    const token = await ctx.db.tokenRepository.saveToken(user.id);

    ctx.services.emailService.sendEmailLink(user.email, token.tokenCode, user.firstName, "recovery");
  }

  return res.status(200).send({
    status: "success",
    data: null,
  });
}

export async function verifyRecoverPasswordLink(req: Request, res: Response) {
  const { ctx } = req;
  const tokenCode = req.params.token;

  const token = await ctx.db.tokenRepository.findTokenByCode(tokenCode);
  checkTokenExpiration(token);

  await ctx.db.userRepository.findById(token.userId);

  return res.status(200).send({
    status: "success",
    data: null,
  });
}

export async function recoverPassword(req: Request, res: Response) {
  const { ctx } = req;
  const tokenCode = req.params.token;

  const token = await ctx.db.tokenRepository.findTokenByCode(tokenCode);

  checkTokenExpiration(token);
  const user = await ctx.db.userRepository.findById(token.userId);

  const requiredFields = ["password", "confirmPassword"];
  const validBody = ctx.services.validateService.requestBody<RecoverPasswordBody>(req.body, requiredFields);
  ctx.services.validateService.confirmPasswordEquality(validBody.confirmPassword, validBody.password);

  user.password = await bcrypt.hash(validBody.password, 12);
  await ctx.db.userRepository.save(user);
  await ctx.db.tokenRepository.remove(token);

  return res.status(200).send({
    status: "success",
    data: null,
  });
}

export async function logout(req: Request, res: Response) {
  const { ctx } = req;

  const session = await ctx.db.sessionRepository.getValidSession(ctx.signature!.sessionId);

  session!.active = false;

  return res.status(200).send({
    status: "success",
    data: null,
  });
}
