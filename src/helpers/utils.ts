import { ReqFields } from "../@types/auth.types";

function isString(field: any): field is String {
  return Object.prototype.toString.call(field) === "[object String]";
}

export function capitalizeName(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

export function hasSameFields<T>(
  fields: any,
  requiredFields: string[]
): fields is T {
  const signUpFields = Object.keys(fields);
  const sameLength = signUpFields.length === requiredFields.length;
  return (
    sameLength && requiredFields.every((field) => signUpFields.includes(field))
  );
}

export function getMissingFields(
  fields: any,
  requiredFields: string[]
): string[] {
  return requiredFields.filter((field) => fields[field] === undefined);
}

export function formatFields(fields: ReqFields): ReqFields {
  const formattedFields = fields;
  Object.keys(fields).forEach((field) => {
    const fieldValue = fields[field];
    if (isString(fieldValue)) {
      if (fieldValue === "") {
        delete formattedFields[field];
      } else {
        formattedFields[field] = fieldValue.trim();
      }
    }
  });
  return formattedFields;
}
