import * as faker from "faker";
import { generate as generateCpf } from "@fnando/cpf";
import { Doctor } from "../../src/models";

export function generateMockDoctor({
  id = faker.datatype.uuid(),
  name = faker.name.title(),
  crm = faker.datatype.number(10000).toString(),
  email = faker.internet.email(),
  document = generateCpf(),
  createdAt = faker.date.past(),
  updatedAt = new Date(),
  clinicDoctors = [],
}):Doctor {
  return {
    id,
    name,
    email,
    crm,
    document,
    createdAt,
    updatedAt,
    clinicDoctors
  };
}
