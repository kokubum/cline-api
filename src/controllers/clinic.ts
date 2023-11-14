import { Request, Response } from "express";
import { SearchBody } from "../@types/clinic.types";

export async function getFilteredClinics(req:Request, res:Response) {
  const { ctx } = req;

  const { search } = ctx.services.validateService.requestBody<SearchBody>(req.body, ["search"]);
  const clinics = await ctx.db.clinicRepository.findClinicsByFilter(search);

  return res.status(200).send({
    status: "success",
    data: {
      universities: clinics,
      length: clinics.length
    }
  });
}

export async function getDoctorsFromClinic(req:Request, res:Response) {
  const { ctx } = req;

  const { id } = req.params;

  ctx.services.validateService.checkFieldsFormat({ id });

  const clinicWithDoctors = await ctx.services.clinicService.getFormattedClinicWithDoctors(ctx, id);

  return res.status(200).send({
    status: "success",
    data: clinicWithDoctors
  });
}

export async function getFilteredDoctorsFromClinic(req:Request, res:Response) {
  const { ctx } = req;
  const { id } = req.params;

  ctx.services.validateService.checkFieldsFormat({ id });
  const { search } = ctx.services.validateService.requestBody<SearchBody>(req.body, ["search"]);

  const doctors = await ctx.services.clinicService.getFormattedDoctorsListFromClinic(ctx, id, search);
  return res.status(200).send({
    status: "success",
    data: {
      coordinators: doctors
    }
  });
}

export async function getLineFromClinic(req:Request, res:Response) {
  const { ctx } = req;

  const { clinicId, doctorId } = req.params;

  ctx.services.validateService.checkFieldsFormat({ clinicId, doctorId });

  const doctorLine = await ctx.services.clinicDoctorService.getFormattedDoctorLineFromClinic(ctx, clinicId, doctorId);

  return res.status(200).send({
    status: "success",
    data: doctorLine
  });
}
