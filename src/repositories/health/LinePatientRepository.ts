import { Any, EntityRepository, Repository } from "typeorm";
import { AppError } from "../../helpers/appError";
import { LinePatient, Status } from "../../models";

@EntityRepository(LinePatient)
export class LinePatientRepository extends Repository<LinePatient> {
  async getPatientInLine(patientId:string, lineId:string, status:Status[]):Promise<LinePatient|undefined> {
    return this.findOne({ where: { patient: { id: patientId }, line: { id: lineId }, status: Any(status) } });
  }

  async checkPatientInProgress(lineId:string):Promise<void> {
    const linePatient = await this.findOne({ where: { line: { id: lineId }, status: Status.INPROGRESS } });

    if (linePatient) {
      throw new AppError("There is a patient in attendment, please finish the consultation first", 400);
    }
  }

  async findByIdAndDoctor(linePatientId:string, doctorId:string, lineId:string, status:Status):Promise<LinePatient> {
    const linePatient = await this.createQueryBuilder("linePatients")
      .leftJoinAndSelect("linePatients.line", "line")
      .leftJoinAndSelect("line.clinicDoctor", "clinicDoctor")
      .where("linePatients.id = :linePatientId", { linePatientId })
      .andWhere("line.id = :lineId", { lineId })
      .andWhere("clinicDoctor.doctor_id = :doctorId", { doctorId })
      .andWhere("linePatients.status = :status", { status })
      .getOne();

    if (!linePatient) {
      throw new AppError("Patient not found", 404);
    }

    return linePatient;
  }

  async updatePositions(lineId:string):Promise<void> {
    await this.createQueryBuilder("linePatients")
      .update()
      .set({
        position: () => "position - 1"
      })
      .where("line_id = :lineId", { lineId })
      .andWhere("status = :status", { status: Status.ONHOLD })
      .execute();
  }

  async updateWaitingTimes(lineId:string, avgAttendingTime:string):Promise<void> {
    await this.query(`
      UPDATE line_patients
        SET 
          waiting_time = (
            CASE 
              WHEN position = 1 THEN '00:00:00'
              ELSE $1::time * (position-1)
            END
          )
      WHERE 
        line_id = $2
          AND
        status = $3
    `, [avgAttendingTime, lineId, Status.ONHOLD]);
  }

  async getLineFromDoctor(lineId:string, doctorId:string):Promise<LinePatient[]> {
    const orderedLine = await this.createQueryBuilder("linePatients")
      .innerJoinAndSelect("linePatients.line", "line")
      .innerJoinAndSelect("line.clinicDoctor", "clinicDoctor")
      .innerJoinAndSelect("linePatients.patient", "patient")
      .where("line.id = :lineId", { lineId })
      .andWhere("clinicDoctor.doctor_id = :doctorId", { doctorId })
      .andWhere("line.active = :active", { active: true })
      .andWhere("linePatients.status = :status", { status: Status.ONHOLD })
      .orderBy("linePatients.position", "ASC")
      .getMany();

    if (!orderedLine) {
      throw new AppError("Line not found", 404);
    }

    return orderedLine;
  }
}
