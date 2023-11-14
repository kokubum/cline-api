import { Request, Response } from "express";
import { AttendPatientInLineBody, FinishAttendment, GetInLineBody } from "../@types/line.types";

export async function getInLine(req:Request, res:Response) {
  const { ctx } = req;

  const { id: lineId } = req.params;
  ctx.services.validateService.checkFieldsFormat({ lineId });
  /**
   *  When apply authentication feature the user will be in the context
   *  const user = ctx.signature!.user;
  */

  // For now this part will be hardcoded from the front mobile
  const { studentId } = ctx.services.validateService.requiredFields<GetInLineBody>(req.body, ["studentId"]);

  const patient = await ctx.db.patientRepository.findById(studentId);

  const line = await ctx.db.lineRepository.findLineById(lineId, [true]);

  await ctx.services.lineService.checkIfPatientAlreadyInLine(ctx, lineId, studentId);

  const linePatient = await ctx.services.lineService.insertInLine(ctx, line, patient);

  return res.status(201).send({
    status: "success",
    data: {
      id: linePatient.id
    }
  });
}

export async function attendPatientFromLine(req:Request, res:Response) {
  const { ctx } = req;
  const { id: lineId } = req.params;
  ctx.services.validateService.checkFieldsFormat({ lineId });
  // In the future this endpoint will have in the ctx.signature the id of the logged doctor to validate with the line id
  const { coordinatorId } = ctx.services.validateService.requiredFields<AttendPatientInLineBody>(req.body, ["coordinatorId"]);

  await ctx.db.linePatientRepository.checkPatientInProgress(lineId);
  const linePatients = await ctx.services.lineService.getValidLineOfPatients(ctx, lineId, coordinatorId);

  const patientCalled = await ctx.services.lineService.callPatient(ctx, linePatients, lineId);

  return res.status(200).send({
    status: "success",
    data: {
      studentCalled: patientCalled
    }
  });
}

export async function finishAttendment(req:Request, res:Response) {
  const { ctx } = req;
  const { id: lineId } = req.params;
  ctx.services.validateService.checkFieldsFormat({ lineId });
  // In the future this endpoint will have in the ctx.signature the id of the logged doctor to validate with the line id
  const { lineStudentId, coordinatorId } = ctx.services.validateService.requiredFields<FinishAttendment>(req.body, ["lineStudentId", "coordinatorId"]);

  await ctx.services.lineService.finishAttendment(ctx, lineStudentId, coordinatorId, lineId);

  return res.status(200).send({
    status: "success",
    data: null
  });
}

export async function leaveLine(req:Request, res:Response) {
  const { ctx } = req;
  const { id: lineId } = req.params;
  ctx.services.validateService.checkFieldsFormat({ lineId });
  /**
   *  When apply authentication feature the user will be in the context
   *  const user = ctx.signature!.user;
  */

  // For now this part will be hardcoded from the front mobile
  const { studentId } = ctx.services.validateService.requiredFields<GetInLineBody>(req.body, ["studentId"]);

  const patientInLine = await ctx.services.lineService.checkIfPatientIsInLine(ctx, lineId, studentId);
  await ctx.services.lineService.deletePatient(ctx, patientInLine);

  return res.status(204).send({
    status: "success",
    data: null
  });
}

export async function activateLine(req:Request, res:Response) {
  const { ctx } = req;
  const { id: lineId } = req.params;
  ctx.services.validateService.checkFieldsFormat({ lineId });
  await ctx.services.lineService.checkIfDoctorIsAttendingToday(ctx, lineId);
  await ctx.db.lineRepository.update(lineId, { active: true });

  return res.status(200).send({
    status: "success",
    data: null
  });
}
