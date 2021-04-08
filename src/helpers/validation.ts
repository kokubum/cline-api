import isEmail from "validator/lib/isEmail";
import { ApiMessage, AppError } from "./appError";

export interface ReqFields {
  [field: string]: any;
}

export interface SignUpBody {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

function isString(field: any): field is String {
  return Object.prototype.toString.call(field) === "[object String]";
}

function buildErrorMessage(fields: string[], message: string): ApiMessage {
  return fields.reduce((accumulator, field) => {
    accumulator[field] = message;
    return accumulator;
  }, {} as ApiMessage);
}

export function validateSingleName(
  fieldsObj: ReqFields,
  ...nameFields: string[]
): void {
  const invalidNames = nameFields.filter(
    (name) => fieldsObj[name].trim().split(" ").length !== 1
  );

  if (invalidNames.length !== 0) {
    const errorMessage = buildErrorMessage(
      invalidNames,
      "This field need to have only a single word"
    );
    throw new AppError("Some misformatted fields", 400, errorMessage);
  }
}

function hasSameFields<T>(fields: any, requiredFields: string[]): fields is T {
  const signUpFields = Object.keys(fields);
  const sameLength = signUpFields.length === requiredFields.length;
  return (
    sameLength && requiredFields.every((field) => signUpFields.includes(field))
  );
}

function getMissingFields(fields: any, requiredFields: string[]): string[] {
  return requiredFields.filter((field) => fields[field] === undefined);
}

export function validateRequiredFields(
  fields: ReqFields,
  requiredFields: string[]
): void {
  if (!hasSameFields<SignUpBody>(fields, requiredFields)) {
    const missingFields = getMissingFields(fields, requiredFields);

    const errorMessage = buildErrorMessage(
      missingFields,
      "This field is required"
    );

    throw new AppError("Missing some fields", 400, errorMessage);
  }
}

export function formatFields(fields: ReqFields): ReqFields {
  const formattedFields = fields;
  Object.keys(fields).forEach((field) => {
    const fieldValue = fields[field];
    if (isString(fieldValue)) {
      if (field === "") {
        delete formattedFields[field];
      } else {
        formattedFields[field] = fieldValue.trim();
      }
    }
  });
  return formattedFields;
}

export function validateEmail(email: string): void {
  if (!isEmail(email)) {
    throw new AppError("Invalid email field", 400, {
      email: "This field have an invalid format",
    });
  }
}
