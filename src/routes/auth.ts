import { Router } from "express";
import { signup, login } from "../controllers";
import { injectCtx } from "../helpers/inject";

class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers(): void {
    this.router.post("/signup", injectCtx(signup));
    this.router.post("/login", injectCtx(login));
  }
}

export default new AuthRouter().router;
