import { getDay, isBefore, parse } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { AttendingInfo } from "../@types/attendingDay.types";
import { ClinicInfo, ClinicWithDoctors } from "../@types/clinic.types";
import { DoctorLine, SimpleDoctor } from "../@types/doctor.types";
import { AttendingDay, Clinic, ClinicDoctor, WeekDayEnum } from "../models";
import { ClinicRepository } from "../repositories";
import { ClinicDoctorRepository } from "../repositories/health/ClinicDoctorRepository";

export class ClinicService {
  private readonly clinicRepo:ClinicRepository;

  private readonly clinicDoctorRepo:ClinicDoctorRepository;

  constructor(clinicRepo:ClinicRepository, clinicDoctorRepo:ClinicDoctorRepository) {
    this.clinicRepo = clinicRepo;
    this.clinicDoctorRepo = clinicDoctorRepo;
  }

  async getFormattedClinicWithDoctors(clinicId:string):Promise<ClinicWithDoctors> {
    const clinic = await this.clinicRepo.findClinicWithDoctors(clinicId);
    const formattedDoctors = this.formatClinicDoctorsList(clinic.clinicDoctors);
    const formattedClinicInfo = this.formatClinicInfo(clinic);
    return {
      clinic: formattedClinicInfo,
      doctors: formattedDoctors
    };
  }

  async getFormattedDoctorsListFromClinic(clinicId:string, filter:string):Promise<SimpleDoctor[]> {
    const clinicDoctors = await this.clinicDoctorRepo.findDoctorsFromClinic(clinicId, filter);

    return this.formatClinicDoctorsList(clinicDoctors);
  }

  async getFormattedDoctorLineFromClinic(clinicId:string, doctorId:string):Promise<DoctorLine> {
    const clinicDoctor = await this.clinicDoctorRepo.findDoctorLine(clinicId, doctorId);

    return this.formatDoctorLine(clinicDoctor);
  }

  isAttendingToday(attendingDays:AttendingDay[]):AttendingInfo {
    const attendingDay = attendingDays.find(day => {
      const currentUTCDate = new Date(Date.now());

      const currentZonedDatetime = utcToZonedTime(currentUTCDate, "America/Sao_Paulo");
      const endAttendingTime = parse(day.end, "HH:mm:SS", currentZonedDatetime);
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

  formatDoctorLine(clinicDoctor:ClinicDoctor):DoctorLine {
    const attendingInfo = this.isAttendingToday(clinicDoctor.attendingDays);
    return {
      doctor: {
        id: clinicDoctor.doctor.id,
        name: clinicDoctor.doctor.name,
        ...attendingInfo,
      },
      line: {
        active: clinicDoctor.line.active,
        patients: clinicDoctor.line.linePatients
      }
    };
  }

  formatClinicDoctorsList(clinicDoctors:ClinicDoctor[]):SimpleDoctor[] {
    return clinicDoctors.map<SimpleDoctor>(clinicDoctor => {
      const { isAttendingToday } = this.isAttendingToday(clinicDoctor.attendingDays);

      return {
        id: clinicDoctor.doctor.id,
        name: clinicDoctor.doctor.name,
        isAttendingToday,
      };
    });
  }

  formatClinicInfo(clinic:Clinic):ClinicInfo {
    return {
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone
    };
  }
}
