import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const { ctx } = req;
  const { email, password, firstName, lastName } = req.body;
  const user = await ctx.db.userRepository.save({
    email,
    password,
    firstName,
    lastName,
  });

  res.status(200).send({
    status: "success",
    data: {
      user,
    },
  });
}
