import { Request, Response } from "express";
import { SearchBody } from "../@types/clinic.types";

export async function getFilteredClinics(req:Request, res:Response) {
  const { ctx } = req;

  const { search } = ctx.services.validateService.requestBody<SearchBody>(req.body, ["search"]);
  const clinics = await ctx.db.clinicRepository.getFilteredClinics(search);

  return res.status(200).send({
    status: "success",
    data: {
      clinics,
      length: clinics.length
    }
  });
}
