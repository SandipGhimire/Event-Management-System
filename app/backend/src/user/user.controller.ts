import { Controller, Get, Req } from "@nestjs/common";
import type { Request } from "express";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("self")
  async getProfile(@Req() req: Request) {
    return await this.userService.getSelfUser(req.user?.userUUID || "");
  }
}
