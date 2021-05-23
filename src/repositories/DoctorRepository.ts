import { EntityRepository, Repository } from "typeorm";
import { Doctor } from "../models";

@EntityRepository(Doctor)
export class DoctorRepository extends Repository<Doctor> {
    async getAll(): Promise<Doctor[]> {
        return this.createQueryBuilder("doctors").getMany()
    }
}