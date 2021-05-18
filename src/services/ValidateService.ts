import isEmail from "validator/lib/isEmail";
import { AppError } from "../helpers/appError";
import { isString } from "../helpers/utils";
import { ReqFields } from "../@types/auth.types";

// eslint-disable-next-line no-unused-vars
type formatFunction = (nameOfField: string, ...options: string[]) => void;

interface ValidateFactory {
  [field: string]: formatFunction;
}

export class ValidateService {
  private readonly factory: ValidateFactory;

  constructor() {
    this.factory = {
      email: this.emailFormat,
      password: this.passwordFormat,
      firstName: this.nameFormat,
      lastName: this.nameFormat,
      confirmPassword: this.passwordFormat,
    };
  }

  requestBody<T>(fieldsObj: ReqFields, requiredFields: string[]): T {
    const validBody = this.requiredFields<T>(fieldsObj, requiredFields);
    this.fieldsFormat(fieldsObj);
    return validBody;
  }

  requiredFields<T>(fieldsObj: ReqFields, requiredFields: string[]): T {
    const formattedFields = this.formatFields(fieldsObj, requiredFields);
    if (!this.hasSameFields<T>(formattedFields, requiredFields)) {
      const missingFields = this.getMissingFields(formattedFields, requiredFields);

      const errorMessage = AppError.buildErrorMessage(missingFields, "This field is required");

      throw new AppError("Missing some fields", 400, errorMessage);
    }

    return formattedFields;
  }

  confirmPasswordEquality(confirmPassword: string, password: string): void {
    if (password !== confirmPassword) {
      throw new AppError("The password doesn't match", 400, {
        confirmPassword: "This field have to be equal to the password field",
      });
    }
  }

  hasSameFields<T>(fields: any, requiredFields: string[]): fields is T {
    const signUpFields = Object.keys(fields);
    const sameLength = signUpFields.length === requiredFields.length;
    return sameLength && requiredFields.every(field => signUpFields.includes(field));
  }

  getMissingFields(fields: any, requiredFields: string[]): string[] {
    return requiredFields.filter(field => fields[field] === undefined);
  }

  formatFields(fields: ReqFields, requiredFields: string[]): ReqFields {
    const formattedFields = fields;
    Object.keys(fields).forEach(field => {
      if (!requiredFields.includes(field)) {
        delete formattedFields[field];
      } else {
        const fieldValue = fields[field];
        if (isString(fieldValue)) {
          formattedFields[field] = fieldValue.trim();
          if (fieldValue === "") delete formattedFields[field];
        }
      }
    });
    return formattedFields;
  }

  fieldsFormat(fieldsObj: ReqFields): void {
    Object.keys(fieldsObj).forEach(field => {
      const validate = this.factory[field];
      validate(fieldsObj[field], field);
    });
  }

  emailFormat(email: string): void {
    if (!isEmail(email)) {
      throw new AppError("Invalid email field", 400, {
        email: "This field have an invalid format",
      });
    }
  }

  passwordFormat(password: string, ...options: string[]): void {
    if (password.length < 10) {
      const errorMessage = AppError.buildErrorMessage(options, "This field must be longer or equal to 10 characters");
      throw new AppError("Invalid password field", 400, errorMessage);
    }
  }

  nameFormat(name: string, ...options: string[]): void {
    const isInvalid = name.split(" ").length !== 1;

    if (isInvalid) {
      const errorMessage = AppError.buildErrorMessage(options, "This field need to have only a single word");
      throw new AppError("Some misformatted fields", 400, errorMessage);
    }
  }
}
