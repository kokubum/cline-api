import * as faker from "faker";
import { AttendingInfo } from "../../../src/@types/attendingDay.types";
import { Context } from "../../../src/helpers/requestContext";
import { Clinic, ClinicDoctor, Doctor, LinePatient } from "../../../src/models";

import { ClinicDoctorService } from "../../../src/services/ClinicDoctorService";
import { LinePatientService } from "../../../src/services/LinePatientService";
import { LineService } from "../../../src/services/LineService";
import { generateMockClinic } from "../../__mocks__/clinic";
import { generateMockClinicDoctor } from "../../__mocks__/clinicDoctors";
import { generateMockDoctor } from "../../__mocks__/doctor";
import { generateMockLine } from "../../__mocks__/line";
import { generateMockLinePatient, generateMockLinePatientList } from "../../__mocks__/linePatient";
import { generateMockPatient } from "../../__mocks__/patient";
import { generateTestContext } from "../../helper";

let lineService:LineService;
let isAttendingTodaySpy:jest.SpyInstance<AttendingInfo, [clinicDoctor:ClinicDoctor]>;
let setWaitingTimeSpy:jest.SpyInstance<string|null, [avgAttendingTime:string|null, linePatients:LinePatient[]]>;
let waitingTimeBase:string;
let ctx:Context;

