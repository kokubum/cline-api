import { EntityRepository, Repository } from "typeorm";
import { Doctor } from "../../models";

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {}
