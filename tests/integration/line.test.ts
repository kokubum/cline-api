import request from "supertest";
import { validate as uuidValidate, v4 as uuidV4 } from "uuid";

import app from "../../src/app";
import { Context, RequestContext } from "../../src/helpers/requestContext";
import { Clinic, ClinicDoctor, Doctor, Line, Patient, Status } from "../../src/models";
import { ClinicDoctorService } from "../../src/services/ClinicDoctorService";
import { clearTablesContent } from "../helper";
import { generateMockClinic } from "../__mocks__/clinic";
import { generateMockDoctor } from "../__mocks__/doctor";
import { generateMockLine } from "../__mocks__/line";
import { generateMockPatient } from "../__mocks__/patient";

let ctx:Context;
let enterLineUrl:string;
let attendPatientUrl:string;
let finishAttendmentUrl:string;
let leaveLineUrl:string;
let activateLineUrl:string;

let createdClinic:Clinic;
let createdDoctor:Doctor;
let createdClinicDoctor:ClinicDoctor;
let createdLine:Line;
let createdPatient:Patient;

describe("Line", () => {
  beforeAll(() => {
    ctx = RequestContext.getInstance();
    enterLineUrl = "/api/v1/lines/<id>";
    attendPatientUrl = "/api/v1/lines/<id>/attendPatient";
    finishAttendmentUrl = "/api/v1/lines/<id>/finishAttendment";
    leaveLineUrl = "/api/v1/lines/<id>/leave";
    activateLineUrl = "/api/v1/lines/<id>/activate";
  });
  beforeEach(async () => {
    await clearTablesContent();
    createdClinic = await ctx.db.clinicRepository.save(generateMockClinic({}));
    createdDoctor = await ctx.db.doctorRepository.save(generateMockDoctor({}));
    createdClinicDoctor = await ctx.db.clinicDoctorRepository.save({
      clinic: createdClinic,
      doctor: createdDoctor
    });
    createdLine = await ctx.db.lineRepository.save(generateMockLine({ clinicDoctor: createdClinicDoctor }));
    createdPatient = await ctx.db.patientRepository.save(generateMockPatient({}));
  });

  describe("Enter In Line", () => {
    it("Should add a patient in the line and return the linePatient id", async () => {
      const { status, body } = await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });

      expect(status).toBe(201);
      expect(body.status).toBe("success");
      expect(uuidValidate(body.data.id)).toBeTruthy();
    });

    it("Should throw an error if doesn't exist patient with the id that was passed", async () => {
      const { status, body } = await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: uuidV4() });

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Patient not found");
    });

    it("Should throw an error if doesn't exist line with the id that was passed", async () => {
      const { status, body } = await request(app).post(enterLineUrl.replace("<id>", uuidV4())).send({ patientId: createdPatient.id });

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Line not found");
    });

    it("Should throw an error if try to enter in line more than one time", async () => {
      await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });
      const { status, body } = await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The patient is already in line");
    });
  });

  describe("Attend Patient In Line", () => {
    it("Should attend a patient that is in line, in the position 1", async () => {
      await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });
      const { status, body } = await request(app).post(attendPatientUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id });
      const calledPatient = await ctx.db.linePatientRepository.findOne(body.data.patientCalled.linePatientId);
      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.patientCalled.patientId).toBe(createdPatient.id);
      expect(calledPatient!.status).toBe(Status.INPROGRESS);
    });

    it("Should throw an error if there is a patient in attendment", async () => {
      await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });
      await request(app).post(attendPatientUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id });
      const { status, body } = await request(app).post(attendPatientUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id });
      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("There is a patient in attendment, please finish the consultation first");
    });

    it("Should throw an error if the line is empty", async () => {
      const { status, body } = await request(app).post(attendPatientUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id });
      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The line is empty");
    });

    it("Should throw an error if the line doesn't exist or isn't activate", async () => {
      const { status, body } = await request(app).post(attendPatientUrl.replace("<id>", uuidV4())).send({ doctorId: createdDoctor.id });

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Line not found");
    });
  });

  describe("Finish Attendment", () => {
    let linePatientId:string;
    beforeEach(async () => {
      await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });
      const { body: attendBody } = await request(app).post(attendPatientUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id });
      linePatientId = attendBody.data.patientCalled.linePatientId;
    });

    it("Should finish the attendment of the patient that was called", async () => {
      const { status, body } = await request(app).post(finishAttendmentUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id, linePatientId });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data).toBeNull();
    });

    it("Should throw an error if there is no patient in attendment", async () => {
      await request(app).post(finishAttendmentUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id, linePatientId });
      const { status, body } = await request(app).post(finishAttendmentUrl.replace("<id>", createdLine.id)).send({ doctorId: createdDoctor.id, linePatientId });

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Patient not found");
    });
  });

  describe("Leave Line", () => {
    beforeEach(async () => {
      await request(app).post(enterLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });
    });

    it("Should remove the patient from the line", async () => {
      const { status } = await request(app).post(leaveLineUrl.replace("<id>", createdLine.id)).send({ patientId: createdPatient.id });

      const patientsInLine = await ctx.db.linePatientRepository.find({ where: { line: { id: createdLine.id }, status: Status.ONHOLD } });
      expect(status).toBe(204);
      expect(patientsInLine.length).toBe(0);
    });

    it("Should throw an error if try to leave the line with an invalid patientId", async () => {
      const { status, body } = await request(app).post(leaveLineUrl.replace("<id>", createdLine.id)).send({ patientId: uuidV4() });

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The patient isn't in line");
    });
  });

  describe("Activate Line", () => {
    it("Should activate the line that isn't activate", async () => {
      const isAttendingSpy = jest.spyOn(ClinicDoctorService, "isAttendingToday").mockReturnValue({
        isAttendingToday: true,
        onDuty: true,
        time: null
      });
      await ctx.db.lineRepository.update({ id: createdLine.id }, { active: false });
      const { status, body } = await request(app).get(activateLineUrl.replace("<id>", createdLine.id));
      console.log(body);
      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data).toBeNull();
      isAttendingSpy.mockRestore();
    });

    it("Should throw an error if try to activate a line from a doctor that isn't attending today", async () => {
      const isAttendingSpy = jest.spyOn(ClinicDoctorService, "isAttendingToday").mockReturnValue({
        isAttendingToday: false,
        onDuty: false,
        time: null
      });
      const { status, body } = await request(app).get(activateLineUrl.replace("<id>", createdLine.id));
      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Cannot activate a line because the doctor is not attending today");
      expect(isAttendingSpy).toBeCalledTimes(1);
      isAttendingSpy.mockRestore();
    });
  });
});
