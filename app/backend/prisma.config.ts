import { defineConfig, env } from "prisma/config";
import "dotenv/config";
import path from "node:path";

const url = `postgresql://${env("DATABASE_USER")}:${env("DATABASE_PASSWORD")}@${env("DATABASE_HOST")}:${env("DATABASE_PORT")}/${env("DATABASE_NAME")}`;

export default defineConfig({
  schema: path.join("database", "schema"),
  migrations: {
    path: "database/migrations",
    seed: "tsx ./database/seeder.ts",
  },
  datasource: {
    url: url,
  },
});
