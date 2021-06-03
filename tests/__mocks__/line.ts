import * as faker from "faker";
import { ClinicDoctor, Line } from "../../src/models";

export function generateMockLine({
  id = faker.datatype.uuid(),
  active = true,
  clinicDoctor = {} as ClinicDoctor,
  createdAt = faker.date.past(),
  updatedAt = new Date(),
  linePatients = []
}):Line {
  return {
    id,
    active,
    clinicDoctor,
    createdAt,
    updatedAt,
    linePatients
  };
}
