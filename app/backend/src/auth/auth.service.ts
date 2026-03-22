import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UAParser } from "ua-parser-js";
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDto, LoginDTO, RefreshTokenRequestDto } from "./dto/auth.dto";
import { JwtPayload } from "./strategies/jwt.strategy";

interface DeviceInfo {
  userAgent?: string;
  ipAddress?: string;
  deviceId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signUp(dto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }
    if (dto.phoneNumber) {
      const phoneExists = await this.prisma.user.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      });

      if (phoneExists) {
        throw new ConflictException("Phone number already exists");
      }
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        username: dto.username,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        lastLogin: new Date(),
      },
    });

    return {
      user: {
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      },
    };
  }

  async signIn(dto: LoginDTO, deviceInfo: DeviceInfo) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update last login
    await this.prisma.user.update({
      where: { uuid: user.uuid },
      data: { lastLogin: new Date() },
    });

    // Clean up expired and inactive tokens
    await this.cleanupInactiveSessions(user.uuid);

    const tokens = await this.createSession(user.uuid, user.email, deviceInfo);

    return {
      ...tokens,
      user: {
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      },
    };
  }

  async createSession(userUUID: string, email: string, deviceInfo: DeviceInfo) {
    // Parse user agent for device information
    const parser = new UAParser(deviceInfo.userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    const deviceName = `${browser.name || "Unknown"} on ${os.name || "Unknown"}`;

    const sessionInactivityDays = this.config.get<number>("SESSION_INACTIVITY_DAYS") || 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + sessionInactivityDays);

    const refreshTokenEntry = await this.prisma.refreshToken.create({
      data: {
        token: "", // Will be updated after generating the token
        userUUID,
        expiresAt,
        deviceId: deviceInfo.deviceId,
        deviceName,
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        lastUsedAt: new Date(),
      },
    });

    const sessionId = refreshTokenEntry.id;

    // Generate tokens with session ID
    const tokens = await this.getTokens(userUUID, email, sessionId);

    // Hash and update the refresh token
    const hashedToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: { token: hashedToken },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId,
    };
  }

  async logout(userUUID: string, sessionId: string) {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        id: sessionId,
        userUUID,
      },
    });

    if (result.count === 0) {
      throw new ForbiddenException("Session not found");
    }

    return { message: "Logged out successfully" };
  }

  async logoutAll(userUUID: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userUUID },
    });
    return { message: "Logged out from all devices" };
  }

  async logoutOtherSessions(userUUID: string, currentSessionId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userUUID,
        id: { not: currentSessionId },
      },
    });

    return { message: "Logged out from other devices" };
  }

  async refreshTokens(userUUID: string, refreshToken: string) {
    // Decode the refresh token to get session ID
    let decoded: RefreshTokenRequestDto;
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new ForbiddenException("Invalid refresh token");
    }

    const sessionId = decoded.sessionId;

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { id: sessionId },
    });

    if (!storedToken || storedToken.userUUID !== userUUID) {
      throw new ForbiddenException("Access Denied - Session not found");
    }

    if (new Date() > storedToken.expiresAt) {
      // Delete expired token
      await this.prisma.refreshToken.delete({ where: { id: sessionId } });
      throw new ForbiddenException("Access Denied - Token expired");
    }

    const tokenMatches = await bcrypt.compare(refreshToken, storedToken.token);
    if (!tokenMatches) {
      throw new ForbiddenException("Access Denied - Invalid token");
    }

    // Generate new tokens with the same session ID
    const tokens = await this.getTokens(userUUID, decoded.email, sessionId);

    // Update the stored refresh token and last used time
    const hashedToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: {
        token: hashedToken,
        lastUsedAt: new Date(),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId,
    };
  }

  async getActiveSessions(userUUID: string) {
    // Clean up expired and inactive sessions first
    await this.cleanupInactiveSessions(userUUID);

    const sessions = await this.prisma.refreshToken.findMany({
      where: { userUUID },
      orderBy: { lastUsedAt: "desc" },
    });

    return sessions.map((session) => ({
      sessionId: session.id,
      deviceName: session.deviceName,
      deviceId: session.deviceId,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
    }));
  }

  async revokeSession(userUUID: string, sessionId: string) {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        id: sessionId,
        userUUID,
      },
    });

    if (result.count === 0) {
      throw new ForbiddenException("Session not found");
    }

    return { message: "Session revoked successfully" };
  }

  private async getTokens(userUUID: string, email: string, sessionId: string) {
    const payload: JwtPayload = {
      sub: userUUID,
      email: email,
      sessionId: sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get("JWT_SECRET"),
        expiresIn: this.config.get("JWT_SECRET_EXPIRE_TIME"),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get("JWT_REFRESH_SECRET"),
        expiresIn: `${this.config.get<number>("SESSION_INACTIVITY_DAYS") || 30}d`,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async cleanupExpiredTokens(userUUID: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userUUID,
        expiresAt: { lt: new Date() },
      },
    });
  }

  private async cleanupInactiveSessions(userUUID: string) {
    const inactivityThreshold = this.config.get<number>("SESSION_INACTIVITY_DAYS") || 30;
    const inactivityDate = new Date();
    inactivityDate.setDate(inactivityDate.getDate() - inactivityThreshold);

    // Delete sessions that haven't been used in the specified period
    await this.prisma.refreshToken.deleteMany({
      where: {
        userUUID,
        lastUsedAt: { lt: inactivityDate },
      },
    });

    // Also delete expired sessions
    await this.cleanupExpiredTokens(userUUID);
  }

  // Method to run periodic cleanup for all users (called by cron job)
  async cleanupAllInactiveSessions() {
    const inactivityThreshold = this.config.get<number>("SESSION_INACTIVITY_DAYS") || 30;
    const inactivityDate = new Date();
    inactivityDate.setDate(inactivityDate.getDate() - inactivityThreshold);

    // Delete all inactive sessions
    const inactiveResult = await this.prisma.refreshToken.deleteMany({
      where: {
        lastUsedAt: { lt: inactivityDate },
      },
    });

    // Delete all expired sessions
    const expiredResult = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return {
      inactiveSessions: inactiveResult.count,
      expiredSessions: expiredResult.count,
    };
  }
}
