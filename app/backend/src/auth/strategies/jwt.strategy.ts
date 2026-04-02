import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { Request } from "express";
import { CookieService } from "../helpers/cookie.helper";

export interface JwtPayload {
  sub: string;
  email: string;
  sessionId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
    private cookieService: CookieService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (this.cookieService.isDev()) {
            return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          }
          return req?.cookies?.["access_token"] as string;
        },
      ]),
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
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: {
                        key: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive");
    }

    // Flatten permissions from all roles
    const permissions = new Set<string>();
    user.roles.forEach((userRole) => {
      userRole.role.permissions.forEach((rolePermission) => {
        permissions.add(rolePermission.permission.key);
      });
    });

    return {
      userId: user.id,
      userUUID: user.uuid,
      email: user.email,
      username: user.username,
      sessionId: payload.sessionId,
      permissions: Array.from(permissions),
    };
  }
}
