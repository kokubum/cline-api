import { EntityRepository, Repository } from "typeorm";
import { Clinic } from "../../models";

@EntityRepository(Clinic)
export class ClinicRepository extends Repository<Clinic> {}
