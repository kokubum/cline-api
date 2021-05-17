import * as faker from "faker";
import sgMail from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/client/src/response";
import { EmailService } from "../../../src/services";

let emailService: EmailService;

describe("Email Service", () => {
  beforeAll(() => {
    emailService = new EmailService();
  });
  describe("Instance", () => {
    it("Should create an instace of EmailService", () => {
      expect(emailService).toBeInstanceOf(EmailService);
    });
  });

  describe("Send Email Link", () => {
    it("Should send an email using activation url", () => {
      expect(() =>
        emailService.sendEmailLink("random@email.com", faker.datatype.uuid(), "Random", "activation"),
      ).not.toThrow();
    });

    it("Should send an email using the recovery url", () => {
      expect(() =>
        emailService.sendEmailLink("random@email.com", faker.datatype.uuid(), "Random", "recovery"),
      ).not.toThrow();
    });

    it("Should throw a silence error if the email wasn't sent", () => {
      const mockedSgMailSend = sgMail.send as jest.Mock<Promise<[ClientResponse, {}]>>;
      mockedSgMailSend.mockImplementation(() => {
        throw new Error();
      });

      expect(() =>
        emailService.sendEmailLink("random@email.com", faker.datatype.uuid(), "Random", "recovery"),
      ).not.toThrow();
    });
  });
});
