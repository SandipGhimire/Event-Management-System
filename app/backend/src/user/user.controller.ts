import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { parseQuery } from "../prisma/prisma.utils";
import { Permission } from "../role/decorators/permission.decorator";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import { type AuthenticatedRequest } from "../auth/interfaces/auth-request.interface";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("self")
  async getProfile(@Req() req: AuthenticatedRequest) {
    return await this.userService.getSelfUser(req.user.userUUID);
  }

  @Post("create")
  @Permission(["user.create"])
  async createUser(@Body() data: CreateUserDto) {
    const result = await this.userService.createUser(data);
    return {
      success: true,
      message: "User created successfully",
      status: 201,
      data: result,
    };
  }

  @Patch(":id")
  @Permission(["user.update"])
  async updateUser(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    const result = await this.userService.updateUser(id, data);
    if (!result) {
      return {
        success: false,
        message: "User not found for update",
        status: 200,
        data: null,
      };
    }
    return {
      success: true,
      message: "User updated successfully",
      status: 200,
      data: result,
    };
  }

  @Delete(":id")
  @Permission(["user.delete"])
  async deleteUser(@Param("id", ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return {
      success: true,
      message: "User deleted successfully",
      status: 200,
    };
  }

  @Get("list")
  @Permission(["user.list"])
  async listUsers(@Query() query: Record<string, any>) {
    const result = await this.userService.getAllUsers(parseQuery(query));
    return {
      success: true,
      message: "Users fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Get(":id")
  @Permission(["user.view"])
  async getUserById(@Param("id", ParseIntPipe) id: number) {
    const result = await this.userService.getUserById(id);
    if (!result) {
      return {
        success: false,
        message: "User not found",
        status: 200,
        data: null,
      };
    }
    return {
      success: true,
      message: "User fetched successfully",
      status: 200,
      data: result,
    };
  }
}
