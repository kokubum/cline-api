import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { Clinic } from "../../models";

@EntityRepository(Clinic)
export class ClinicRepository extends Repository<Clinic> {
  async findClinicsByFilter(filter:string):Promise<Clinic[]> {
    return this.createQueryBuilder("clinics").select(["clinics.id", "clinics.name"]).where("name ILIKE :filter || '%'", { filter }).getMany();
  }

  async findClinicWithDoctors(id:string):Promise<Clinic> {
    const clinic = await this.findOne({ where: { id }, relations: ["clinicDoctors", "clinicDoctors.doctor", "clinicDoctors.attendingDays"] });

    if (!clinic) {
      throw new AppError("Clinic not found", 404);
    }
    return clinic;
  }
}
