import express, { Express } from "express";
import { globalErrorHandler, notFoundUrlHandler } from "./controllers";
import { injectCtx } from "./middlewares/context";
import { authRouter, clinicRouter, doctorRouter, lineRouter } from "./routes";

class AppController {
  public app: Express;

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
    this.app.use("/api/v1/universities", clinicRouter);
    this.app.use("/api/v1/coordinators", doctorRouter);
    this.app.use("/api/v1/lines", lineRouter);
    this.app.all("*", notFoundUrlHandler);
    this.app.use(globalErrorHandler);

    // eslint-disable-next-line no-underscore-dangle
    console.log("here", this.app._router, this.app.routes);
  }
}

export default new AppController().app;
