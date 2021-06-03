import * as faker from "faker";
import { Clinic } from "../../src/models";

export function generateMockClinic({
  id = faker.datatype.uuid(),
  name = faker.name.title(),
  phone = faker.phone.phoneNumber("+51(##)# #### ####"),
  address = faker.address.streetName(),
  createdAt = faker.date.past(),
  updatedAt = new Date(),
  clinicDoctors = [],
}):Clinic {
  return {
    id,
    name,
    phone,
    address,
    createdAt,
    updatedAt,
    clinicDoctors
  };
}
