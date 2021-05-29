import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { Line } from "../../models";

@EntityRepository(Line)
export class LineRepository extends Repository<Line> {
  async findLineById(id:string, active = [true, false]):Promise<Line> {
    const line = await this.createQueryBuilder("lines")
      .innerJoinAndSelect("lines.clinicDoctor", "clinicDoctor")
      .innerJoinAndSelect("clinicDoctor.attendingDays", "attendingDays")
      .innerJoinAndSelect("attendingDays.weekDay", "weekDay")
      .where("lines.id = :id", { id })
      .andWhere("lines.active = ANY(:active)", { active })
      .getOne();

    if (!line) {
      throw new AppError("Line not found", 404);
    }

    return line;
  }
}
