import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app";
import { Context, RequestContext } from "../../src/helpers/requestContext";
import { clearTablesContent } from "../helper";
import { generateMockSignUpBody } from "../__mocks__/auth";

let ctx: Context;
let logoutUrl: string;
let signUpUrl: string;
let activateUrl: string;
let loginUrl: string;

describe("Middlewares", () => {
  beforeAll(() => {
    ctx = RequestContext.getInstance();
    logoutUrl = "/api/v1/auth/logout";
    signUpUrl = "/api/v1/auth/signup";
    activateUrl = "/api/v1/auth/activate-account";
    loginUrl = "/api/v1/auth/login";
  });

  beforeEach(async () => {
    await clearTablesContent();
  });

  describe("Protect Authentication", () => {
    let token: String;

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

    it("Should throw an error if the authorization header is empty", async () => {
      const { status, body } = await request(app).get(logoutUrl);

      expect(status).toBe(400);
      expect(body.message).toBe("Missing Token");
    });

    it("Should throw an error if the token passed has a length different from 2", async () => {
      const { status, body } = await request(app).get(logoutUrl).set("Authorization", "RandomToken");

      expect(status).toBe(400);
      expect(body.message).toBe("Misformatted Token");
    });

    it("Should throw an error if the token passed has a length equal to but not start with the 'Bearer' string", async () => {
      const { status, body } = await request(app).get(logoutUrl).set("Authorization", "Invalid RandomToken");

      expect(status).toBe(400);
      expect(body.message).toBe("Misformatted Token");
    });

    it("Should throw an error if the token is expired", async () => {
      const jwtSpy = jest.spyOn(jwt, "verify").mockImplementation(() => {
        const err = new Error();
        err.name = "TokenExpiredError";
        throw err;
      });

      const { body, status } = await request(app).get(logoutUrl).set("Authorization", `Bearer ${token}`);

      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Expired Token");
      expect(jwtSpy).toBeCalledTimes(1);

      jwtSpy.mockRestore();
    });

    it("Should throw a random error if the verify method fail with no expired time", async () => {
      const jwtSpy = jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error();
      });

      const { body, status } = await request(app).get(logoutUrl).set("Authorization", `Bearer ${token}`);

      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("Token Error");
      expect(jwtSpy).toBeCalledTimes(1);

      jwtSpy.mockRestore();
    });

    it("Should throw an error if the session no longer exists", async () => {
      await ctx.db.sessionRepository.delete({});

      const { body, status } = await request(app).get(logoutUrl).set("Authorization", `Bearer ${token}`);

      expect(status).toBe(401);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This Session is no longer active");
    });

    it("Should throw an error if the user no longer exists", async () => {
      await ctx.db.userRepository.delete({});

      const { body, status } = await request(app).get(logoutUrl).set("Authorization", `Bearer ${token}`);

      expect(status).toBe(404);
      expect(body.status).toBe("fail");
      expect(body.message).toBe("This user no longer exists");
    });
  });
});
