import { Router } from "express";
import { getFilteredClinics } from "../controllers/clinic";
import { catchAsync } from "../helpers/catchAsync";

class ClinicRouter {
  router:Router;

  constructor() {
    this.router = Router();
    this.registerControllers();
  }

  private registerControllers():void {
    this.router.post("/", catchAsync(getFilteredClinics));
  }
}

export default (new ClinicRouter()).router;
