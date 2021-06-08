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

  async findByEmail(email: string): Promise<Patient| undefined> {
    return this.findOne({ where: { email } });
  }

  async checkForRegisteredPatient(email: string): Promise<void> {
    const patient = await this.findByEmail(email);

    if (patient) {
      throw new AppError("This email is already registered", 400);
    }
  }

  async findRegisteredPatient(email: string): Promise<Patient> {
    const patient = await this.findByEmail(email);

    if (!patient) {
      throw new AppError("This email is not registered", 404);
    }
    return patient;
  }
}
