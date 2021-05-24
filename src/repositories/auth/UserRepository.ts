import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AppError } from "../../helpers/appError";
import { User } from "../../models";
import { SignUpBody } from "../../@types/auth.types";
import { capitalizeName } from "../../helpers/utils";
import { hashPassword } from "../../helpers/auth";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findById(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new AppError("This user no longer exists", 404);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }

  async checkForRegisteredUser(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (user) {
      throw new AppError("This email is already registered", 400);
    }
  }

  async checkForUnregisteredUser(email: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new AppError("This email is not registered", 404);
    }
    return user;
  }

  async checkLoginCredentials(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }

  async registerUser(user: SignUpBody): Promise<User> {
    const password = await hashPassword(user.password);
    return this.save({
      email: user.email,
      password,
      firstName: capitalizeName(user.firstName),
      lastName: capitalizeName(user.lastName),
    });
  }
}
