import request from "supertest";
import { clearTablesContent } from "../helper";
import app from "../../src/app";
import "../setup";

describe("Sign Up", () => {
  beforeEach(async () => {
    await clearTablesContent();
  });

  it("Should register an User and return his information", async () => {
    const response = await request(app).post("/api/v1/auth/signup").send({
      firstName: "randomFirstName",
      lastName: "randomLastName",
      password: "randomPassword",
      email: "randomUniqueEmail",
    });

    expect(response.status).toBe(200);
  });
});
