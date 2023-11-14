import { Request, Response } from "express";
import { SearchBody } from "../@types/clinic.types";

export async function getFilteredDoctors(req:Request, res:Response) {
  const { ctx } = req;
  const { search } = ctx.services.validateService.requestBody<SearchBody>(req.body, ["search"]);
  const doctors = await ctx.db.doctorRepository.findDoctorsByFilter(search);

  return res.status(200).send({
    status: "success",
    data: {
      coordinators: doctors,
      length: doctors.length
    }
  });
}

export async function getClinicsFromDoctor(req:Request, res:Response) {
  const { ctx } = req;

  const { id } = req.params;

  ctx.services.validateService.checkFieldsFormat({ id });

  const doctorWithClinics = await ctx.services.doctorService.getFormattedDoctorWithClinics(ctx, id);

  return res.status(200).send({
    status: "success",
    data: doctorWithClinics
  });
}

export async function getLineFromDoctor(req:Request, res:Response) {
  const { ctx } = req;
  const { doctorId, clinicId } = req.params;
  ctx.services.validateService.checkFieldsFormat({ clinicId, doctorId });

  const doctorLine = await ctx.services.clinicDoctorService.getFormattedDoctorLineFromClinic(ctx, clinicId, doctorId);

  return res.status(200).send({
    status: "success",
    data: doctorLine
  });
}
