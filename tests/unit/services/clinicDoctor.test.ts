import { setHours } from "date-fns";

import * as faker from "faker";
import { Context } from "../../../src/helpers/requestContext";

import { ClinicDoctorService } from "../../../src/services/ClinicDoctorService";

import { generateMockAttendingDays } from "../../__mocks__/attendingDay";
import { generateMockClinic } from "../../__mocks__/clinic";
import { generateMockClinicDoctor, generateMockClinicDoctorList } from "../../__mocks__/clinicDoctors";
import { generateMockDoctor } from "../../__mocks__/doctor";
import { generateMockLine } from "../../__mocks__/line";
import { generateMockLinePatientList } from "../../__mocks__/linePatient";
import { generateTestContext } from "../../helper";

let ctx:Context;
let clinicDoctorService:ClinicDoctorService;

describe("ClinicDoctor Service", () => {
  beforeAll(() => {
    ctx = generateTestContext();
    clinicDoctorService = new ClinicDoctorService();
  });
  describe("Instance", () => {
    it("Should create an instance of ClinicDoctor service", () => {
      expect(clinicDoctorService).toBeInstanceOf(ClinicDoctorService);
    });
  });

  describe("Is Attending Today", () => {
    it("Should return an object with the isAttendingToday property set to true", () => {
      const clinic = generateMockClinic({});
      const doctor = generateMockDoctor({});

      const mockClinicDoctor = generateMockClinicDoctor({}, doctor, clinic);

      mockClinicDoctor.attendingDays = generateMockAttendingDays({ count: 7 });

      const baseTimeFn = Date.now;
      Date.now = ():number => setHours(new Date(), 7).getTime();
      const attendingInfo = ClinicDoctorService.isAttendingToday(mockClinicDoctor);

      expect(attendingInfo.isAttendingToday).toBeTruthy();

      Date.now = baseTimeFn;
    });
  });

  describe("Format Clinic Doctors List", () => {
    it("Should return a formatted doctors list from a specific clinic", () => {
      const mockClinicDoctorList = generateMockClinicDoctorList({});

      const formattedDoctorList = ClinicDoctorService.formatClinicDoctorsList(mockClinicDoctorList);

      expect(formattedDoctorList.length).toBe(1);
      expect(formattedDoctorList[0]).toEqual({
        id: mockClinicDoctorList[0].doctor.id,
        name: mockClinicDoctorList[0].doctor.name,
        isAttendingToday: false,
      });
    });
  });

  describe("Format Doctor Line Info", () => {
    it("Should return a line with the patients and the doctor info", () => {
      const clinic = generateMockClinic({});
      const doctor = generateMockDoctor({});

      const mockClinicDoctor = generateMockClinicDoctor({}, doctor, clinic);
      mockClinicDoctor.line = generateMockLine({});
      mockClinicDoctor.line.linePatients = generateMockLinePatientList({ count: 5 });

      const formattedDoctorLine = ClinicDoctorService.formatDoctorLine(mockClinicDoctor);
      expect(formattedDoctorLine.line.length).toBe(5);
      expect(formattedDoctorLine.coordinator.id).toBe(doctor.id);
    });
  });

  describe("Get Formatted Doctor Line From Clinic", async () => {
    it("Should get the formatted doctor line of the clinic from the db repository", async () => {
      const clinic = generateMockClinic({});
      const doctor = generateMockDoctor({});
      const mockClinicDoctor = generateMockClinicDoctor({}, doctor, clinic);
      ctx.db.clinicDoctorRepository.findDoctorLine = jest.fn().mockResolvedValue(mockClinicDoctor);
      const randomId = faker.datatype.uuid();
      const formattedDoctorLine = await clinicDoctorService.getFormattedDoctorLineFromClinic(ctx, randomId, randomId);

      expect(formattedDoctorLine.coordinator.id).toBe(doctor.id);
      expect(formattedDoctorLine.line.id).toBe(mockClinicDoctor.line.id);
    });
  });
});
