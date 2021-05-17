import { addDays, addMinutes, subDays } from "date-fns";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { expiresDays, linkExpirationTime, secretKey } from "../../../src/config";
import {
  checkTokenExpiration,
  DecodedJWT,
  generateLinkExpireTime,
  generateJwt,
  generateRandomCode,
  generateTokenCode,
  hashPassword,
  generateSessionExpireTime,
} from "../../../src/helpers/auth";
import { generateTokenModel } from "../../__mocks__/auth";

describe("Auth Helpers", () => {
  describe("Generate Six Digits Code", () => {
    it("Should generate a six digits code", () => {
      const code = generateRandomCode();
      expect(code.length).toBe(6);
    });

    it("Should generate a random code", () => {
      const firstCode = generateRandomCode();
      const secondCode = generateRandomCode();

      expect(firstCode).not.toBe(secondCode);
    });
  });
  describe("Generate Link Expire Time", () => {
    it("Should add a specific amount of minutes into the current date", () => {
      const newDateMiliseconds = new Date().getTime();
      const ref = Date.now;

      Date.now = (): number => newDateMiliseconds;

      const addedDate = generateLinkExpireTime();
      expect(addedDate).toStrictEqual(addMinutes(new Date(Date.now()), linkExpirationTime));

      Date.now = ref;
    });
  });

  describe("Generate Session Expire Time", () => {
    it("Should add a specific amount of days into the current date", () => {
      const newDateMiliseconds = new Date().getTime();

      const ref = Date.now;

      Date.now = (): number => newDateMiliseconds;

      const addedDate = generateSessionExpireTime();
      expect(addedDate).toStrictEqual(addDays(new Date(Date.now()), expiresDays));

      Date.now = ref;
    });
  });

  describe("Generate Token Code", () => {
    it("Should return a 64 hex characters string", () => {
      const tokenCode = generateTokenCode();

      expect(tokenCode.length).toBe(64);
    });

    it("Should be a random 64 hex characters string", () => {
      const firstTokenCode = generateTokenCode();
      const secondTokenCode = generateTokenCode();
      expect(firstTokenCode).not.toBe(secondTokenCode);
    });
  });

  describe("Hash Password", () => {
    it("Should return a hash password different from the plain password", async () => {
      const hash = await hashPassword("random_password");

      expect(hash).not.toBe("random_password");
    });
  });

  describe("Generate JWT", () => {
    it("Should generate a valid jwt token", async () => {
      const token = await generateJwt(faker.datatype.uuid());
      expect(jwt.verify(token, secretKey)).toBeTruthy();
    });

    it("Should generate a jwt with the session id in the payload", async () => {
      const fakeSessionId = faker.datatype.uuid();
      const token = await generateJwt(fakeSessionId);
      const decodedToken = jwt.verify(token, secretKey) as DecodedJWT;
      expect(decodedToken.id).toBe(fakeSessionId);
    });
  });

  describe("Check Token Expiration", () => {
    it("Should pass if the token isn't expired", () => {
      const tokenCode = generateTokenCode();

      expect(() => checkTokenExpiration(generateTokenModel(tokenCode))).not.toThrow();
    });

    it("Should throw an error if the token is expired", () => {
      const tokenCode = generateTokenCode();
      expect(() => checkTokenExpiration(generateTokenModel(tokenCode, subDays(new Date(), 1)))).toThrow(
        "Token has expired",
      );
    });
  });
});
