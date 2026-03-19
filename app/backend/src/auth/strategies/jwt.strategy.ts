import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

export interface JwtPayload {
  sub: string;
  email: string;
  sessionId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
      ignoreExpiration: false,
    } as StrategyOptionsWithRequest);
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: payload.sub },
      select: {
        id: true,
        uuid: true,
        email: true,
        username: true,
        firstName: true,
        middleName: true,
        lastName: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive");
    }

    return {
      userId: user.id,
      userUUID: user.uuid,
      email: user.email,
      username: user.username,
      sessionId: payload.sessionId,
    };
  }
}
