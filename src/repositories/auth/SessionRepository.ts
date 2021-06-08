import { EntityRepository, MoreThanOrEqual, Repository } from "typeorm";

import { Session } from "../../models";

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  async getValidSession(id: string): Promise<Session | undefined> {
    return this.findOne({ id, active: true, expiresAt: MoreThanOrEqual(new Date(Date.now())) });
  }
}
