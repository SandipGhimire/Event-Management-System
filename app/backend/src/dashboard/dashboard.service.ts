import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DashboardStats } from "shared-types";

@Injectable()
export class DashboardService {
  constructor(private readonly db: PrismaService) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const totalAttendees = await this.db.attendee.count();
    const totalTasks = await this.db.task.count({ where: { isActive: true } });
    const totalSponsors = await this.db.sponsor.count();

    const vegCount = await this.db.attendee.count({ where: { isVeg: true } });
    const nonVegCount = totalAttendees - vegCount;

    const clubWiseData = await this.db.attendee.groupBy({
      by: ["clubName"],
      _count: {
        id: true,
      },
    });

    const clubWise = clubWiseData.map((item) => ({
      name: item.clubName,
      count: item._count.id,
    }));

    const tasksData = await this.db.task.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { logs: true },
        },
      },
      orderBy: { order: "asc" },
    });

    const tasks = tasksData.map((task) => ({
      id: task.id,
      name: task.name,
      completed: task._count.logs,
      total: totalAttendees,
    }));

    return {
      overview: {
        totalAttendees,
        totalTasks,
        totalSponsors,
      },
      attendees: {
        vegCount,
        nonVegCount,
        clubWise,
      },
      tasks,
    };
  }
}
