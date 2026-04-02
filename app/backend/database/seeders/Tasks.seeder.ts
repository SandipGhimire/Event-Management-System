import { PrismaClient } from "../generated/client";

const run = async (prisma: PrismaClient) => {
  try {
    await prisma.task.createMany({
      data: [
        {
          name: "Attended",
          slug: "attended",
          description: "Marked as attended in the program",
          isActive: true,
          order: 1,
        },
        {
          name: "Had Breakfast",
          slug: "had-breakfast",
          description: "Attendee had breakfast",
          isActive: true,
          order: 2,
        },
        {
          name: "Had Lunch",
          slug: "had-lunch",
          description: "Attendee had lunch",
          isActive: true,
          order: 3,
        },
        {
          name: "Had Other Meal/Snack",
          slug: "had-other-meal-snack",
          description: "Attendee had other meal or snack",
          isActive: true,
          order: 4,
        },
      ],
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error seeding tasks:", error);
  }
};

export { run };
