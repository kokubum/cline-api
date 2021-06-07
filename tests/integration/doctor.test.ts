import request from "supertest";
import { v4 as uuidV4 } from "uuid";
import app from "../../src/app";
import { Context, RequestContext } from "../../src/helpers/requestContext";
import { Clinic, ClinicDoctor, Doctor, Line, Patient } from "../../src/models";
import { clearTablesContent } from "../helper";
import { generateMockClinic } from "../__mocks__/clinic";
import { generateMockDoctor } from "../__mocks__/doctor";
import { generateMockLine } from "../__mocks__/line";
import { generateMockPatient } from "../__mocks__/patient";

let ctx: Context;
let filteredDoctorsUrl:string;
let clinicsFromDoctorUrl:string;
let lineFromDoctorUrl:string;

let createdClinic:Clinic;
let createdDoctor:Doctor;
let createdClinicDoctor:ClinicDoctor;

describe("Doctor", () => {
  beforeAll(() => {
    ctx = RequestContext.getInstance();
    filteredDoctorsUrl = "/api/v1/doctors/";
    clinicsFromDoctorUrl = "/api/v1/doctors/<id>/clinics";
    lineFromDoctorUrl = "/api/v1/doctors/<doctorId>/clinics/<clinicId>/line";
  });
  beforeEach(async () => {
    await clearTablesContent();
    createdClinic = await ctx.db.clinicRepository.save(generateMockClinic({}));
    createdDoctor = await ctx.db.doctorRepository.save(generateMockDoctor({}));
    createdClinicDoctor = await ctx.db.clinicDoctorRepository.save({
      clinic: createdClinic,
      doctor: createdDoctor
    });
  });

  describe("Get Filtered Doctors", () => {
    it("Should get the formatted doctors that match the search parameter", async () => {
      const { status, body } = await request(app).post(filteredDoctorsUrl).send({ search: createdDoctor.name[0] });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctors.length).toBe(1);
      expect(body.data.doctors.length).toBe(body.data.length);
      expect(body.data.doctors[0].name).toBe(createdDoctor.name);
    });
    it("Shougl get an empty list of doctors if no one match the search parameter", async () => {
      const { status, body } = await request(app).post(filteredDoctorsUrl).send({ search: "Invalid" });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctors.length).toBe(0);
      expect(body.data.doctors.length).toBe(body.data.length);
    });
  });

  describe("Get Clinics From Doctor", () => {
    it("Should get a formatted list of clinics with the doctor info that work in this clinics", async () => {
      const { status, body } = await request(app).get(clinicsFromDoctorUrl.replace("<id>", createdDoctor.id));

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctor.id).toBe(createdDoctor.id);
      expect(body.data.clinics.length).toBe(1);
      expect(body.data.clinics[0].id).toBe(createdClinic.id);
    });

    it("Should throw an error if the doctor id doesn't exist", async () => {
      const { status, body } = await request(app).get(clinicsFromDoctorUrl.replace("<id>", uuidV4()));

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Doctor not found");
    });
  });

  describe("Get Line From Doctor", () => {
    let createdLine:Line;
    let createdPatient:Patient;
    beforeEach(async () => {
      createdLine = await ctx.db.lineRepository.save(generateMockLine({ clinicDoctor: createdClinicDoctor }));
      createdPatient = await ctx.db.patientRepository.save(generateMockPatient({}));
      await ctx.db.linePatientRepository.save({
        patient: createdPatient,
        line: createdLine,
        position: 1
      });
    });

    it("Should get a formatted line with the doctor info and the patients list", async () => {
      const url = lineFromDoctorUrl.replace("<clinicId>", createdClinic.id).replace("<doctorId>", createdDoctor.id);
      const { status, body } = await request(app).get(url);

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctor.id).toBe(createdDoctor.id);
      expect(body.data.line.id).toBe(createdLine.id);
      expect(body.data.line.patients.length).toBe(1);
      expect(body.data.line.patients[0].id).toBe(createdPatient.id);
    });

    it("Should throw an error response if the doctor/clinic doesn't exist, or are not related", async () => {
      const url = lineFromDoctorUrl.replace("<clinicId>", uuidV4()).replace("<doctorId>", uuidV4());
      const { status, body } = await request(app).get(url);

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The doctor line was not found");
    });
  });
});
