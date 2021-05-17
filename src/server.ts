import { createConnection, getConnectionOptions } from "typeorm";
import "reflect-metadata";
import app from "./app";
import { injectCtx } from "./middlewares/context";

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
