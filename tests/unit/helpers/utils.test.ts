import { capitalizeName, formatFields, getMissingFields, hasSameFields, isString } from "../../../src/helpers/utils";
import { generateLoginBody, generateSignUpBody } from "../../__mocks__/auth";

describe("Utils", () => {
  describe("Is a String Function", () => {
    it("Should return true if the argument is a string type", () => {
      expect(isString("random_string")).toBeTruthy();
    });

    it("Should return false if the argument isn't a string type", () => {
      expect(isString({ randomField: "random" })).toBeFalsy();
    });
  });

  describe("Capitalize Name", () => {
    it("Should return a capitalized string", () => {
      expect(capitalizeName("random_name")).toBe("Random_name");
    });
  });

  describe("Has Same Fields", () => {
    it("Should return true if the object has the exact same required fields", () => {
      expect(hasSameFields(generateLoginBody({}), ["email", "password"])).toBeTruthy();
    });

    it("Should return false if the object has the exact same length but not the exact same fields", () => {
      expect(hasSameFields(generateLoginBody({}), ["field_one", "field_two"])).toBeFalsy();
    });

    it("Should return false if the object has the exact same fields but not the exact same length", () => {
      expect(hasSameFields(generateLoginBody({}), ["email"])).toBeFalsy();
    });
  });

  describe("Get Missing Fields", () => {
    it("Should return an array of missing fields", () => {
      const missingFields = getMissingFields(generateLoginBody({}), ["email", "password", "plus_field"]);

      expect(missingFields.length).toBe(1);
      expect(missingFields[0]).toBe("plus_field");
    });

    it("Should return an empty array if the body has more or equal fields than the required array", () => {
      const missingFields = getMissingFields(generateLoginBody({}), ["email"]);

      expect(missingFields.length).toBe(0);
    });
  });

  describe("Format Fields", () => {
    it("Should return a formatted object with no extra fields", () => {
      const body = generateLoginBody({ email: "    random@email.com   ", password: "  random_password" });

      const formattedBody = formatFields(body, ["email", "password"]);

      expect(formattedBody.email).toBe("random@email.com");
      expect(formattedBody.password).toBe("random_password");
    });

    it("Should remove the extra fields", () => {
      const body = generateSignUpBody({});

      const formattedBody = formatFields(body, ["email"]);

      const bodyArr = Object.keys(formattedBody);

      expect(bodyArr.length).toBe(1);
      expect(bodyArr[0]).toBe("email");
    });

    it("Should remove all the empty strings", () => {
      const body = generateLoginBody({ email: "" });
      const formattedBody = formatFields(body, ["email", "password"]);
      const bodyArr = Object.keys(formattedBody);
      expect(bodyArr.length).toBe(1);
      expect(bodyArr[0]).toBe("password");
    });
  });
});
