import isEmail from "validator/lib/isEmail";
import { version as uuidVersion, validate as uuidValidate } from "uuid";
import { ApiMessage, AppError } from "../helpers/appError";
import { isString } from "../helpers/utils";
import { ReqFields } from "../@types/auth.types";

// eslint-disable-next-line no-unused-vars
type formatFunction = (nameOfField: string, ...options: string[]) => void;
type Type = "String"|"Boolean"|"Number"|"uuid"|"Array";

interface ValidateFactory {
  [field: string]: formatFunction;
}
interface TypeFactory{
  [field:string]:Type;
}

export class ValidateService {
  private readonly factory: ValidateFactory;

  private readonly types:TypeFactory;

  constructor() {
    this.factory = {
      email: this.emailFormat,
      password: this.passwordFormat,
      firstName: this.nameFormat,
      lastName: this.nameFormat,
      confirmPassword: this.passwordFormat,
    };

    this.types = {
      id: "uuid",
      email: "String",
      password: "String",
      firstName: "String",
      lastName: "String",
      confirmPassword: "String",
      search: "String",
    };
  }

  requestBody<T>(fieldsObj: ReqFields, requiredFields: string[]): T {
    const formattedFields = this.formatFields(fieldsObj);
    const validBody = this.requiredFields<T>(formattedFields, requiredFields);

    this.typeCheck(validBody);
    this.fieldsFormat(validBody);
    return validBody;
  }

  requiredFields<T>(fieldsObj: ReqFields, requiredFields: string[]):T {
    const formattedFields = fieldsObj;
    if (!this.hasSameFields<T>(formattedFields, requiredFields)) {
      const missingFields = this.getMissingFields(formattedFields, requiredFields);

      const errorMessage = AppError.buildErrorMessage(missingFields, "This field is required");

      throw new AppError("Missing some fields", 400, errorMessage);
    }

    return formattedFields;
  }

  fieldsFormat(fieldsObj: ReqFields): void {
    Object.keys(fieldsObj).forEach(field => {
      const validate = this.factory[field];
      if (validate) validate(fieldsObj[field], field);
    });
  }

  typeCheck(fieldsObj:ReqFields):void {
    const invalidTypes:ApiMessage = {};
    Object.keys(fieldsObj).forEach(field => {
      const typeCheck = this.types[field];
      if (typeCheck) {
        if ((typeCheck === "uuid" && !this.validateUUIDV4(fieldsObj[field])) || !this.validateType(fieldsObj[field], typeCheck)) {
          invalidTypes[field] = `This field should be of ${typeCheck} type`;
        }
      }
    });

    if (Object.keys(invalidTypes).length !== 0) {
      throw new AppError("Fields with invalid type", 400, invalidTypes);
    }
  }

  validateUUIDV4(uuid:string):boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }

  validateType(value:any, type:Type):boolean {
    return (Object.prototype.toString.call(value) === `[object ${type}]`);
  }

  confirmPasswordEquality(confirmPassword: string, password: string): void {
    if (password !== confirmPassword) {
      throw new AppError("The password doesn't match", 400, {
        confirmPassword: "This field have to be equal to the password field",
      });
    }
  }

  hasSameFields<T>(fields: any, requiredFields: string[]): fields is T {
    const objFields = Object.keys(fields);
    return requiredFields.every(field => objFields.includes(field));
  }

  getMissingFields(fields: any, requiredFields: string[]): string[] {
    return requiredFields.filter(field => fields[field] === undefined);
  }

  formatFields(fields: ReqFields): ReqFields {
    const formattedFields = fields;
    Object.keys(fields).forEach(field => {
      const fieldValue = fields[field];
      if (isString(fieldValue)) {
        formattedFields[field] = fieldValue.trim();
      }
    });
    return formattedFields;
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
    const isInvalid = name.split(" ").length !== 1 || name === "";

    if (isInvalid) {
      const errorMessage = AppError.buildErrorMessage(options, "This field need to have a single word");
      throw new AppError("Some misformatted fields", 400, errorMessage);
    }
  }
}
