import { randomBytes } from "crypto";
import { Connection, createConnection, getConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

process.env.TZ = "UTC";

const testDatabase = `test_${randomBytes(10).toString("hex")}`;
let masterConn: Connection;
let testConn: Connection;

beforeAll(async () => {
  try {
    masterConn = await createConnection({
      ...(await getConnectionOptions()),
      name: "master",
    });

    await masterConn.query(`CREATE DATABASE ${testDatabase};`);

    testConn = await createConnection({
      ...((await getConnectionOptions()) as PostgresConnectionOptions),
      database: testDatabase,
      logging: false,
      migrationsRun: true,
    });
  } catch (error) {
    console.error(`Setup Error: ${error}`);
    process.exit(1);
  }
});

afterAll(async () => {
  await testConn.close();
  await masterConn.query(`DROP DATABASE ${testDatabase};`);
  await masterConn.close();
});
