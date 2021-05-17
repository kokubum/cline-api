import { NextFunction, Request, Response } from "express";

export function catchAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction): void => {
    callback(req, res, next).catch((error: Error) => next(error));
  };
}
