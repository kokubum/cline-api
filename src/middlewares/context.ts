import { NextFunction, Response, Request } from "express";
import { RequestContext } from "../helpers/requestContext";

export function injectCtx(req: Request, _res: Response, next: NextFunction): void {
  req.ctx = RequestContext.buildContext();
  return next();
}
