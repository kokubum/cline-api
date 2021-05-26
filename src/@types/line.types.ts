import { LinePatient } from "../models";

export interface BasicLineInfo{
  active:boolean;
  patients:LinePatient[];
}