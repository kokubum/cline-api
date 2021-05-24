import { EntityRepository, Repository } from "typeorm";
import { Line } from "../../models";

@EntityRepository(Line)
export class LineRepository extends Repository<Line> {}
