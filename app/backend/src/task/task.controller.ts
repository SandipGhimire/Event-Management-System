import { Controller, Get, Query } from "@nestjs/common";
import { TaskService } from "./task.service";
import { parseQuery } from "../prisma/prisma.utils";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("list")
  async taskList(@Query() query: Record<string, any>) {
    const result = await this.taskService.getAllTasks(parseQuery(query));
    return {
      success: true,
      message: "Users fetched successfully",
      status: 200,
      data: result,
    };
  }
}
