import { addHours, addMinutes, addSeconds, format, parse } from "date-fns";
import { LinePatient } from "../models";

export class LinePatientService {
  static setWaitingTime(avgAttendingTime:string|null, linePatients:LinePatient[]):string|null {
    if (linePatients.length !== 0) {
      const linePatient = linePatients[linePatients.length - 1];
      if (linePatient.waitingTime && avgAttendingTime) {
        const currentDate = new Date(Date.now());
        const lastPatientWaitingTime = parse(linePatient.waitingTime, "HH:mm:ss", currentDate);
        const [hours, minutes, seconds] = avgAttendingTime.split(":");

        const finalWaitingTime = addSeconds(
          addMinutes(
            addHours(lastPatientWaitingTime, parseInt(hours, 10)),
            parseInt(minutes, 10)
          ),
          parseInt(seconds, 10)
        );

        return format(finalWaitingTime, "HH:mm:ss");
      }
    }

    return avgAttendingTime;
  }
}
