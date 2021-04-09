import * as faker from "faker";
import { SignUpBody } from "../../src/helpers/validation";

export function generateSignUpBody({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  password = faker.internet.password(),
  email = faker.internet.email(),
}): SignUpBody {
  return {
    firstName,
    lastName,
    password,
    email,
  };
}
