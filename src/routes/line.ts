import { Router } from "express";
import { activateLine, attendPatientFromLine, finishAttendment, getInLine, leaveLine } from "../controllers/line";
import { catchAsync } from "../helpers/catchAsync";
import { protect } from "../middlewares/auth";

class LineRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.get("/:id", catchAsync(protect), catchAsync(getInLine));
    this.router.get("/:id/activate", catchAsync(activateLine));
    this.router.post("/:id/attendPatient", catchAsync(attendPatientFromLine));
    this.router.post("/:id/finishAttendment", catchAsync(finishAttendment));
    this.router.get("/:id/leave", catchAsync(protect), catchAsync(leaveLine));
  }
}

export default (new LineRouter()).router;
