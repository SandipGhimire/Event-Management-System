import { Controller, Get, Query } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get("list")
  async roleList(@Query() query: Record<string, any>) {
    let parsedFilters: unknown;
    if (typeof query.filters === "string") {
      parsedFilters = JSON.parse(query.filters);
    } else {
      parsedFilters = query.filters;
    }
    const params = {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10,
      search: query.search as string | undefined,
      sortBy: query.sortBy as string | undefined,
      sortOrder: query.sortOrder as "asc" | "desc" | undefined,
      filters:
        typeof parsedFilters === "object" && parsedFilters !== null ? (parsedFilters as Record<string, unknown>) : {},
    };
    const result = await this.roleService.getAllRoles(params);
    return {
      success: true,
      message: "Sponsors fetched successfully",
      status: 200,
      data: result,
    };
  }
}
