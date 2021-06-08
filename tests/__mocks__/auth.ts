import * as faker from "faker";
import { generate as generateCpf } from "@fnando/cpf";
import { LoginBody, SignUpBody } from "../../src/@types/auth.types";
import { generateLinkExpireTime } from "../../src/helpers/auth";
import { Token } from "../../src/models";

export function generateMockSignUpBody({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  password = faker.internet.password(10),
  document = generateCpf(),
  email = faker.internet.email(),
  confirm = "",
}): SignUpBody {
  const confirmPassword = confirm === "" ? password : confirm;
  return {
    firstName,
    lastName,
    document,
    password,
    confirmPassword,
    email,
  };
}

export function generateMockLoginBody({
  email = faker.internet.email(),
  password = faker.internet.password(10),
}): LoginBody {
  return {
    email,
    password,
  };
}

export function generateTokenModel(tokenCode: string, expirationDate?: Date): Token {
  return {
    id: faker.datatype.uuid(),
    tokenCode,
    patientId: faker.datatype.uuid(),
    expiresAt: expirationDate ?? generateLinkExpireTime(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
