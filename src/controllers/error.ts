import { NextFunction, Request, Response } from "express";
import { AppError } from "src/helpers/appError";

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
      data: err.apiMessage,
    });
  }

  return res.status(500).send({
    status: "error",
    message: "Something went wrong",
  });
}
