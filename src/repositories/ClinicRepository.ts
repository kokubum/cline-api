import { EntityRepository, Repository } from "typeorm";
import { Clinic } from "../models";

@EntityRepository(Clinic)
export class ClinicRepository extends Repository<Clinic> {
    async getAll(): Promise<Clinic[]> {
        return this.createQueryBuilder("clinics").getMany()
    }
}