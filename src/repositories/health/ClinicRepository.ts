import { EntityRepository, Repository } from "typeorm";
import { Clinic } from "../../models";

@EntityRepository(Clinic)
export class ClinicRepository extends Repository<Clinic> {
  async getFilteredClinics(filter:string):Promise<Clinic[]> {
    return this.createQueryBuilder("clinics").select(["clinics.id", "clinics.name"]).where("name ILIKE :filter || '%'", { filter }).getMany();
  }
}
