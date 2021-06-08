import { EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { generateLinkExpireTime, generateTokenCode } from "../../helpers/auth";
import { Token } from "../../models";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async saveToken(patientId: string): Promise<Token> {
    const tokenCode = generateTokenCode();

    return this.save({
      tokenCode,
      patientId,
      expiresAt: generateLinkExpireTime(),
    });
  }

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
