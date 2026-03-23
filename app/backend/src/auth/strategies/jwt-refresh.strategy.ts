import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./jwt.strategy";
import type { Request } from "express";
import { CookieService } from "../helpers/cookie.helper";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    config: ConfigService,
    private cookieService: CookieService
  ) {
    const secret = config.get<string>("JWT_REFRESH_SECRET");
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (this.cookieService.isDev()) {
            return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          }
          return req?.cookies?.["refresh_token"] as string;
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = this.cookieService.isDev()
      ? (ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string)
      : (req.cookies?.["refresh_token"] as string);
    return { ...payload, refreshToken };
  }
}
