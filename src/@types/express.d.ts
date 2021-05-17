declare namespace Express {
  interface Request {
    ctx: import("../helpers/requestContext").Context;
  }
}

declare module "http" {
  interface IncomingHttpHeaders {
    authorization?: string;
  }
}
