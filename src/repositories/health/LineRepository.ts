import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { Line } from "../../models";

@EntityRepository(Line)
export class LineRepository extends Repository<Line> {
  async findLineById(id:string, active = [true, false]):Promise<Line> {
    const line = await this.createQueryBuilder("lines")
      .leftJoinAndSelect("lines.linePatients", "linePatients")
      .leftJoinAndSelect("lines.clinicDoctor", "clinicDoctor")
      .leftJoinAndSelect("clinicDoctor.attendingDays", "attendingDays")
      .leftJoinAndSelect("attendingDays.weekDay", "weekDay")
      .where("lines.id = :id", { id })
      .andWhere("lines.active = ANY(:active)", { active })
      .getOne();

    if (!line) {
      throw new AppError("Line not found", 404);
    }

    return line;
  }
}
