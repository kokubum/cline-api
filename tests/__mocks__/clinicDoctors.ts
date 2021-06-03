import * as faker from "faker";
import { Clinic, ClinicDoctor, Doctor } from "../../src/models";
import { generateMockClinic } from "./clinic";
import { generateMockDoctor } from "./doctor";

import { generateMockLine } from "./line";

export function generateMockClinicDoctor({
  id = faker.datatype.uuid(),
  avgAttendingTime = null as string|null,
  attendingDays = [],
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setAvgAttendingTime = jest.fn(),
  line = generateMockLine({}),
}, doctor:Doctor, clinic:Clinic):ClinicDoctor {
  return {
    id,
    avgAttendingTime,
    clinic,
    doctor,
    attendingDays,
    line,
    setAvgAttendingTime,
  };
}

export function generateMockClinicDoctorList({ count = 1 }):ClinicDoctor[] {
  const clinicDoctorsList:ClinicDoctor[] = [];
  for (let i = 0; i < count; i++) {
    const clinic = generateMockClinic({});
    const doctor = generateMockDoctor({});
    clinicDoctorsList.push(
      generateMockClinicDoctor({}, doctor, clinic)
    );
  }

  return clinicDoctorsList;
}
