import { PrismaClient } from "../generated/client";

const run = async (prisma: PrismaClient) => {
  try {
    const permissions = [];

    const result = await prisma.permission.createMany({
      data: permissions,
      skipDuplicates: true,
    });

    console.log(`Permissions seeded! Added ${result.count} new permissions.`);
  } catch {
    console.error("Error Seeding Permissions!");
  }
};

export { run };
