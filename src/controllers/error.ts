import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers/appError";

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction,
) {
  console.error(err);
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

export function notFoundUrlHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
}
