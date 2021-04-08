import request from "supertest";
import { validate as uuidValidate } from "uuid";
import { clearTablesContent } from "../helper";
import app from "../../src/app";
import "../setup";

describe("Sign Up", () => {
  beforeEach(async () => {
    await clearTablesContent();
  });

  it.only("Should sign up an User and return a valid id", async () => {
    const { status, body } = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName: "randomFirstName",
        lastName: "randomLastName",
        password: "randomPassword",
        email: "randomUnique@email.com",
      });

    expect(status).toBe(201);
    expect(body.status).toBe("success");
    expect(uuidValidate(body.data.id)).toBeTruthy();
  });

  it("Should throw an error if the firstName wasn't sent", async () => {
    const { status, body } = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        lastName: "randomLastName",
        password: "randomPassword",
        email: "randomUnique@email.com",
      });

    expect(status).toBe(400);
    expect(body.status).toBe("fail");
    expect(body.data.firstName).toBe("The firstName field is required");
  });
});
