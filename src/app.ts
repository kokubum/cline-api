import express, { Express } from "express";
import { globalErrorHandler } from "./controllers";
import { authRouter } from "./routes";

class AppController {
  public readonly app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api/v1/auth", authRouter);
    this.app.use(globalErrorHandler);
  }
}

export default new AppController().app;
