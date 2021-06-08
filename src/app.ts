import express, { Express } from "express";
import { globalErrorHandler, notFoundUrlHandler } from "./controllers";
import { catchAsync } from "./helpers/catchAsync";
import { protect } from "./middlewares/auth";
import { injectCtx } from "./middlewares/context";
import { authRouter, clinicRouter, doctorRouter, lineRouter } from "./routes";

class AppController {
  public readonly app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(injectCtx);
  }

  private routes(): void {
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/clinics", catchAsync(protect), clinicRouter);
    this.app.use("/api/v1/doctors", catchAsync(protect), doctorRouter);
    this.app.use("/api/v1/lines", lineRouter);
    this.app.all("*", notFoundUrlHandler);
    this.app.use(globalErrorHandler);
  }
}

export default new AppController().app;
