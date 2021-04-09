import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { checkForRegisteredUser } from "../helpers/services";
import { capitalizeName } from "../helpers/utils";
import {
  formatFields,
  SignUpBody,
  validateEmail,
  validateRequiredFields,
  validateSingleName,
} from "../helpers/validation";

export async function signup(req: Request, res: Response) {
  const { ctx } = req;
  const requiredFields = ["firstName", "lastName", "password", "email"];

  const formattedFields = formatFields(req.body);

  validateRequiredFields(formattedFields, requiredFields);

  const {
    email,
    password,
    firstName,
    lastName,
  } = formattedFields as SignUpBody;

  validateEmail(email);
  validateSingleName(formattedFields, "firstName", "lastName");

  await checkForRegisteredUser(ctx, email);

  const hashPassword = await bcrypt.hash(password, 12);
  const user = await ctx.db.userRepository.save({
    email,
    password: hashPassword,
    firstName: capitalizeName(firstName),
    lastName: capitalizeName(lastName),
  });

  res.status(201).send({
    status: "success",
    data: {
      id: user.id,
    },
  });
}
