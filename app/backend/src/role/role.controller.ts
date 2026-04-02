import { Controller, Get, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { parseQuery } from "../prisma/prisma.utils";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get("list")
  async roleList(@Query() query: Record<string, any>) {
    const result = await this.roleService.getAllRoles(parseQuery(query));
    return {
      success: true,
      message: "Sponsors fetched successfully",
      status: 200,
      data: result,
    };
  }
}
