import { Router } from "express";
import { register } from "../controllers/auth";
import { injectCtx } from "../helpers/inject";

class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers(): void {
    this.router.post("/signup", injectCtx(register));
  }
}

export default new AuthRouter().router;
