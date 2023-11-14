import { Router } from "express";
import { getDoctorsFromClinic, getFilteredClinics, getFilteredDoctorsFromClinic, getLineFromClinic } from "../controllers";
import { catchAsync } from "../helpers/catchAsync";

class ClinicRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.post("/", catchAsync(getFilteredClinics));
    this.router.get("/:id/coordinators", catchAsync(getDoctorsFromClinic));
    this.router.post("/:id/coordinators", catchAsync(getFilteredDoctorsFromClinic));
    this.router.get("/:clinicId/coordinators/:doctorId/line", catchAsync(getLineFromClinic));
  }
}

export default (new ClinicRouter()).router;
