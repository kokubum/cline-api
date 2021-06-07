import request from "supertest";
import { validate as uuidValidate, v4 as uuidV4 } from "uuid";
import app from "../../src/app";
import { Context, RequestContext } from "../../src/helpers/requestContext";
import { Clinic, ClinicDoctor, Doctor, Line, Patient } from "../../src/models";
import { clearTablesContent } from "../helper";
import { generateMockClinic } from "../__mocks__/clinic";
import { generateMockDoctor } from "../__mocks__/doctor";
import { generateMockLine } from "../__mocks__/line";
import { generateMockPatient } from "../__mocks__/patient";

let ctx: Context;
let filteredClinicsUrl:string;
let doctorsFromClinicUrl:string;
let lineFromClinicUrl:string;

let createdClinic:Clinic;
let createdDoctor:Doctor;
let createdClinicDoctor:ClinicDoctor;

describe("Clinic", () => {
  beforeAll(() => {
    ctx = RequestContext.getInstance();
    filteredClinicsUrl = "/api/v1/clinics/";
    doctorsFromClinicUrl = "/api/v1/clinics/<id>/doctors";
    lineFromClinicUrl = "/api/v1/clinics/<clinicId>/doctors/<doctorId>/line";
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

  describe("Get Filtered Clinics", () => {
    it("Should get all the clinics filtered by the search parameter", async () => {
      const { status, body } = await request(app).post(filteredClinicsUrl).send({ search: createdClinic.name[0] });
      const { clinics } = body.data;

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.length).toBe(1);
      expect(clinics.length).toBe(body.data.length);
      expect(uuidValidate(clinics[0].id)).toBeTruthy();
      expect(clinics[0].name).toBe(createdClinic.name);
      expect(clinics[0].phone).toBeUndefined();
      expect(clinics[0].address).toBeUndefined();
    });

    it("Should get an empty list if the clinics doesn't match the search parameter", async () => {
      const { status, body } = await request(app).post(filteredClinicsUrl).send({ search: "Invalid Clinic" });
      const { clinics } = body.data;
      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.length).toBe(0);
      expect(clinics.length).toBe(body.data.length);
    });
  });

  describe("Get Doctors From Clinic", () => {
    it("Should get a list of doctors and the clinic info associated with then", async () => {
      const { status, body } = await request(app).get(doctorsFromClinicUrl.replace("<id>", createdClinic.id));
      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.clinic.id).toBe(createdClinic.id);
      expect(body.data.doctors.length).toBe(1);
      expect(body.data.doctors[0].id).toBe(createdDoctor.id);
    });

    it("Should return an error response if the clinic doesn't exist", async () => {
      const { status, body } = await request(app).get(doctorsFromClinicUrl.replace("<id>", uuidV4()));

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Clinic not found");
    });

    it("Should get a clinic with no doctors if there isn't anyone associated with then", async () => {
      const exampleClinic = await ctx.db.clinicRepository.save(generateMockClinic({}));
      const { status, body } = await request(app).get(doctorsFromClinicUrl.replace("<id>", exampleClinic.id));
      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.clinic.id).toBe(exampleClinic.id);
      expect(body.data.doctors.length).toBe(0);
    });
  });

  describe("Get Filtered Doctors From Clinic", () => {
    it("Should get the clinic with the filtered doctors by the search parameter", async () => {
      const { status, body } = await request(app).post(doctorsFromClinicUrl.replace("<id>", createdClinic.id)).send({ search: createdDoctor.name[0] });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctors.length).toBe(1);
      expect(body.data.doctors[0].id).toBe(createdDoctor.id);
    });

    it("Should return an empty list if doesn't exist doctors in this clinic that match the search parameter", async () => {
      const { status, body } = await request(app).post(doctorsFromClinicUrl.replace("<id>", createdClinic.id)).send({ search: "Invalid Doctor" });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctors.length).toBe(0);
    });
  });

  describe("Get Line From Clinic", () => {
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
      const url = lineFromClinicUrl.replace("<clinicId>", createdClinic.id).replace("<doctorId>", createdDoctor.id);
      const { status, body } = await request(app).get(url);

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.doctor.id).toBe(createdDoctor.id);
      expect(body.data.line.id).toBe(createdLine.id);
      expect(body.data.line.patients.length).toBe(1);
      expect(body.data.line.patients[0].id).toBe(createdPatient.id);
    });

    it("Should throw an error response if the doctor/clinic doesn't exist, or are not related", async () => {
      const url = lineFromClinicUrl.replace("<clinicId>", uuidV4()).replace("<doctorId>", uuidV4());
      const { status, body } = await request(app).get(url);

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The doctor line was not found");
    });
  });
});
