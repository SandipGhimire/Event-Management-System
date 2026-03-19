import * as bcrypt from "bcrypt";
import { PrismaClient } from "../generated/client";

const run = async (prisma: PrismaClient) => {
  try {
    const adminPassword = await bcrypt.hash("admin@123", 10);
    await prisma.user.create({
      data: {
        email: "admin@gmail.com",
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        password: adminPassword,
      },
    });
  } catch {
    console.error("Error Seeding User!");
  }
};

export { run };
