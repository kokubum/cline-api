import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";

import { Token } from "../../models";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async removeExistingTokenIfExists(patientId: string): Promise<void> {
    const existingTokenCode = await this.findOne({
      where: { patientId },
    });

    if (existingTokenCode) {
      await this.remove(existingTokenCode);
    }
  }

  async findTokenByCode(tokenCode: string): Promise<Token> {
    const token = await this.findOne({
      where: { tokenCode },
    });

    if (!token) {
      throw new AppError("Invalid activation token", 401);
    }
    return token;
  }
}
