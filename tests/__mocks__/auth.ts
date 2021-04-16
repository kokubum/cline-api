import * as faker from "faker";
import { SignUpBody } from "../../src/@types/auth.types";

export function generateSignUpBody({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  password = faker.internet.password(10),
  email = faker.internet.email(),
  confirm = "",
}): SignUpBody {
  const confirmPassword = confirm === "" ? password : confirm;
  return {
    firstName,
    lastName,
    password,
    confirmPassword,
    email,
  };
}
