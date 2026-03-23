import { Controller, Post, Body, UseGuards, Get, Req, Delete, Param, Ip } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto, LoginDTO, UserRequestDto, RefreshTokenRequestDto } from "./dto/auth.dto";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";
import type { Request, Response } from "express";
import { Res } from "@nestjs/common";
import { Public } from "./decorators/public.decorator";
import { CookieService } from "./helpers/cookie.helper";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  @Public()
  @Post("signup")
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post("login")
  async login(
    @Body() dto: LoginDTO,
    @Req() req: Request,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const deviceInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress,
      deviceId: dto.deviceId || undefined,
    };
    const authResult = await this.authService.signIn(dto, deviceInfo);

    if (!this.cookieService.isDev()) {
      this.cookieService.setAuthCookies(res, authResult.accessToken, authResult.refreshToken);
      return { user: authResult.user };
    }

    return authResult;
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as UserRequestDto;
    const authResult = await this.authService.logout(user.userUUID, user.sessionId);

    if (!this.cookieService.isDev()) {
      this.cookieService.clearAuthCookies(res);
    }

    return authResult;
  }

  @Post("logout-all")
  async logoutAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as UserRequestDto;
    const authResult = await this.authService.logoutAll(user.userUUID);

    if (!this.cookieService.isDev()) {
      this.cookieService.clearAuthCookies(res);
    }

    return authResult;
  }

  @Post("logout-others")
  async logoutOthers(@Req() req: Request) {
    const user = req.user as UserRequestDto;
    return this.authService.logoutOtherSessions(user.userUUID, user.sessionId);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh")
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as RefreshTokenRequestDto;
    const authResult = await this.authService.refreshTokens(user.sub, user.sessionId, user.refreshToken);

    if (!this.cookieService.isDev()) {
      this.cookieService.setAuthCookies(res, authResult.accessToken, authResult.refreshToken);
      return { success: true };
    }

    return authResult;
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
