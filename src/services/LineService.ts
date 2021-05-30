import { CalledPatient } from "../@types/line.types";
import { AppError } from "../helpers/appError";
import { getFilteredLinePatients } from "../helpers/utils";
import { Line, LinePatient, Patient, Status } from "../models";
import { LineRepository } from "../repositories";
import { LinePatientRepository } from "../repositories/health/LinePatientRepository";
import { ClinicDoctorService } from "./ClinicDoctorService";

export class LineService {
  private readonly linePatientRepo:LinePatientRepository;

  private readonly lineRepo:LineRepository;

  constructor(linePatientRepo:LinePatientRepository, lineRepo:LineRepository) {
    this.linePatientRepo = linePatientRepo;
    this.lineRepo = lineRepo;
  }

  async getValidLineOfPatients(lineId:string, doctorId:string):Promise<LinePatient[]> {
    const linePatients = await this.linePatientRepo.getLineFromDoctor(lineId, doctorId);

    if (linePatients.length === 0) {
      throw new AppError("The line is empty", 400);
    }

    return linePatients;
  }

  async callPatient(linePatients:LinePatient[], lineId:string):Promise<CalledPatient> {
    const [firstPatient] = linePatients;
    firstPatient.status = Status.INPROGRESS;
    await this.linePatientRepo.save(firstPatient);

    await this.linePatientRepo.updatePositions(lineId);

    return LineService.formatCalledPatient(firstPatient);
  }

  async finishAttendment(linePatientId:string, doctorId:string, lineId:string):Promise<void> {
    const linePatient = await this.linePatientRepo.findByIdAndDoctor(linePatientId, doctorId, lineId, Status.INPROGRESS);
    linePatient.status = Status.DONE;
    await this.linePatientRepo.save(linePatient);
  }

  async checkIfPatientAlreadyInLine(lineId:string, patientId:string):Promise<void> {
    const patientInLine = await this.linePatientRepo.getPatientInLine(patientId, lineId, [Status.ONHOLD, Status.INPROGRESS]);

    if (patientInLine) {
      throw new AppError("The patient is already in line", 400);
    }
  }

  async checkIfPatientIsInLine(lineId:string, patientId:string):Promise<LinePatient> {
    const patientInLine = await this.linePatientRepo.getPatientInLine(patientId, lineId, [Status.ONHOLD]);

    if (!patientInLine) {
      throw new AppError("The patient isn't in line", 400);
    }

    return patientInLine;
  }

  async checkIfDoctorIsAttendingToday(lineId:string):Promise<void> {
    const line = await this.lineRepo.findLineById(lineId);

    const { isAttendingToday } = ClinicDoctorService.isAttendingToday(line.clinicDoctor);

    if (!isAttendingToday) {
      throw new AppError("Cannot activate a line because the doctor is not attending today", 400);
    }
  }

  async deletePatient(linePatient:LinePatient):Promise<void> {
    linePatient.status = Status.DELETED;

    await this.linePatientRepo.save(linePatient);
  }

  async insertInLine(line:Line, patient:Patient):Promise<LinePatient> {
    const { avgAttendingTime } = line.clinicDoctor;
    const position = getFilteredLinePatients(Status.ONHOLD, line.linePatients).length + 1;

    // Need some logic to input a avg attending time to the patient in the line
    // const waitingTime = avgAttendingTime ? avgAttendingTime * position : avgAttendingTime;
    return this.linePatientRepo.save({
      line,
      patient,
      position,
      waitingTime: avgAttendingTime
    });
  }

  static formatCalledPatient(linePatient:LinePatient):CalledPatient {
    return {
      linePatientId: linePatient.id,
      waitingTime: linePatient.waitingTime,
      patientId: linePatient.patient.id,
      patientName: linePatient.patient.name
    };
  }
}
