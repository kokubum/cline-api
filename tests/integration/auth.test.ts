import request from "supertest";
import { validate as uuidValidate } from "uuid";
import { addDays } from "date-fns";
import * as faker from "faker";
import { clearTablesContent } from "../helper";
import app from "../../src/app";
import { generateMockLoginBody, generateMockSignUpBody } from "../__mocks__/auth";
import { Context, RequestContext } from "../../src/helpers/requestContext";

let signUpUrl: string;
let loginUrl: string;
let activateUrl: string;
let sendActivateUrl: string;
let sendRecoverUrl: string;
let recoverUrl: string;
let logoutUrl: string;
let ctx: Context;

describe("Authentication", () => {
  beforeAll(() => {
    ctx = RequestContext.getInstance();
    signUpUrl = "/api/v1/auth/signup";
    loginUrl = "/api/v1/auth/login";
    activateUrl = "/api/v1/auth/activate-account";
    sendActivateUrl = "/api/v1/auth/send-activation";
    sendRecoverUrl = "/api/v1/auth/send-recovery";
    recoverUrl = "/api/v1/auth/recover-password";
    logoutUrl = "/api/v1/auth/logout";
  });
  beforeEach(async () => {
    await clearTablesContent();
  });

  describe("Sign Up", () => {
    it("Should signup an User and return a valid id", async () => {
      const { status, body } = await request(app).post(signUpUrl).send(generateMockSignUpBody({}));

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

    it("Should throw an error if the name fields are empty string", async () => {
      const { status, body } = await request(app).post(signUpUrl).send(generateMockSignUpBody({ firstName: "" }));

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Some misformatted fields");
      expect(body.data.firstName).toBe("This field need to have a single word");
    });

    it("Should throw an error if try to signup an existing user", async () => {
      await request(app)
        .post(signUpUrl)
        .send(generateMockSignUpBody({ email: "unique@email.com" }));

      const { status, body } = await request(app)
        .post(signUpUrl)
        .send(generateMockSignUpBody({ email: "unique@email.com" }));

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This email is already registered");
      expect(body.data).toBeNull();
    });

    it("Should throw an error if the password has less then 10 characters", async () => {
      const { status, body } = await request(app)
        .post(signUpUrl)
        .send(generateMockSignUpBody({ password: "small" }));

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Invalid password field");
      expect(body.data.password).toBe("This field must be longer or equal to 10 characters");
    });

    it("Should throw an error if the confirmPassword doesn't match the password field", async () => {
      const { status, body } = await request(app)
        .post(signUpUrl)
        .send(generateMockSignUpBody({ confirm: "password_mismatch_field" }));

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The password doesn't match");
      expect(body.data.confirmPassword).toBe("This field have to be equal to the password field");
    });
  });
  describe("Login", () => {
    it("Should login an existing user and receive a token when the valid credentials are passed ", async () => {
      await request(app)
        .post(signUpUrl)
        .send(
          generateMockSignUpBody({
            email: "existing@email.com",
            password: "random_password",
          }),
        );

      await ctx.db.userRepository.update({}, { active: true });
      const { status, body } = await request(app).post(loginUrl).send({
        email: "existing@email.com",
        password: "random_password",
      });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.token).toBeTruthy();
    });

    it("Should throw an error if the password or the email wasn't sent", async () => {
      const { status, body } = await request(app).post(loginUrl).send({
        email: "random@email.com",
      });

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.data.password).toBe("This field is required");
    });

    it("Should throw an error if the email or the password are invalid", async () => {
      const { status, body } = await request(app).post(loginUrl).send(generateMockLoginBody({}));

      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Invalid credentials");
    });

    it("Should throw an error if the user isn't activated yet", async () => {
      await request(app)
        .post(signUpUrl)
        .send(
          generateMockSignUpBody({
            email: "random_not_activate@email.com",
            password: "random_password",
          }),
        );

      const { status, body } = await request(app).post(loginUrl).send({
        email: "random_not_activate@email.com",
        password: "random_password",
      });

      expect(status).toBe(403);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This account is not activated yet");
    });
  });

  describe("Activate the account", () => {
    it("Should activate an existing account that wasn't activate yet", async () => {
      await request(app).post(signUpUrl).send(generateMockSignUpBody({}));

      const token = await ctx.db.tokenRepository.findOne();

      const { status, body } = await request(app).get(`${activateUrl}/${token?.tokenCode}`);

      expect(status).toBe(200);
      expect(body.status).toBe("success");
    });

    it("Should throw an error if the activation token are expired", async () => {
      await request(app).post(signUpUrl).send(generateMockSignUpBody({}));

      const newDateMiliseconds = addDays(new Date(), 1).getTime();
      const nowRef = Date.now;
      Date.now = (): number => newDateMiliseconds;

      const token = await ctx.db.tokenRepository.findOne();

      const { status, body } = await request(app).get(`${activateUrl}/${token?.tokenCode}`);
      Date.now = nowRef;

      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Token has expired");
    });

    it("Should throw an error if try to activate an user that don't exist anymore", async () => {
      await request(app).post(signUpUrl).send(generateMockSignUpBody({}));
      const token = await ctx.db.tokenRepository.findOne();
      await ctx.db.userRepository.delete({});

      const { status, body } = await request(app).get(`${activateUrl}/${token?.tokenCode}`);
      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This user no longer exists");
    });

    it("Should throw an error if the activation code is invalid", async () => {
      const { status, body } = await request(app).get(`${activateUrl}/${faker.datatype.uuid()}`);
      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Invalid activation token");
    });
  });

  describe("Send Activation Link", () => {
    it("Should send the activation link, if the user are registered and isn't activated yet", async () => {
      const email = "random@email.com";
      await request(app).post(signUpUrl).send(generateMockSignUpBody({ email }));
      const { body, status } = await request(app).post(sendActivateUrl).send({ email });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
    });

    it("Should throw an error if the user isn't registered", async () => {
      const { body, status } = await request(app).post(sendActivateUrl).send({ email: "random@email.com" });

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This email is not registered");
    });

    it("Should thrown an error if the user is activated already", async () => {
      const email = "random@email.com";
      await request(app).post(signUpUrl).send(generateMockSignUpBody({ email }));
      const token = await ctx.db.tokenRepository.findOne();
      await request(app).get(`${activateUrl}/${token?.tokenCode}`);

      const { body, status } = await request(app).post(sendActivateUrl).send({ email });

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This email is already active");
    });
  });

  describe("Send Recover Link", () => {
    it("Should send a recovery link if the email is registered and the user is activated", async () => {
      const email = "random@email.com";
      await request(app).post(signUpUrl).send(generateMockSignUpBody({ email }));
      const token = await ctx.db.tokenRepository.findOne();

      await request(app).get(`${activateUrl}/${token?.tokenCode}`);
      const { status, body } = await request(app).post(sendRecoverUrl).send({ email });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
    });

    it("Should return success if the user is not registered or not activated", async () => {
      const { status, body } = await request(app).post(sendRecoverUrl).send({ email: "random@email.com" });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
    });
  });

  describe("Verify Recover Link", () => {
    const email = "random@email.com";
    beforeEach(async () => {
      await request(app).post(signUpUrl).send(generateMockSignUpBody({ email }));
      const activationToken = await ctx.db.tokenRepository.findOne();

      await request(app).get(`${activateUrl}/${activationToken?.tokenCode}`);
    });

    it("Should validate the recovery link that was sent", async () => {
      await request(app).post(sendRecoverUrl).send({ email });
      const recoverToken = await ctx.db.tokenRepository.findOne();
      const { status, body } = await request(app).get(`${recoverUrl}/${recoverToken?.tokenCode}`);

      expect(status).toBe(200);
      expect(body.status).toBe("success");
    });

    it("Should throw an error if the token is expired", async () => {
      await request(app).post(sendRecoverUrl).send({ email });
      const recoverToken = await ctx.db.tokenRepository.findOne();

      const newDateMiliseconds = addDays(new Date(), 1).getTime();
      const nowRef = Date.now;
      Date.now = (): number => newDateMiliseconds;

      const { status, body } = await request(app).get(`${recoverUrl}/${recoverToken?.tokenCode}`);
      Date.now = nowRef;

      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Token has expired");
    });

    it("Should throw an error if the user no longer exists", async () => {
      await request(app).post(sendRecoverUrl).send({ email });
      const recoverToken = await ctx.db.tokenRepository.findOne();
      await ctx.db.userRepository.delete({});
      const { status, body } = await request(app).get(`${recoverUrl}/${recoverToken?.tokenCode}`);
      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This user no longer exists");
    });
  });

  describe("Recover Password", () => {
    const email = "random@email.com";
    beforeEach(async () => {
      await request(app).post(signUpUrl).send(generateMockSignUpBody({ email }));
      const activationToken = await ctx.db.tokenRepository.findOne();

      await request(app).get(`${activateUrl}/${activationToken?.tokenCode}`);
    });

    it("Should update the password if valid credentials and token are passed", async () => {
      await request(app).post(sendRecoverUrl).send({ email });
      const recoverToken = await ctx.db.tokenRepository.findOne();

      const { status, body } = await request(app)
        .post(`${recoverUrl}/${recoverToken?.tokenCode}`)
        .send({ password: "random_password", confirmPassword: "random_password" });

      expect(status).toBe(200);
      expect(body.status).toBe("success");
    });

    it("Should throw an error if the password and confirmPassword doesn't match", async () => {
      await request(app).post(sendRecoverUrl).send({ email });
      const recoverToken = await ctx.db.tokenRepository.findOne();

      const { status, body } = await request(app)
        .post(`${recoverUrl}/${recoverToken?.tokenCode}`)
        .send({ password: "random_password", confirmPassword: "random_password_mismatch" });

      expect(status).toBe(400);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("The password doesn't match");
    });
  });

  describe("Logout User", () => {
    let token: string;

    beforeEach(async () => {
      const signUpBody = generateMockSignUpBody({});
      await request(app).post(signUpUrl).send(generateMockSignUpBody(signUpBody));
      const activationToken = await ctx.db.tokenRepository.findOne();

      await request(app).get(`${activateUrl}/${activationToken?.tokenCode}`);

      const { body } = await request(app)
        .post(loginUrl)
        .send({ email: signUpBody.email, password: signUpBody.password });

      token = body.data.token;
    });

    it("Should logout an user that is logged in", async () => {
      const { body, status } = await request(app).get(logoutUrl).set("Authorization", `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data).toBeNull();
    });
  });
});
