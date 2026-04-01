import * as bcrypt from "bcrypt";
import { PrismaClient } from "../generated/client";

const run = async (prisma: PrismaClient) => {
  try {
    const adminPassword = await bcrypt.hash("admin@123", 10);

    // Upsert admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@gmail.com" },
      update: {},
      create: {
        email: "admin@gmail.com",
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        password: adminPassword,
      },
    });

    // Find Super Admin role
    const superAdminRole = await prisma.role.findUnique({
      where: { name: "Super Admin" },
    });

    if (superAdminRole) {
      // Assign Super Admin role to admin user
      await prisma.userRole.upsert({
        where: {
          userUUID_roleId: {
            userUUID: adminUser.uuid,
            roleId: superAdminRole.id,
          },
        },
        update: {},
        create: {
          userUUID: adminUser.uuid,
          roleId: superAdminRole.id,
        },
      });
      console.log(`Admin user assigned to Super Admin role!`);
    } else {
      console.warn("Super Admin role not found during User seeding.");
    }
  } catch (err) {
    console.error("Error Seeding User!", err);
  }
};

export { run };
