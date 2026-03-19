import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_REFRESH_SECRET");
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get("Authorization")?.replace("Bearer", "").trim();
    return { ...payload, refreshToken };
  }
}
