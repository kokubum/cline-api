import { Connection, DeleteResult, getConnection, ObjectType } from "typeorm";
import { Context } from "../src/helpers/requestContext";
import { AttendingDayRepository, ClinicDoctorRepository, ClinicRepository, DoctorRepository, LinePatientRepository, LineRepository, PatientRepository, SessionRepository, TokenRepository } from "../src/repositories";

import { ClinicDoctorService, ClinicService, DoctorService, EmailService, LinePatientService, LineService, ValidateService } from "../src/services";

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
