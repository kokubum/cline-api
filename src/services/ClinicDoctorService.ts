import { getDay, isBefore, parse } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { AttendingInfo } from "../@types/attendingDay.types";
import { DoctorLine, SimpleDoctor } from "../@types/doctor.types";
import { PatientInLineInfo } from "../@types/line.types";
import { Context } from "../helpers/requestContext";
import { cmpLinePatients, getFilteredLinePatients } from "../helpers/utils";
import { ClinicDoctor, Status, WeekDayEnum } from "../models";

export class ClinicDoctorService {
  async getFormattedDoctorLineFromClinic(ctx:Context, clinicId:string, doctorId:string):Promise<DoctorLine> {
    const clinicDoctor = await ctx.db.clinicDoctorRepository.findDoctorLine(clinicId, doctorId);

    return ClinicDoctorService.formatDoctorLine(clinicDoctor);
  }

  static isAttendingToday(clinicDoctor:ClinicDoctor):AttendingInfo {
    const attendingDay = clinicDoctor.attendingDays.find(day => {
      const currentUTCDate = new Date(Date.now());

      const currentZonedDatetime = utcToZonedTime(currentUTCDate, "America/Sao_Paulo");

      const endAttendingTime = parse(day.end, "HH:mm:ss", currentZonedDatetime);

      const dayNumber = getDay(currentZonedDatetime);
      const isTheDay = Object.values(WeekDayEnum)[dayNumber] === day.weekDay.name;
      const isValidHour = isBefore(currentZonedDatetime, endAttendingTime);
      return isTheDay && isValidHour;
    });

    const onDuty = attendingDay ? attendingDay.onDuty : false;
    const time = attendingDay ? { start: attendingDay.start, end: attendingDay.end } : null;

    return {
      onDuty,
      isAttendingToday: !!attendingDay,
      time
    };
  }

  static formatClinicDoctorsList(clinicDoctors:ClinicDoctor[]):SimpleDoctor[] {
    return clinicDoctors.map<SimpleDoctor>(clinicDoctor => {
      const { isAttendingToday } = ClinicDoctorService.isAttendingToday(clinicDoctor);

      return {
        id: clinicDoctor.doctor.id,
        name: clinicDoctor.doctor.name,
        isAttendingToday,
      };
    });
  }

  static formatDoctorLine(clinicDoctor:ClinicDoctor):DoctorLine {
    const attendingInfo = ClinicDoctorService.isAttendingToday(clinicDoctor);
    const waitingPatients = getFilteredLinePatients(Status.ONHOLD, clinicDoctor.line.linePatients);
    const patientsInLine = waitingPatients.map<PatientInLineInfo>(linePatient => ({
      id: linePatient.patient.id,
      waitingTime: linePatient.waitingTime,
      name: linePatient.patient.name,
      position: linePatient.position
    })).sort(cmpLinePatients);

    return {
      coordinator: {
        id: clinicDoctor.doctor.id,
        name: clinicDoctor.doctor.name,
        ...attendingInfo,
      },
      line: {
        id: clinicDoctor.line.id,
        active: clinicDoctor.line.active,
        length: waitingPatients.length,
        students: patientsInLine
      }
    };
  }
}
