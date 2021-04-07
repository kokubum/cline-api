declare namespace Express {
  interface Request {
    ctx: import("../helpers/inject").Context;
  }
}
