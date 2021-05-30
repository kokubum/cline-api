import { EntityRepository, Repository } from "typeorm";
import { AttendingDay } from "../../models";

@EntityRepository(AttendingDay)
export class AttendingDayRepository extends Repository<AttendingDay> {}
