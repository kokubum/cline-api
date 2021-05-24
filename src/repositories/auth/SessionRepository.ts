import { EntityRepository, Repository } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { generateJwt, generateSessionExpireTime } from "../../helpers/auth";
import { Session } from "../../models";

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  async createSession(userId: string): Promise<Session> {
    const sessionId = uuidV4();
    const token = await generateJwt(sessionId);

    return this.save({
      userId,
      id: sessionId,
      token,
      expiresAt: generateSessionExpireTime(),
    });
  }

  async getValidSession(id: string): Promise<Session | undefined> {
    return this.findOne({ id, active: true });
  }
}
