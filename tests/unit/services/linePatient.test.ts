import { LinePatientService } from "../../../src/services/LinePatientService";
import { generateMockLinePatientList } from "../../__mocks__/linePatient";

let linePatient:LinePatientService;

describe("LinePatient Service", () => {
  beforeAll(() => {
    linePatient = new LinePatientService();
  });

  describe("Instance", () => {
    it("Should create an instance of LinePatientService", () => {
      expect(linePatient).toBeInstanceOf(LinePatientService);
    });
  });

  describe("Set Waiting Time", () => {
    it("Should return null if the avgAttendingTime of the Doctor is not set yet", () => {
      const waitingTime = LinePatientService.setWaitingTime(null, []);

      expect(waitingTime).toBeNull();
    });

    it("Should return the avgAttendingTime passed if the linePatients has a length equal to zero", () => {
      const avgAttendingTime = "00:20:00";
      const waitingTime = LinePatientService.setWaitingTime(avgAttendingTime, []);
      expect(waitingTime).toBe(avgAttendingTime);
    });

    it("Should return a valid waiting time based on the last linePatient", () => {
      const avgAttendingTime = "00:20:00";
      const linePatients = generateMockLinePatientList({});
      linePatients[0].waitingTime = "00:10:00";
      const waitingTime = LinePatientService.setWaitingTime(avgAttendingTime, linePatients);

      expect(waitingTime).toBe("00:30:00");
    });

    it("Should return the avgAttendingTime, if the avgAttendingTime is null and the waiting time isn't", () => {
      const linePatients = generateMockLinePatientList({});
      linePatients[0].waitingTime = "00:10:00";
      const waitingTime = LinePatientService.setWaitingTime(null, linePatients);

      expect(waitingTime).toBeNull();
    });
  });
});
