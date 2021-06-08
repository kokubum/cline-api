import * as faker from "faker";
import { generate as generateCpf } from "@fnando/cpf";
import { Patient } from "../../src/models";

export function generateMockPatient({
  id = faker.datatype.uuid(),
  firstName = faker.name.findName(),
  lastName = faker.name.lastName(),
  email = faker.internet.email(),
  active = true,
  password = faker.internet.password(),
  document = generateCpf(),
  planNumber = faker.datatype.number(10000).toString(),
  createdAt = faker.date.past(),
  updatedAt = new Date(),

}):Patient {
  return {
    id,
    firstName,
    lastName,
    password,
    email,
    document,
    active,
    planNumber,
    createdAt,
    updatedAt
  };
}
