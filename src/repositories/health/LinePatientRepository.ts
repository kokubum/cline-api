import { EntityRepository, Repository } from "typeorm";
import { LinePatient } from "../../models";

@EntityRepository(LinePatient)
export class LinePatientRepository extends Repository<LinePatient> {}
