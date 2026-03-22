import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import ms, { StringValue } from "ms";

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  isDev(): boolean {
    return this.configService.get("ENVIRONMENT") === "development";
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const accessTokenExp = this.configService.get<string>("JWT_SECRET_EXPIRE_TIME") || "15m";
    const sessionInactivityDays = this.configService.get<number>("SESSION_INACTIVITY_DAYS") || 30;

    const accessTokenMaxAge = ms(accessTokenExp as StringValue);
    const refreshTokenMaxAge = sessionInactivityDays * 24 * 60 * 60 * 1000;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: accessTokenMaxAge,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: refreshTokenMaxAge,
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
  }
}
