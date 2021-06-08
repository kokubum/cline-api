import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AppError } from "../../helpers/appError";

import { SignUpBody } from "../../@types/auth.types";
import { hashPassword } from "../../helpers/auth";
import { capitalizeName } from "../../helpers/utils";
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

  async checkForUnregisteredPatient(email: string): Promise<Patient> {
    const patient = await this.findByEmail(email);

    if (!patient) {
      throw new AppError("This email is not registered", 404);
    }
    return patient;
  }

  async checkLoginCredentials(email: string, password: string): Promise<Patient> {
    const user = await this.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }

  async registerPatient(patient: SignUpBody): Promise<Patient> {
    const password = await hashPassword(patient.password);
    return this.save({
      email: patient.email,
      document: patient.document,
      password,
      firstName: capitalizeName(patient.firstName),
      lastName: capitalizeName(patient.lastName),
    });
  }
}
