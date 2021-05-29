import { SimpleClinic } from "../@types/clinic.types";
import { DoctorInfo, DoctorWithClinics } from "../@types/doctor.types";
import { ClinicDoctor, Doctor } from "../models";
import { DoctorRepository } from "../repositories";
import { ClinicDoctorService } from "./ClinicDoctorService";

export class DoctorService {
  private readonly doctorRepo:DoctorRepository;

  constructor(doctorRepo:DoctorRepository) {
    this.doctorRepo = doctorRepo;
  }

  async getFormattedDoctorWithClinics(doctorId:string):Promise<DoctorWithClinics> {
    const doctor = await this.doctorRepo.findDoctorClinics(doctorId);

    const doctorInfo = DoctorService.formatDoctorInfo(doctor);
    const clinicList = DoctorService.formatClinicList(doctor.clinicDoctors);

    return {
      doctor: doctorInfo,
      clinics: clinicList
    };
  }

  static formatClinicList(clinicDoctors:ClinicDoctor[]):SimpleClinic[] {
    return clinicDoctors.map<SimpleClinic>(clinicDoctor => {
      const { isAttendingToday } = ClinicDoctorService.isAttendingToday(clinicDoctor);

      return {
        id: clinicDoctor.clinic.id,
        name: clinicDoctor.clinic.name,
        isAttendingToday,
      };
    });
  }

  static formatDoctorInfo(doctor:Doctor):DoctorInfo {
    return {
      id: doctor.id,
      name: doctor.name,
      crm: doctor.crm
    };
  }
}
