import { AppError } from "./appError";
import { Context } from "./inject";

export async function checkForRegisteredUser(
  ctx: Context,
  email: string
): Promise<void> {
  const user = await ctx.db.userRepository.findByEmail(email);

  if (user) {
    throw new AppError("This email is already registered", 400);
  }
}
