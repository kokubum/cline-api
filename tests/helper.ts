import { Connection, DeleteResult, getConnection, ObjectType } from "typeorm";
import { Context } from "../src/helpers/requestContext";
import { ClinicRepository, DoctorRepository, LineRepository, SessionRepository, TokenRepository, UserRepository } from "../src/repositories";
import { AttendingDayRepository } from "../src/repositories/health/AttendingDayRepository";
import { ClinicDoctorRepository } from "../src/repositories/health/ClinicDoctorRepository";
import { LinePatientRepository } from "../src/repositories/health/LinePatientRepository";
import { PatientRepository } from "../src/repositories/health/PatientRepository";
import { ClinicService, EmailService, ValidateService } from "../src/services";
import { ClinicDoctorService } from "../src/services/ClinicDoctorService";
import { DoctorService } from "../src/services/DoctorService";
import { LinePatientService } from "../src/services/LinePatientService";
import { LineService } from "../src/services/LineService";

const constantEntities = ["WeekDay"];

export async function clearTablesContent(): Promise<(DeleteResult|undefined)[]> {
  const connection = getConnection();
  const entities = connection.entityMetadatas;
  return Promise.all(Object.values(entities).map(async entity => {
    if (!constantEntities.includes(entity.name)) return connection.getRepository(entity.name).delete({});
    return undefined;
  }));
}

export function generateTestContext():Context {
  const connection = {
    // eslint-disable-next-line no-unused-vars
    getCustomRepository<T>(_repo:ObjectType<T>):T {
      return {} as T;
    }
  } as Connection;
  return {
    db: {
      connection,
      userRepository: connection.getCustomRepository(UserRepository),
      sessionRepository: connection.getCustomRepository(SessionRepository),
      tokenRepository: connection.getCustomRepository(TokenRepository),
      clinicRepository: connection.getCustomRepository(ClinicRepository),
      doctorRepository: connection.getCustomRepository(DoctorRepository),
      lineRepository: connection.getCustomRepository(LineRepository),
      patientRepository: connection.getCustomRepository(PatientRepository),
      clinicDoctorRepository: connection.getCustomRepository(ClinicDoctorRepository),
      linePatientRepository: connection.getCustomRepository(LinePatientRepository),
      attendingDayRepository: connection.getCustomRepository(AttendingDayRepository)
    },
    services: {
      emailService: new EmailService(),
      validateService: new ValidateService(),
      clinicService: new ClinicService(),
      clinicDoctorService: new ClinicDoctorService(),
      doctorService: new DoctorService(),
      lineService: new LineService(),
      linePatientService: new LinePatientService(),
    },
  };
}
