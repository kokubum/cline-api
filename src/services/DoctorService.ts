import { SimpleClinic } from "../@types/clinic.types";
import { DoctorInfo, DoctorWithClinics } from "../@types/doctor.types";
import { Context } from "../helpers/requestContext";
import { ClinicDoctor, Doctor } from "../models";
import { ClinicDoctorService } from "./ClinicDoctorService";

export class DoctorService {
  async getFormattedDoctorWithClinics(ctx:Context, doctorId:string):Promise<DoctorWithClinics> {
    const doctor = await ctx.db.doctorRepository.findDoctorClinics(doctorId);

    const doctorInfo = DoctorService.formatDoctorInfo(doctor);
    const clinicList = DoctorService.formatClinicList(doctor.clinicDoctors);

    return {
      coordinator: doctorInfo,
      universities: clinicList
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
