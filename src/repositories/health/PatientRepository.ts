import { EntityRepository, Repository } from "typeorm";
import { Patient } from "../../models";

@EntityRepository(Patient)
export class PatientRepository extends Repository<Patient> {}
