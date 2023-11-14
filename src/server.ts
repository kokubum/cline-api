import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import app from "./app";

process.env.TZ = "UTC";
const port = parseInt(process.env.PORT ?? "8000", 10);

getConnectionOptions().then(async options =>
  createConnection({
    ...options,
    migrationsRun: true,
  })
    .then(() => {
      app.listen(port, () => {
        console.log(`App running on port ${port}`);
      });
    })
    .catch(error => console.error(error)),
);
