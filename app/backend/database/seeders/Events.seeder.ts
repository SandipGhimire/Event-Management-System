import { PrismaClient } from "../generated/client";

const run = async (prisma: PrismaClient) => {
  try {
    await prisma.event.createMany({
      data: [
        { name: "Attended", description: "Marked as attended in the program" },
        { name: "Had Breakfast", description: "Attendee had breakfast" },
        { name: "Had Lunch", description: "Attendee had lunch" },
        { name: "Had Meal", description: "Attendee had other meal/snack" },
      ],
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error seeding events:", error);
  }
};

export { run };
