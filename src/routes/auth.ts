import { Router } from "express";
import {
  activateAccount,
  login,
  logout,
  recoverPassword,
  sendActivationLink,
  sendRecoverPasswordLink,
  signup,
  verifyRecoverPasswordLink,
} from "../controllers";
import { catchAsync } from "../helpers/catchAsync";
import { protect } from "../middlewares/auth";

class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers(): void {
    this.router.post("/signup", catchAsync(signup));
    this.router.post("/login", catchAsync(login));
    this.router.get("/activate-account/:token", catchAsync(activateAccount));
    this.router.post("/send-activation", catchAsync(sendActivationLink));
    this.router.post("/send-recovery", catchAsync(sendRecoverPasswordLink));
    this.router.get("/recover-password/:token", catchAsync(verifyRecoverPasswordLink));
    this.router.post("/recover-password/:token", catchAsync(recoverPassword));
    this.router.get("/logout", catchAsync(protect), catchAsync(logout));
  }
}

export default new AuthRouter().router;
