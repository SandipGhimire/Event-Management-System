import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./jwt.strategy";
import type { Request } from "express";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_REFRESH_SECRET");
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;
          if (req && req.cookies) {
            token = req.cookies["refresh_token"] as string;
          }
          return token || (ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string);
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken =
      (req.cookies?.["refresh_token"] as string) || (req.get("Authorization")?.replace("Bearer", "").trim() as string);
    return { ...payload, refreshToken };
  }
}
