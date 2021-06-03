import * as faker from "faker";
import { Line, LinePatient, Status } from "../../src/models";
import { generateMockPatient } from "./patient";

export function generateMockLinePatient({

  id = faker.datatype.uuid(),
  waitingTime = null,
  totalWaitingTime = null,
  patient = generateMockPatient({}),
  line = {} as Line,
  status = Status.ONHOLD,
  createdAt = faker.date.past(),
  updatedAt = new Date(),
  setTotalWaitingTime = jest.fn(),

}, position:number):LinePatient {
  return {
    id,
    position,
    waitingTime,
    totalWaitingTime,
    patient,
    line,
    status,
    createdAt,
    updatedAt,
    setTotalWaitingTime,
  };
}

export function generateMockLinePatientList({ count = 1 }):LinePatient[] {
  const linePatients:LinePatient[] = [];

  for (let i = 0; i < count; i++) {
    linePatients.push(generateMockLinePatient({}, i + 1));
  }

  return linePatients;
}
