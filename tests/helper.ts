import { DeleteResult, getConnection } from "typeorm";

const constantEntities = ["WeekDay"];

export async function clearTablesContent(): Promise<(DeleteResult|undefined)[]> {
  const connection = getConnection();
  const entities = connection.entityMetadatas;
  return Promise.all(Object.values(entities).map(async entity => {
    if (!constantEntities.includes(entity.name)) return connection.getRepository(entity.name).delete({});
    return undefined;
  }));
}
