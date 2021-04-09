import { ApiMessage } from "./appError";

export function capitalizeName(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

export function isString(field: any): field is String {
  return Object.prototype.toString.call(field) === "[object String]";
}

export function buildErrorMessage(
  fields: string[],
  message: string
): ApiMessage {
  return fields.reduce((accumulator, field) => {
    accumulator[field] = message;
    return accumulator;
  }, {} as ApiMessage);
}
