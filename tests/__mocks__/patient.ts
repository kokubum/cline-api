import * as faker from "faker";
import { generate as generateCpf } from "@fnando/cpf";
import { Patient } from "../../src/models";

export function generateMockPatient({
  id = faker.datatype.uuid(),
  name = faker.name.title(),
  email = faker.internet.email(),
  document = generateCpf(),
  planNumber = faker.datatype.number(10000).toString(),
  createdAt = faker.date.past(),
  updatedAt = new Date(),

}):Patient {
  return {
    id,
    name,
    email,
    document,
    planNumber,
    createdAt,
    updatedAt
  };
}
