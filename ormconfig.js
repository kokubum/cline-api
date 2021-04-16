const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

module.exports = {
  type: "postgres",
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  logging: true,

  cli: {
    migrationsDir: "src/migrations",
  },
  entities: ["src/models/*.{js,ts}"],
  migrations: ["src/migrations/*.{js,ts}"],
  namingStrategy: new SnakeNamingStrategy(),
};
