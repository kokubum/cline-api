import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { Patient } from "../../models";

@EntityRepository(Patient)
export class PatientRepository extends Repository<Patient> {
  async findById(id:string):Promise<Patient> {
    const patient = await this.findOne(id);

    if (!patient) {
      throw new AppError("Patient not found", 404);
    }

    return patient;
  }
}
