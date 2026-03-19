import { PrismaClient } from "../generated/client";

const run = async (prisma: PrismaClient) => {
  try {
    await prisma.tenant_details.create({
      data: {
        tenant_host: "test1.localhost",
        db_host: "localhost",
        db_port: 5432,
        db_username: "root",
        db_password: "password",
        db_name: "nest",
      },
    });
    await prisma.tenant_details.create({
      data: {
        tenant_host: "test2.localhost",
        db_host: "localhost",
        db_port: 5432,
        db_username: "root",
        db_password: "password",
        db_name: "nest2",
      },
    });
  } catch {
    console.error("Error Seeding Tenant!");
  }
};

export { run };
