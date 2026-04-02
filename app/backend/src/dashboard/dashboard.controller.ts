import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Permission } from "../role/decorators/permission.decorator";
import { DashboardStats } from "shared-types";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @Permission(["dashboard.view"])
  async getStats() {
    const data: DashboardStats = await this.dashboardService.getDashboardStats();
    return {
      success: true,
      data,
      message: "Dashboard stats fetched successfully",
      status: 200,
    };
  }
}
