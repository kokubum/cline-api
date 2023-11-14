import * as faker from "faker";
import { AttendingInfo } from "../../../src/@types/attendingDay.types";
import { Context } from "../../../src/helpers/requestContext";
import { ClinicDoctor } from "../../../src/models";
import { ClinicDoctorService } from "../../../src/services/ClinicDoctorService";
import { DoctorService } from "../../../src/services/DoctorService";
import { generateMockClinicDoctorList } from "../../__mocks__/clinicDoctors";
import { generateMockDoctor } from "../../__mocks__/doctor";
import { generateTestContext } from "../../helper";

let ctx: Context;
let doctorService:DoctorService;
let isAttendingTodaySpy:jest.SpyInstance<AttendingInfo, [clinicDoctor:ClinicDoctor]>;

describe("Doctor Service", () => {
  beforeAll(() => {
    ctx = generateTestContext();

    doctorService = new DoctorService();
    isAttendingTodaySpy = jest.spyOn(ClinicDoctorService, "isAttendingToday").mockReturnValue({
      isAttendingToday: false,
      onDuty: false,
      time: null
    });
  });

  afterEach(() => {
    isAttendingTodaySpy.mockClear();
  });

  describe("Instance", () => {
    it("Should create an instance of doctor service", () => {
      expect(doctorService).toBeInstanceOf(DoctorService);
    });
  });

  describe("Format Clinic List", () => {
    it("Should return a formatted clinic list", () => {
      const total = 5;
      const clinicDoctorList = generateMockClinicDoctorList({ count: total });
      const formattedClinicList = DoctorService.formatClinicList(clinicDoctorList);

      expect(isAttendingTodaySpy).toBeCalledTimes(total);
      expect(formattedClinicList.length).toBe(total);
      expect(formattedClinicList[0]).toEqual({
        id: clinicDoctorList[0].clinic.id,
        name: clinicDoctorList[0].clinic.name,
        isAttendingToday: false
      });
    });
  });

  describe("Format Doctor Info", () => {
    it("Should return a basic doctor info", () => {
      const mockDoctor = generateMockDoctor({});
      const formattedDoctor = DoctorService.formatDoctorInfo(mockDoctor);

      expect(formattedDoctor).toEqual({
        id: mockDoctor.id,
        name: mockDoctor.name,
        crm: mockDoctor.crm
      });
    });
  });

  describe("Get Formatted Doctor With Clinics", () => {
    it("Should return a formatted object with the doctor info and a clinic list", async () => {
      const mockDoctor = generateMockDoctor({});
      ctx.db.doctorRepository.findDoctorClinics = jest.fn().mockResolvedValue(mockDoctor);

      const formattedDoctorWithClinics = await doctorService.getFormattedDoctorWithClinics(ctx, faker.datatype.uuid());

      expect(formattedDoctorWithClinics).toEqual({
        coordinator: DoctorService.formatDoctorInfo(mockDoctor),
        universities: DoctorService.formatClinicList(mockDoctor.clinicDoctors)
      });
    });
  });
});
