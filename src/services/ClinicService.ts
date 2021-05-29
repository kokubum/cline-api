import { ClinicInfo, ClinicWithDoctors } from "../@types/clinic.types";
import { SimpleDoctor } from "../@types/doctor.types";
import { Clinic, ClinicDoctor } from "../models";
import { ClinicRepository } from "../repositories";
import { ClinicDoctorRepository } from "../repositories/health/ClinicDoctorRepository";
import { ClinicDoctorService } from "./ClinicDoctorService";

export class ClinicService {
  private readonly clinicRepo:ClinicRepository;

  private readonly clinicDoctorRepo:ClinicDoctorRepository;

  constructor(clinicRepo:ClinicRepository, clinicDoctorRepo:ClinicDoctorRepository) {
    this.clinicRepo = clinicRepo;
    this.clinicDoctorRepo = clinicDoctorRepo;
  }

  async getFormattedClinicWithDoctors(clinicId:string):Promise<ClinicWithDoctors> {
    const clinic = await this.clinicRepo.findClinicWithDoctors(clinicId);
    const formattedDoctors = ClinicService.formatDoctorsList(clinic.clinicDoctors);
    const formattedClinicInfo = ClinicService.formatClinicInfo(clinic);
    return {
      clinic: formattedClinicInfo,
      doctors: formattedDoctors
    };
  }

  async getFormattedDoctorsListFromClinic(clinicId:string, filter:string):Promise<SimpleDoctor[]> {
    const clinicDoctors = await this.clinicDoctorRepo.findDoctorsFromClinic(clinicId, filter);

    return ClinicService.formatDoctorsList(clinicDoctors);
  }

  static formatDoctorsList(clinicDoctors:ClinicDoctor[]):SimpleDoctor[] {
    return clinicDoctors.map<SimpleDoctor>(clinicDoctor => {
      const { isAttendingToday } = ClinicDoctorService.isAttendingToday(clinicDoctor);

      return {
        id: clinicDoctor.doctor.id,
        name: clinicDoctor.doctor.name,
        isAttendingToday,
      };
    });
  }

  static formatClinicInfo(clinic:Clinic):ClinicInfo {
    return {
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone
    };
  }
}
