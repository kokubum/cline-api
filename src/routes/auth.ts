import { Router } from "express";
import { signup } from "../controllers";
import { injectCtx } from "../helpers/inject";

class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers(): void {
    this.router.post("/signup", injectCtx(signup));
  }
}

export default new AuthRouter().router;
