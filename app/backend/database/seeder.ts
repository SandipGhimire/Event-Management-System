import "dotenv/config";
import { PrismaClient } from "./generated/client";
import path from "path";
import * as fs from "fs";
import { PrismaPg } from "@prisma/adapter-pg";

const seederFiles: string[] = ["Permissions", "Tasks", "User"];

const adapter = new PrismaPg({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const SEEDERS_DIR = path.join(__dirname, "seeders");

const prisma = new PrismaClient({ adapter });

const getArg = (key: string) => {
  const arg = process.argv.find((a) => a.startsWith(`--${key}=`));
  return arg ? arg.split("=")[1] : null;
};

async function main() {
  const useFile = getArg("use-file");
  const specific = getArg("file");
  if (useFile == "true" && !specific) {
    console.error("Usage: npm run db:seed:file -- --file=<file_name>");
    process.exit(1);
  }

  try {
    if (useFile == "true") {
      const filePath = path.join(SEEDERS_DIR, `${specific}.seeder.ts`);
      const module = (await import(filePath)) as { run?: (prisma: PrismaClient) => Promise<void> };

      if (module) {
        if (typeof module.run == "function") {
          console.log("----------------------------------------");
          console.log(`Seeding File: ${specific}.seeder.ts`);
          const start = process.hrtime.bigint();
          await module.run(prisma);
          const end = process.hrtime.bigint();
          const durationMs = Number(end - start) / 1_000_000;
          console.log(`Execution Time: ${durationMs.toFixed(2)} ms`);
          console.log("----------------------------------------");
        } else {
          console.log(`Seeder ${specific}.seeder doesn't export run() function!`);
        }
      } else {
        console.log(`Seeder ${specific}.seeder doesn't exist!`);
      }
    } else {
      for (const seeder of seederFiles) {
        const filePath = path.join(SEEDERS_DIR, `${seeder}.seeder.ts`);

        if (!fs.existsSync(filePath)) {
          console.warn(`Seeder file not found: ${seeder}.seeder.ts`);
          continue;
        }

        const module = (await import(filePath)) as {
          run?: (prisma: PrismaClient) => Promise<void>;
        };

        if (typeof module.run === "function") {
          console.log("----------------------------------------");
          console.log(`Seeding File: ${seeder}.seeder.ts`);
          const start = process.hrtime.bigint();
          await module.run(prisma);
          const end = process.hrtime.bigint();
          const durationMs = Number(end - start) / 1_000_000;
          console.log(`Execution Time: ${durationMs.toFixed(2)} ms`);
          console.log("----------------------------------------");
        } else {
          console.warn(`Seeder ${seeder}.seeder.ts does not export run()`);
        }
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
