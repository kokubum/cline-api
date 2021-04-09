import * as faker from "faker";
import { SignUpBody } from "../../src/helpers/validation";

export function generateSignUpBody({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  password = faker.internet.password(10),
  email = faker.internet.email(),
}): SignUpBody {
  return {
    firstName,
    lastName,
    password,
    email,
  };
}
