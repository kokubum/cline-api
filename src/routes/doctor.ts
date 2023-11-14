import { Router } from "express";
import { getClinicsFromDoctor, getFilteredDoctors, getLineFromDoctor } from "../controllers";
import { catchAsync } from "../helpers/catchAsync";

class DoctorRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.post("/", catchAsync(getFilteredDoctors));
    this.router.get("/:id/universities", catchAsync(getClinicsFromDoctor));
    this.router.get("/:doctorId/universities/:clinicId", catchAsync(getLineFromDoctor));
  }
}

export default (new DoctorRouter()).router;
