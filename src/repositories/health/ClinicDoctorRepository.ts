import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { ClinicDoctor } from "../../models";

@EntityRepository(ClinicDoctor)
export class ClinicDoctorRepository extends Repository<ClinicDoctor> {
  async findDoctorsFromClinic(clinicId:string, filter:string):Promise<ClinicDoctor[]> {
    return this.createQueryBuilder("clinicDoctors")
      .innerJoinAndSelect("clinicDoctors.doctor", "doctor")
      .innerJoinAndSelect("clinicDoctors.attendingDays", "attendingDays")
      .innerJoinAndSelect("attendingDays.weekDay", "weekDay")
      .where("clinicDoctors.clinic_id = :id", { id: clinicId })
      .andWhere("doctor.name ILIKE :name || '%'", { name: filter })
      .getMany();
  }

  async findDoctorLine(clinicId:string, doctorId:string):Promise<ClinicDoctor> {
    const clinicDoctor = await this.findOne({
      where: {
        clinic: {
          id: clinicId
        },
        doctor: {
          id: doctorId
        }
      },
      relations: ["doctor", "attendingDays", "line"]
    });

    if (!clinicDoctor) {
      throw new AppError("The doctor line was not found", 404);
    }

    return clinicDoctor;
  }
}
