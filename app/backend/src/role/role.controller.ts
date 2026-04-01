import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { RoleService } from "./role.service";
import { parseQuery } from "../prisma/prisma.utils";
import { Permission } from "./decorators/permission.decorator";
import { CreateRoleDto, UpdateRoleDto } from "./role.dto";
import { type AuthenticatedRequest } from "../auth/interfaces/auth-request.interface";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post("create")
  @Permission(["role.create"])
  async createRole(@Body() data: CreateRoleDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const result = await this.roleService.createRole(data, userId);
    return {
      success: true,
      message: "Role created successfully",
      status: 201,
      data: result,
    };
  }

  @Patch(":id")
  @Permission(["role.update"])
  async updateRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.userId;
    const result = await this.roleService.updateRole(id, data, userId);
    return {
      success: true,
      message: "Role updated successfully",
      status: 200,
      data: result,
    };
  }

  @Delete(":id")
  @Permission(["role.delete"])
  async deleteRole(@Param("id", ParseIntPipe) id: number) {
    await this.roleService.deleteRole(id);
    return {
      success: true,
      message: "Role deleted successfully",
      status: 200,
    };
  }

  @Get("list")
  @Permission(["role.list"])
  async roleList(@Query() query: Record<string, any>) {
    const result = await this.roleService.getAllRoles(parseQuery(query));
    return {
      success: true,
      message: "Roles fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Get(":id")
  @Permission(["role.view"])
  async getRoleById(@Param("id", ParseIntPipe) id: number) {
    const result = await this.roleService.getRoleById(id);
    return {
      success: true,
      message: "Role fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Get("permissions/list")
  @Permission(["role.create", "role.update"])
  async permissionList() {
    const result = await this.roleService.getAllPermissions();
    return {
      success: true,
      message: "Permissions fetched successfully",
      status: 200,
      data: result,
    };
  }
}
