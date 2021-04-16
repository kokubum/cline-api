import { Router } from "express";
import {
  signup,
  login,
  activateAccount,
  sendActivationLink,
  sendRecoverPasswordLink,
  verifyRecoverPasswordLink,
  recoverPassword,
} from "../controllers";
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
    this.router.get("/activate-account/:token", injectCtx(activateAccount));
    this.router.post("/send-activation", injectCtx(sendActivationLink));
    this.router.post("/send-recovery", injectCtx(sendRecoverPasswordLink));
    this.router.get("/recover-password/:token", injectCtx(verifyRecoverPasswordLink));
    this.router.post("/recover-password/:token", injectCtx(recoverPassword));
  }
}

export default new AuthRouter().router;
