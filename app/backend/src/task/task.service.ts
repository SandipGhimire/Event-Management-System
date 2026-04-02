import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";
import { TaskCreateDto, TaskUpdateDto } from "./task.dto";

@Injectable()
export class TaskService {
  constructor(private readonly db: PrismaService) {}

  async getAllTasks(params: FetchParams): Promise<PaginatedData<any>> {
    const filters = (params.filters as Record<string, any>) || {};
    const prismaFilters: Record<string, any> = {};

    if (filters.name) {
      prismaFilters.name = { contains: String(filters.name), mode: "insensitive" };
    }
    if (filters.slug) {
      prismaFilters.slug = { contains: String(filters.slug), mode: "insensitive" };
    }

    return await paginate(this.db.task, { ...params, filters: prismaFilters });
  }

  async getTaskById(id: number) {
    const task = await this.db.task.findUnique({
      where: { id },
    });
    return task;
  }

  async createTask(data: TaskCreateDto) {
    return await this.db.task.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        order: data.order,
      },
    });
  }

  async updateTask(id: number, data: TaskUpdateDto) {
    const task = await this.getTaskById(id);
    if (!task) return null;
    return await this.db.task.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive,
        order: data.order,
      },
    });
  }

  async deleteTask(id: number) {
    const task = await this.getTaskById(id);
    if (!task) return null;
    return await this.db.task.delete({
      where: { id },
    });
  }
}
