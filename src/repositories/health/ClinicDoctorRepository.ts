import { EntityRepository, Repository } from "typeorm";
import { ClinicDoctor } from "../../models";

@EntityRepository(ClinicDoctor)
export class ClinicDoctorRepository extends Repository<ClinicDoctor> {}
