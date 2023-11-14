import { CalledPatient } from "../@types/line.types";
import { AppError } from "../helpers/appError";
import { Context } from "../helpers/requestContext";
import { getFilteredLinePatients } from "../helpers/utils";
import { Line, LinePatient, Patient, Status } from "../models";

import { ClinicDoctorService } from "./ClinicDoctorService";
import { LinePatientService } from "./LinePatientService";

export class LineService {
  async getValidLineOfPatients(ctx:Context, lineId:string, doctorId:string):Promise<LinePatient[]> {
    const linePatients = await ctx.db.linePatientRepository.getLineFromDoctor(lineId, doctorId);

    if (linePatients.length === 0) {
      throw new AppError("The line is empty", 400);
    }

    return linePatients;
  }

  async callPatient(ctx:Context, linePatients:LinePatient[], lineId:string):Promise<CalledPatient> {
    const [firstPatient] = linePatients;
    const { clinicDoctor } = firstPatient.line;

    if (clinicDoctor.avgAttendingTime) {
      await ctx.db.linePatientRepository.updateWaitingTimes(lineId, clinicDoctor.avgAttendingTime);
    }

    firstPatient.setTotalWaitingTime();
    firstPatient.status = Status.INPROGRESS;

    await ctx.db.linePatientRepository.update({ id: firstPatient.id }, {
      totalWaitingTime: firstPatient.totalWaitingTime,
      status: Status.INPROGRESS
    });
    await ctx.db.linePatientRepository.updatePositions(lineId);

    return LineService.formatCalledPatient(firstPatient);
  }

  async finishAttendment(ctx:Context, linePatientId:string, doctorId:string, lineId:string):Promise<void> {
    const linePatient = await ctx.db.linePatientRepository.findByIdAndDoctor(linePatientId, doctorId, lineId, Status.INPROGRESS);
    linePatient.status = Status.DONE;

    const { clinicDoctor } = linePatient.line;
    clinicDoctor.setAvgAttendingTime(linePatient.updatedAt);
    await ctx.db.clinicDoctorRepository.save(clinicDoctor);

    await ctx.db.linePatientRepository.save(linePatient);
    await ctx.db.linePatientRepository.updateWaitingTimes(lineId, clinicDoctor.avgAttendingTime!);
  }

  async checkIfPatientAlreadyInLine(ctx:Context, lineId:string, patientId:string):Promise<void> {
    const patientInLine = await ctx.db.linePatientRepository.getPatientInLine(patientId, lineId, [Status.ONHOLD, Status.INPROGRESS]);

    if (patientInLine) {
      throw new AppError("The patient is already in line", 400);
    }
  }

  async checkIfPatientIsInLine(ctx:Context, lineId:string, patientId:string):Promise<LinePatient> {
    const patientInLine = await ctx.db.linePatientRepository.getPatientInLine(patientId, lineId, [Status.ONHOLD]);

    if (!patientInLine) {
      throw new AppError("The patient isn't in line", 400);
    }

    return patientInLine;
  }

  async checkIfDoctorIsAttendingToday(ctx:Context, lineId:string):Promise<void> {
    const line = await ctx.db.lineRepository.findLineById(lineId);

    const { isAttendingToday } = ClinicDoctorService.isAttendingToday(line.clinicDoctor);

    if (!isAttendingToday) {
      throw new AppError("Cannot activate a line because the doctor is not attending today", 400);
    }
  }

  async deletePatient(ctx:Context, linePatient:LinePatient):Promise<void> {
    linePatient.status = Status.DELETED;

    await ctx.db.linePatientRepository.save(linePatient);
  }

  async insertInLine(ctx:Context, line:Line, patient:Patient):Promise<LinePatient> {
    const { avgAttendingTime } = line.clinicDoctor;
    const filteredLinePatients = getFilteredLinePatients(Status.ONHOLD, line.linePatients);
    const position = filteredLinePatients.length + 1;

    const waitingTime = LinePatientService.setWaitingTime(avgAttendingTime, filteredLinePatients);

    return ctx.db.linePatientRepository.save({
      line,
      patient,
      position,
      waitingTime
    });
  }

  static formatCalledPatient(linePatient:LinePatient):CalledPatient {
    return {
      lineStudentId: linePatient.id,
      studentId: linePatient.patient.id,
      studentName: linePatient.patient.name
    };
  }
}
