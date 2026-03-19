import { Controller, Get, Req } from "@nestjs/common";
import type { Request } from "express";
import { Permission } from "../role/decorators/permission.decorator";

@Controller("user")
export class UserController {
  @Permission(["asd"])
  @Get("me")
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
