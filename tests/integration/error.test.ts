import request from "supertest";
import app from "../../src/app";
import { AppError } from "../../src/helpers/appError";

import { generateMockLoginBody, generateMockSignUpBody } from "../__mocks__/auth";

jest.mock("../../src/services/ValidateService", () => ({
  ValidateService: jest.fn().mockImplementation(() => ({
    requestBody: jest.fn().mockImplementation((body: object) => {
      if (Object.keys(body).length > 2) throw new Error("Unknown Error");
      throw new AppError("Known 500 Error", 500);
    }),
  })),
}));

describe("Error", () => {
  describe("Global Error Handler", () => {
    it("Should throw an 500 Error with an unknown message when the api doesn't catch properly", async () => {
      const { status, body } = await request(app).post("/api/v1/auth/signup").send(generateMockSignUpBody({}));

      expect(status).toBe(500);
      expect(body.status).toBe("error");
      expect(body.message).toBe("Something went wrong");
    });

    it("Should throw an 500 App Error if the api choose to treat this way", async () => {
      const { status, body } = await request(app).post("/api/v1/auth/login").send(generateMockLoginBody({}));

      expect(status).toBe(500);
      expect(body.status).toBe("error");
      expect(body.message).toBe("Known 500 Error");
    });
  });

  describe("Not Found Url", () => {
    it("Should throw an error if try to access unknown url", async () => {
      const url = "/notFoundUrl";
      const { status, body } = await request(app).get(url);

      expect(status).toBe(404);
      expect(body.message).toBe(`Can't find ${url} on this server`);
    });
  });
});
