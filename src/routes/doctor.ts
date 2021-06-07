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
    this.router.get("/:id/clinics", catchAsync(getClinicsFromDoctor));
    this.router.get("/:doctorId/clinics/:clinicId/line", catchAsync(getLineFromDoctor));
  }
}

export default (new DoctorRouter()).router;
