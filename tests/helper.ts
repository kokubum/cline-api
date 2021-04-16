import { DeleteResult, getConnection } from "typeorm";

export async function clearTablesContent(): Promise<DeleteResult[]> {
  const connection = getConnection();
  const entities = connection.entityMetadatas;
  return Promise.all(Object.values(entities).map(async entity => connection.getRepository(entity.name).delete({})));
}
