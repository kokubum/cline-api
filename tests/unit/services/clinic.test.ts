import * as faker from "faker";
import { AttendingInfo } from "../../../src/@types/attendingDay.types";
import { Context } from "../../../src/helpers/requestContext";
import { ClinicDoctor } from "../../../src/models";
import { ClinicService } from "../../../src/services";
import { ClinicDoctorService } from "../../../src/services/ClinicDoctorService";
import { generateMockClinic } from "../../__mocks__/clinic";
import { generateMockClinicDoctorList } from "../../__mocks__/clinicDoctors";
import { generateTestContext } from "../../helper";

let clinicService:ClinicService;
let ctx:Context;
let isAttendingTodaySpy:jest.SpyInstance<AttendingInfo, [clinicDoctor:ClinicDoctor]>;

describe("Clinic Service", () => {
  beforeAll(() => {
    ctx = generateTestContext();
    clinicService = new ClinicService();
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
    it("Should create an instace of ClinicService", () => {
      expect(clinicService).toBeInstanceOf(ClinicService);
    });
  });

  describe("Format the Clinic Information", () => {
    it("Should return a formatted clinic object", () => {
      const mockClinic = generateMockClinic({});
      const formattedClinicInfo = ClinicService.formatClinicInfo(mockClinic);

      expect(formattedClinicInfo).toEqual({
        id: mockClinic.id,
        name: mockClinic.name,
        phone: mockClinic.phone,
        address: mockClinic.address,
      });
    });
  });

  describe("Format Doctors List", () => {
    it("Should return a formatted doctors list", () => {
      const total = 5;
      const clinicDoctorsList = generateMockClinicDoctorList({ count: total });

      const formattedDoctorList = ClinicService.formatDoctorsList(clinicDoctorsList);

      expect(formattedDoctorList.length).toBe(total);
      expect(formattedDoctorList[0]).toEqual({
        id: clinicDoctorsList[0].doctor.id,
        name: clinicDoctorsList[0].doctor.name,
        isAttendingToday: false
      });

      expect(isAttendingTodaySpy).toBeCalledTimes(total);
    });
  });

  describe("Get Formatted Doctors List from a Clinic", () => {
    it("Should return a formatted list of doctors from the db", async () => {
      const total = 5;
      const clinicDoctorsList = generateMockClinicDoctorList({ count: total });
      ctx.db.clinicDoctorRepository.findDoctorsFromClinic = jest.fn().mockResolvedValue(clinicDoctorsList);

      const formattedDoctorList = await clinicService.getFormattedDoctorsListFromClinic(ctx, faker.datatype.uuid(), "");

      expect(formattedDoctorList.length).toBe(total);
      expect(formattedDoctorList[0]).toEqual({
        id: clinicDoctorsList[0].doctor.id,
        name: clinicDoctorsList[0].doctor.name,
        isAttendingToday: false
      });
      expect(isAttendingTodaySpy).toBeCalledTimes(total);
    });
  });

  describe("Get Formatted Clinic With Doctors", () => {
    it("Should return an object with the clinic info and the doctors list", async () => {
      const mockClinic = generateMockClinic({});
      ctx.db.clinicRepository.findClinicWithDoctors = jest.fn().mockResolvedValue(mockClinic);

      const formattedClinicWithDoctors = await clinicService.getFormattedClinicWithDoctors(ctx, faker.datatype.uuid());

      expect(formattedClinicWithDoctors).toEqual({
        university: ClinicService.formatClinicInfo(mockClinic),
        coordinators: ClinicService.formatDoctorsList(mockClinic.clinicDoctors)
      });
    });
  });
});
