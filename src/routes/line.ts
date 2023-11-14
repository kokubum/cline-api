import { Router } from "express";
import { activateLine, attendPatientFromLine, finishAttendment, getInLine } from "../controllers/line";
import { catchAsync } from "../helpers/catchAsync";

class LineRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.post("/:id/enterInLine", catchAsync(getInLine));
    this.router.get("/:id/activateLine", catchAsync(activateLine));
    this.router.post("/:id/attendStudent", catchAsync(attendPatientFromLine));
    this.router.post("/:id/finishAttendment", catchAsync(finishAttendment));
  }
}

export default (new LineRouter()).router;