describe("Line Service", () => {
  beforeAll(() => {
    ctx = generateTestContext();
    lineService = new LineService();
    isAttendingTodaySpy = jest.spyOn(ClinicDoctorService, "isAttendingToday").mockReturnValue({
      isAttendingToday: true,
      onDuty: false,
      time: null
    });
    waitingTimeBase = "00:20:00";
    setWaitingTimeSpy = jest.spyOn(LinePatientService, "setWaitingTime").mockReturnValue(waitingTimeBase);
  });

  afterEach(() => {
    isAttendingTodaySpy.mockClear();
    setWaitingTimeSpy.mockClear();
  });

  describe("Instance", () => {
    it("Should create an instance of the LineService", () => {
      expect(lineService).toBeInstanceOf(LineService);
    });
  });

  describe("Format Called Patient", () => {
    it("Should return a formatted linePatient", () => {
      const mockLinePatient = generateMockLinePatient({}, 1);

      const formattedLinePatient = LineService.formatCalledPatient(mockLinePatient);
      expect(formattedLinePatient).toEqual({
        studentId: mockLinePatient.patient.id,
        studentName: mockLinePatient.patient.name,
        lineStudentId: mockLinePatient.id
      });
    });
  });

  describe("Delete Patient", () => {
    it("Should soft delete the line patient with no return", () => {
      ctx.db.linePatientRepository.save = jest.fn().mockResolvedValue("");
      const mockLinePatient = generateMockLinePatient({}, 1);

      return expect(lineService.deletePatient(ctx, mockLinePatient)).resolves.not.toThrow();
    });
  });

  describe("Insert In Line", () => {
    it("Shoult insert a patient in the line", async () => {
      const total = 5;
      const mockPatient = generateMockPatient({});
      const mockLine = generateMockLine({});
      mockLine.linePatients = generateMockLinePatientList({ count: total });

      const returnedMockSave = {
        line: mockLine,
        student: mockPatient,
        position: total + 1,
        waitingTime: waitingTimeBase
      };
      ctx.db.linePatientRepository.save = jest.fn().mockResolvedValue(returnedMockSave);

      const insertedInLine = await lineService.insertInLine(ctx, mockLine, mockPatient);
      expect(setWaitingTimeSpy).toBeCalledTimes(1);
      expect(insertedInLine).toEqual(returnedMockSave);
    });
  });

  describe("Check If The Doctor Is Attending Today", () => {
    it("Should not throw an error if the doctor is attendingToday", async () => {
      const mockLine = generateMockLine({});
      ctx.db.lineRepository.findLineById = jest.fn().mockResolvedValue(mockLine);
      return expect(lineService.checkIfDoctorIsAttendingToday(ctx, mockLine.id)).resolves.not.toThrow();
    });

    it("Should throw an error if the doctor is not attending today", async () => {
      isAttendingTodaySpy.mockReturnValue({
        isAttendingToday: false,
        onDuty: false,
        time: null
      });
      const mockLine = generateMockLine({});
      ctx.db.lineRepository.findLineById = jest.fn().mockResolvedValue(mockLine);
      return expect(lineService.checkIfDoctorIsAttendingToday(ctx, mockLine.id)).rejects.toThrow("Cannot activate a line because the doctor is not attending today");
    });
  });

  describe("Check If Patient Is In Line", () => {
    it("Should not throw an error when the patient is in line", async () => {
      const mockLinePatient = generateMockLinePatient({}, 1);
      ctx.db.linePatientRepository.getPatientInLine = jest.fn().mockResolvedValue(mockLinePatient);

      const linePatientInLine = await lineService.checkIfPatientIsInLine(ctx, mockLinePatient.line.id, mockLinePatient.patient.id);
      expect(linePatientInLine).toEqual(mockLinePatient);
    });
    it("Should throw an error if the patient isn't in line", async () => {
      ctx.db.linePatientRepository.getPatientInLine = jest.fn().mockResolvedValue(undefined);
      const randomId = faker.datatype.uuid();

      return expect(lineService.checkIfPatientIsInLine(ctx, randomId, randomId)).rejects.toThrow("The patient isn't in line");
    });
  });

  describe("Check If Patient Already In Line", () => {
    it("Should not throw an error when the patient isn't in line", () => {
      ctx.db.linePatientRepository.getPatientInLine = jest.fn().mockResolvedValue(undefined);
      const randomId = faker.datatype.uuid();

      return expect(lineService.checkIfPatientAlreadyInLine(ctx, randomId, randomId)).resolves.not.toThrow();
    });

    it("Should throw an error if the patient is already in line", () => {
      const mockLinePatient = generateMockLinePatient({}, 1);
      ctx.db.linePatientRepository.getPatientInLine = jest.fn().mockResolvedValue(mockLinePatient);
      return expect(lineService.checkIfPatientAlreadyInLine(ctx, mockLinePatient.line.id, mockLinePatient.patient.id)).rejects.toThrow("The patient is already in line");
    });
  });

  describe("Finish Attendment", () => {
    it("Should not throw an error when finish the attendment", () => {
      ctx.db.clinicDoctorRepository.save = jest.fn().mockResolvedValue("");
      ctx.db.linePatientRepository.save = jest.fn().mockResolvedValue("");
      ctx.db.linePatientRepository.updateWaitingTimes = jest.fn().mockResolvedValue("");
      const mockLinePatient = generateMockLinePatient({}, 1);
      mockLinePatient.line = generateMockLine({});
      const mockDoctor = generateMockDoctor({});
      const mockClinic = generateMockClinic({});
      mockLinePatient.line.clinicDoctor = generateMockClinicDoctor({}, mockDoctor, mockClinic);
      ctx.db.linePatientRepository.findByIdAndDoctor = jest.fn().mockResolvedValue(mockLinePatient);
      const randomId = faker.datatype.uuid();
      return expect(lineService.finishAttendment(ctx, randomId, randomId, randomId)).resolves.not.toThrow();
    });
  });

  describe("Call Patient", () => {
    let mockClinic:Clinic;
    let mockDoctor:Doctor;
    let mockLinePatients:LinePatient[];
    let updateWaitinTimesStub: jest.Mock;
    beforeAll(() => {
      ctx.db.linePatientRepository.update = jest.fn().mockResolvedValue("");
      ctx.db.linePatientRepository.updatePositions = jest.fn().mockResolvedValue("");
      updateWaitinTimesStub = jest.fn().mockResolvedValue("");
      ctx.db.linePatientRepository.updateWaitingTimes = updateWaitinTimesStub;
      mockLinePatients = generateMockLinePatientList({});
      mockLinePatients[0].line = generateMockLine({});
      mockDoctor = generateMockDoctor({});
      mockClinic = generateMockClinic({});
    });
    afterEach(() => {
      updateWaitinTimesStub.mockClear();
    });
    it("Should not throw an error when call the patient ", async () => {
      mockLinePatients[0].line.clinicDoctor = generateMockClinicDoctor({}, mockDoctor, mockClinic);
      const formattedCalledPatient = await lineService.callPatient(ctx, mockLinePatients, faker.datatype.uuid());

      expect(formattedCalledPatient).toEqual(LineService.formatCalledPatient(mockLinePatients[0]));
      expect(updateWaitinTimesStub).not.toBeCalled();
    });

    it("Should not throw an error and call the updateWaitingTimes if the avgAttendingTime isn't null", async () => {
      mockLinePatients[0].line.clinicDoctor = generateMockClinicDoctor({ avgAttendingTime: "00:20:00" }, mockDoctor, mockClinic);
      const formattedCalledPatient = await lineService.callPatient(ctx, mockLinePatients, faker.datatype.uuid());

      expect(formattedCalledPatient).toEqual(LineService.formatCalledPatient(mockLinePatients[0]));
      expect(updateWaitinTimesStub).toBeCalledTimes(1);
    });
  });

  describe("Get Valid Line of Patients", () => {
    it("Should not throw an error if the line is empty", () => {
      ctx.db.linePatientRepository.getLineFromDoctor = jest.fn().mockResolvedValue(generateMockLinePatientList({}));
      const randomId = faker.datatype.uuid();
      return expect(lineService.getValidLineOfPatients(ctx, randomId, randomId)).resolves.not.toThrow();
    });

    it("Should throw an error if the line is empty", () => {
      ctx.db.linePatientRepository.getLineFromDoctor = jest.fn().mockResolvedValue([]);
      const randomId = faker.datatype.uuid();
      return expect(lineService.getValidLineOfPatients(ctx, randomId, randomId)).rejects.toThrow("The line is empty");
    });
  });
});
