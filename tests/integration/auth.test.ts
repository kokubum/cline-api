import request from "supertest";
import { validate as uuidValidate } from "uuid";
import { clearTablesContent } from "../helper";
import app from "../../src/app";
import "../setup";
import { generateSignUpBody } from "../__mocks__/auth";

let signUpUrl: string;

describe("Sign Up", () => {
  beforeAll(() => {
    signUpUrl = "/api/v1/auth/signup";
  });

  beforeEach(async () => {
    await clearTablesContent();
  });

  it("Should sign up an User and return a valid id", async () => {
    const { status, body } = await request(app)
      .post(signUpUrl)
      .send(generateSignUpBody({}));

    expect(status).toBe(201);
    expect(body.status).toBe("success");
    expect(uuidValidate(body.data.id)).toBeTruthy();
  });

  it("Should throw an error if any of the fields are missing", async () => {
    const { status, body } = await request(app).post(signUpUrl).send({});

    expect(status).toBe(400);
    expect(body.status).toBe("fail");
    expect(body.message).toBe("Missing some fields");
    expect(body.data.password).toBe("This field is required");
    expect(body.data.email).toBe("This field is required");
  });

  it("Should throw an error if any of the fields are empty strings", async () => {
    const { status, body } = await request(app)
      .post(signUpUrl)
      .send({ firstName: "" });

    expect(status).toBe(400);
    expect(body.status).toBe("fail");
    expect(body.data.firstName).toBe("This field is required");
  });

  it("Should throw an error if try to sent more than one word in the name field (firstName or lastName)", async () => {
    const { status, body } = await request(app)
      .post(signUpUrl)
      .send(generateSignUpBody({ lastName: "first second" }));

    expect(status).toBe(400);
    expect(body.status).toBe("fail");
    expect(body.message).toBe("Some misformatted fields");
    expect(body.data.lastName).toBe(
      "This field need to have only a single word"
    );
  });

  it("Should throw an error if try to send an invalid email", async () => {
    const { status, body } = await request(app)
      .post(signUpUrl)
      .send(generateSignUpBody({ email: "misformatted email" }));

    expect(status).toBe(400);
    expect(body.status).toBe("fail");
    expect(body.message).toBe("Invalid email field");
    expect(body.data.email).toBe("This field have an invalid format");
  });

  it("Should throw an error if try to signup an existing user", async () => {
    await request(app)
      .post(signUpUrl)
      .send(generateSignUpBody({ email: "unique@email.com" }));

    const { status, body } = await request(app)
      .post(signUpUrl)
      .send(generateSignUpBody({ email: "unique@email.com" }));

    expect(status).toBe(400);
    expect(body.message).toBe("This email is already registered");
    expect(body.data).toBeNull();
  });
});
