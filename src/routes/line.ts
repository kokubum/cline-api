import { Router } from "express";
import { activateLine, attendPatientFromLine, finishAttendment, getInLine, leaveLine } from "../controllers/line";
import { catchAsync } from "../helpers/catchAsync";

class LineRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.post("/:id", catchAsync(getInLine));
    this.router.get("/:id/activate", catchAsync(activateLine));
    this.router.post("/:id/attendPatient", catchAsync(attendPatientFromLine));
    this.router.post("/:id/finishAttendment", catchAsync(finishAttendment));
    this.router.post("/:id/leave", catchAsync(leaveLine));
  }
}

export default (new LineRouter()).router;
