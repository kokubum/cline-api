import { ClinicInfo, ClinicWithDoctors } from "../@types/clinic.types";
import { SimpleDoctor } from "../@types/doctor.types";
import { Context } from "../helpers/requestContext";
import { Clinic, ClinicDoctor } from "../models";

import { ClinicDoctorService } from "./ClinicDoctorService";

export class ClinicService {
  async getFormattedClinicWithDoctors(ctx:Context, clinicId:string):Promise<ClinicWithDoctors> {
    const clinic = await ctx.db.clinicRepository.findClinicWithDoctors(clinicId);
    const formattedDoctors = ClinicService.formatDoctorsList(clinic.clinicDoctors);
    const formattedClinicInfo = ClinicService.formatClinicInfo(clinic);
    return {
      university: formattedClinicInfo,
      coordinators: formattedDoctors
    };
  }

  async getFormattedDoctorsListFromClinic(ctx:Context, clinicId:string, filter:string):Promise<SimpleDoctor[]> {
    const clinicDoctors = await ctx.db.clinicDoctorRepository.findDoctorsFromClinic(clinicId, filter);

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
