import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { TaskService } from "./task.service";
import { parseQuery } from "../prisma/prisma.utils";
import { TaskCreateDto, TaskUpdateDto } from "./task.dto";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("list")
  async taskList(@Query() query: Record<string, any>) {
    const result = await this.taskService.getAllTasks(parseQuery(query));
    return {
      success: true,
      message: "Tasks fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Get("detail/:id")
  async getTaskById(@Param("id") id: string) {
    const result = await this.taskService.getTaskById(Number(id));
    return {
      success: true,
      message: "Task fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Post("create")
  async createTask(@Body() body: TaskCreateDto) {
    const result = await this.taskService.createTask(body);
    return {
      success: true,
      message: "Task created successfully",
      status: 200,
      data: result,
    };
  }

  @Post("update/:id")
  async updateTask(@Param("id") id: string, @Body() body: TaskUpdateDto) {
    const result = await this.taskService.updateTask(Number(id), body);
    return {
      success: true,
      message: "Task updated successfully",
      status: 200,
      data: result,
    };
  }

  @Delete("delete/:id")
  async deleteTask(@Param("id") id: string) {
    const result = await this.taskService.deleteTask(Number(id));
    return {
      success: true,
      message: "Task deleted successfully",
      status: 200,
      data: result,
    };
  }
}
