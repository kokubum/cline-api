import * as faker from "faker";
import { AttendingDay, ClinicDoctor, WeekDayEnum } from "../../src/models";

export function generateMockAttendingDays({ count = 1, clinicDoctor = {} as ClinicDoctor }):AttendingDay[] {
  const attendingDays:AttendingDay[] = [];

  for (let i = 0; i < count; i++) {
    attendingDays.push({
      id: faker.datatype.uuid(),
      start: "09:00:00",
      end: "18:00:00",
      onDuty: false,
      weekDay: {
        id: faker.datatype.uuid(),
        name: Object.values(WeekDayEnum)[i % 7]
      },
      clinicDoctor
    });
  }

  return attendingDays;
}
