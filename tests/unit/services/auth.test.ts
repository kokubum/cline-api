import { addDays, addMinutes, subDays } from "date-fns";
import * as faker from "faker";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { DecodedJWT, SignUpBody } from "../../../src/@types/auth.types";
import { expiresDays, linkExpirationTime, secretKey } from "../../../src/config";
import { Context } from "../../../src/helpers/requestContext";
import { capitalizeName } from "../../../src/helpers/utils";
import { Session, Token } from "../../../src/models";
import { AuthService } from "../../../src/services";
import { generateTestContext } from "../../helper";
import { generateMockSignUpBody, generateTokenModel } from "../../__mocks__/auth";
import { generateMockPatient } from "../../__mocks__/patient";

let authService:AuthService;
let ctx:Context;

describe("Auth Service", () => {
  beforeAll(() => {
    ctx = generateTestContext();
    authService = new AuthService();
  });

  describe("Instance", () => {
    it("Should create an instace of AuthService", () => {
      expect(authService).toBeInstanceOf(AuthService);
    });
  });

  describe("Check Login Credentials", () => {
    it("Should check the credentials and return the valid patient object", async () => {
      const patient = generateMockPatient({ password: await AuthService.hashPassword("teste_password") });
      ctx.db.patientRepository.findByEmail = jest.fn().mockResolvedValueOnce(patient);
      const returnedPatient = await authService.checkLoginCredentials(ctx, patient.email, "teste_password");

      expect(returnedPatient.id).toBe(patient.id);
      expect(returnedPatient.email).toBe(patient.email);
    });

    it("Should throw an error if the patient doesn't exist", async () => {
      ctx.db.patientRepository.findByEmail = jest.fn().mockResolvedValueOnce(undefined);
      return expect(authService.checkLoginCredentials(ctx, "random_email", "teste_password")).rejects.toThrow("Invalid credentials");
    });
    it("Should throw an error if the password doesn't match the patient password", async () => {
      const patient = generateMockPatient({ password: await AuthService.hashPassword("teste_password") });
      ctx.db.patientRepository.findByEmail = jest.fn().mockResolvedValueOnce(patient);
      return expect(authService.checkLoginCredentials(ctx, patient.email, "wrong_password")).rejects.toThrow("Invalid credentials");
    });
  });

  describe("Register Patient", () => {
    it("Should hash the patient and return the patient that was registered", async () => {
      const signupBody = generateMockSignUpBody({});
      const mockPatient = generateMockPatient({});
      ctx.db.patientRepository.save = jest.fn().mockImplementationOnce((patient:SignUpBody) => ({
        ...mockPatient,
        email: patient.email,
        document: patient.document,
        password: AuthService.hashPassword(signupBody.password),
        firstName: capitalizeName(patient.firstName),
        lastName: capitalizeName(patient.lastName),
      }));

      const patient = await authService.registerPatient(ctx, signupBody);
      expect(patient.email).toBe(signupBody.email);
      expect(patient.id).toBe(mockPatient.id);
    });
  });

  describe("Save Token", () => {
    it("Should generate token code, save and return the token object", async () => {
      const mockToken = generateTokenModel(AuthService.generateTokenCode());
      ctx.db.tokenRepository.save = jest.fn().mockImplementationOnce((token:Token) => ({
        ...mockToken,
        patientId: token.patientId,
        expiresAt: AuthService.generateLinkExpireTime(),
      }));
      const patientId = uuidV4();
      const token = await authService.saveToken(ctx, patientId);

      expect(token.id).toBe(mockToken.id);
      expect(token.patientId).toBe(patientId);
      expect(token.tokenCode).toBe(mockToken.tokenCode);
    });
  });

  describe("Create Session", () => {
    it("Should create a jwt,save into the session, and return the session object", async () => {
      const expiresAt = AuthService.generateSessionExpireTime();
      ctx.db.sessionRepository.save = jest.fn().mockImplementationOnce((session:Session) => ({
        patientId: session.patientId,
        id: session.id,
        token: session.token,
        expiresAt
      }));
      const patientId = uuidV4();
      const session = await authService.createSession(ctx, patientId);

      expect(session.patientId).toBe(patientId);
      expect(session.expiresAt).toBe(expiresAt);
    });
  });

  describe("Generate Six Digits Code", () => {
    it("Should generate a six digits code", () => {
      const code = AuthService.generateRandomCode();
      expect(code.length).toBe(6);
    });

    it("Should generate a random code", () => {
      const firstCode = AuthService.generateRandomCode();
      const secondCode = AuthService.generateRandomCode();

      expect(firstCode).not.toBe(secondCode);
    });
  });
  describe("Generate Link Expire Time", () => {
    it("Should add a specific amount of minutes into the current date", () => {
      const newDateMiliseconds = new Date().getTime();
      const ref = Date.now;

      Date.now = (): number => newDateMiliseconds;

      const addedDate = AuthService.generateLinkExpireTime();
      expect(addedDate).toStrictEqual(addMinutes(new Date(Date.now()), linkExpirationTime));

      Date.now = ref;
    });
  });

  describe("Generate Session Expire Time", () => {
    it("Should add a specific amount of days into the current date", () => {
      const newDateMiliseconds = new Date().getTime();

      const ref = Date.now;

      Date.now = (): number => newDateMiliseconds;

      const addedDate = AuthService.generateSessionExpireTime();
      expect(addedDate).toStrictEqual(addDays(new Date(Date.now()), expiresDays));

      Date.now = ref;
    });
  });

  describe("Generate Token Code", () => {
    it("Should return a 64 hex characters string", () => {
      const tokenCode = AuthService.generateTokenCode();

      expect(tokenCode.length).toBe(64);
    });

    it("Should be a random 64 hex characters string", () => {
      const firstTokenCode = AuthService.generateTokenCode();
      const secondTokenCode = AuthService.generateTokenCode();
      expect(firstTokenCode).not.toBe(secondTokenCode);
    });
  });

  describe("Hash Password", () => {
    it("Should return a hash password different from the plain password", async () => {
      const hash = await AuthService.hashPassword("random_password");

      expect(hash).not.toBe("random_password");
    });
  });

  describe("Generate JWT", () => {
    it("Should generate a valid jwt token", async () => {
      const token = await AuthService.generateJwt(faker.datatype.uuid());
      expect(jwt.verify(token, secretKey)).toBeTruthy();
    });

    it("Should generate a jwt with the session id in the payload", async () => {
      const fakeSessionId = faker.datatype.uuid();
      const token = await AuthService.generateJwt(fakeSessionId);
      const decodedToken = jwt.verify(token, secretKey) as DecodedJWT;
      expect(decodedToken.id).toBe(fakeSessionId);
    });
  });

  describe("Check Token Expiration", () => {
    it("Should pass if the token isn't expired", () => {
      const tokenCode = AuthService.generateTokenCode();

      expect(() => authService.checkTokenExpiration(generateTokenModel(tokenCode))).not.toThrow();
    });

    it("Should throw an error if the token is expired", () => {
      const tokenCode = AuthService.generateTokenCode();
      expect(() => authService.checkTokenExpiration(generateTokenModel(tokenCode, subDays(new Date(), 1)))).toThrow(
        "Token has expired",
      );
    });
  });
});
