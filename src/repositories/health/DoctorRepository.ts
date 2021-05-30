import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { Doctor } from "../../models";

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {
  async findDoctorsByFilter(filter:string):Promise<Doctor[]> {
    return this.createQueryBuilder("doctors").select(["doctors.id", "doctors.name"]).where("name ILIKE :filter || '%'", { filter }).getMany();
  }

  async findDoctorClinics(id:string):Promise<Doctor> {
    const doctor = await this.findOne({ where: { id }, relations: ["clinicDoctors", "clinicDoctors.clinic", "clinicDoctors.attendingDays"] });

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    return doctor;
  }
}
