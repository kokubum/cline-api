import { SignUpBody } from "../../../src/@types/auth.types";
import { ValidateService } from "../../../src/services";
import { generateLoginBody, generateSignUpBody } from "../../__mocks__/auth";

let validateService: ValidateService;

describe("Validate Service", () => {
  beforeAll(() => {
    validateService = new ValidateService();
  });
  describe("Instance", () => {
    it("Should create a Validate Service instace", () => {
      expect(validateService).toBeInstanceOf(ValidateService);
    });
  });

  describe("Required Fields", () => {
    it("Should return the request object if all required fields are passed", () => {
      const email = "random@email.com";
      const password = "random_password";
      const requiredFields = ["email", "password"];
      const validBody = validateService.requiredFields<SignUpBody>(
        {
          email,
          password,
        },
        requiredFields,
      );

      expect(validBody.email).toBe(email);
      expect(validBody.password).toBe(password);
    });

    it("Should trim the fields and return the object if all required fields are passed", () => {
      const email = "     random@email.com  ";
      const password = "  random_password  ";
      const requiredFields = ["email", "password"];
      const validBody = validateService.requiredFields<SignUpBody>(
        {
          email,
          password,
        },
        requiredFields,
      );

      expect(validBody.email).toBe(email.trim());
      expect(validBody.password).toBe(password.trim());
    });

    it("Should throw an error if the request object miss some fied", () => {
      const requiredFields = ["email", "password"];
      expect(() =>
        validateService.requiredFields<SignUpBody>(
          {
            email: "random@email.com",
          },
          requiredFields,
        ),
      ).toThrow("Missing some fields");
    });
  });

  describe("Email Format", () => {
    it("Should not throw an error if the email has a valid format", () => {
      expect(() => validateService.emailFormat("random@email.com")).not.toThrow();
    });

    it("Should throw and error if the email has an invalid format", () => {
      expect(() => validateService.emailFormat("invalid_format")).toThrow("Invalid email field");
    });
  });

  describe("Password Format", () => {
    it("Should not throw an error if the password has a valid format", () => {
      expect(() => validateService.passwordFormat("valid_ten_chars_format")).not.toThrow();
    });

    it("Should throw an error if the password has an invalid format", () => {
      expect(() => validateService.passwordFormat("smallpass")).toThrow("Invalid password field");
    });
  });

  describe("Confirm Password Equality", () => {
    it("Should not throw an error if the confirm password match the password", () => {
      const password = "random@password";
      expect(() => validateService.confirmPasswordEquality(password, password)).not.toThrow();
    });

    it("Should throw an error if the confirm password doesn't match the password", () => {
      const password = "random@password";
      expect(() => validateService.confirmPasswordEquality(password, "mismatch_password")).toThrow(
        "The password doesn't match",
      );
    });
  });

  describe("Name Format", () => {
    it("Should not throw an error if the name has only one word", () => {
      expect(() => validateService.nameFormat("Random")).not.toThrow();
    });

    it("Should throw an error if the name has more than one word", () => {
      expect(() => validateService.nameFormat("First Last")).toThrow("Some misformatted fields");
    });
  });

  describe("Fields Format", () => {
    it("Should run all format functions in the passed request body", () => {
      expect(() => validateService.fieldsFormat(generateSignUpBody({}))).not.toThrow();
    });
  });

  describe("Request Body", () => {
    it("Should run the required fields and the format function, returning a valid body", () => {
      const validBody = validateService.requestBody<SignUpBody>(generateSignUpBody({}), [
        "email",
        "password",
        "confirmPassword",
        "firstName",
        "lastName",
      ]);

      expect(validBody).toBeTruthy();
      expect(validBody.email).toBeTruthy();
      expect(validBody.password).toBeTruthy();
      expect(validBody.confirmPassword).toBeTruthy();
      expect(validBody.firstName).toBeTruthy();
      expect(validBody.lastName).toBeTruthy();
    });
  });

  describe("Has Same Fields", () => {
    it("Should return true if the object has the exact same required fields", () => {
      expect(validateService.hasSameFields(generateLoginBody({}), ["email", "password"])).toBeTruthy();
    });

    it("Should return false if the object has the exact same length but not the exact same fields", () => {
      expect(validateService.hasSameFields(generateLoginBody({}), ["field_one", "field_two"])).toBeFalsy();
    });

    it("Should return false if the object has the exact same fields but not the exact same length", () => {
      expect(validateService.hasSameFields(generateLoginBody({}), ["email"])).toBeFalsy();
    });
  });

  describe("Get Missing Fields", () => {
    it("Should return an array of missing fields", () => {
      const missingFields = validateService.getMissingFields(generateLoginBody({}), ["email", "password", "plus_field"]);

      expect(missingFields.length).toBe(1);
      expect(missingFields[0]).toBe("plus_field");
    });

    it("Should return an empty array if the body has more or equal fields than the required array", () => {
      const missingFields = validateService.getMissingFields(generateLoginBody({}), ["email"]);

      expect(missingFields.length).toBe(0);
    });
  });

  describe("Format Fields", () => {
    it("Should return a formatted object with no extra fields", () => {
      const body = generateLoginBody({ email: "    random@email.com   ", password: "  random_password" });

      const formattedBody = validateService.formatFields(body, ["email", "password"]);

      expect(formattedBody.email).toBe("random@email.com");
      expect(formattedBody.password).toBe("random_password");
    });

    it("Should remove the extra fields", () => {
      const body = generateSignUpBody({});

      const formattedBody = validateService.formatFields(body, ["email"]);

      const bodyArr = Object.keys(formattedBody);

      expect(bodyArr.length).toBe(1);
      expect(bodyArr[0]).toBe("email");
    });

    it("Should remove all the empty strings", () => {
      const body = generateLoginBody({ email: "" });
      const formattedBody = validateService.formatFields(body, ["email", "password"]);
      const bodyArr = Object.keys(formattedBody);
      expect(bodyArr.length).toBe(1);
      expect(bodyArr[0]).toBe("password");
    });
  });
});
