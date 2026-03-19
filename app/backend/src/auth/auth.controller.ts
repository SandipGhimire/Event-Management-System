import { Controller, Post, Body, UseGuards, Get, Req, Delete, Param, Ip } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto, LoginDTO, UserRequestDto, RefreshTokenRequestDto } from "./dto/auth.dto";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import type { Request } from "express";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("signup")
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDTO, @Req() req: Request, @Ip() ipAddress: string) {
    const deviceInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress,
      deviceId: dto.deviceId || undefined,
    };
    return this.authService.signIn(dto, deviceInfo);
  }

  @Post("logout")
  async logout(@Req() req: Request) {
    const user = req.user as UserRequestDto;
    return this.authService.logout(user.userUUID, user.sessionId);
  }

  @Post("logout-all")
  async logoutAll(@Req() req: Request) {
    const user = req.user as UserRequestDto;
    return this.authService.logoutAll(user.userUUID);
  }

  @Post("logout-others")
  async logoutOthers(@Req() req: Request) {
    const user = req.user as UserRequestDto;
    return this.authService.logoutOtherSessions(user.userUUID, user.sessionId);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh")
  async refreshTokens(@Req() req: Request) {
    const user = req.user as RefreshTokenRequestDto;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @Get("sessions")
  async getActiveSessions(@Req() req: Request) {
    const user = req.user as UserRequestDto;
    return this.authService.getActiveSessions(user.userUUID);
  }

  @Delete("sessions/:sessionId")
  async revokeSession(@Req() req: Request, @Param("sessionId") sessionId: string) {
    const user = req.user as UserRequestDto;
    return this.authService.revokeSession(user.userUUID, sessionId);
  }
}
