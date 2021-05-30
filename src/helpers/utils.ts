import { PatientInLineInfo } from "../@types/line.types";
import { LinePatient, Status } from "../models";

export function isString(field: any): field is String {
  return Object.prototype.toString.call(field) === "[object String]";
}

export function capitalizeName(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

export function cmpLinePatients(firstLinePatient:PatientInLineInfo, secondLinePatient:PatientInLineInfo):number {
  return firstLinePatient.position - secondLinePatient.position;
}

export function getFilteredLinePatients(status:Status, linePatients:LinePatient[]):LinePatient[] {
  return linePatients.filter(linePatient => linePatient.status === status);
}
