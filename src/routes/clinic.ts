import { Router } from "express";
import { getFilteredClinics, getDoctorsFromClinic, getFilteredDoctorsFromClinic, getLineFromClinic } from "../controllers";
import { catchAsync } from "../helpers/catchAsync";

class ClinicRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.post("/", catchAsync(getFilteredClinics));
    this.router.get("/:id/doctors", catchAsync(getDoctorsFromClinic));
    this.router.post("/:id/doctors", catchAsync(getFilteredDoctorsFromClinic));
    this.router.get("/:clinicId/doctors/:doctorId/line", catchAsync(getLineFromClinic));
  }
}

export default (new ClinicRouter()).router;
