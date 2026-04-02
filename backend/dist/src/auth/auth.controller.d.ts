import { AuthService } from "./auth.service";
import { SignUpDto, LoginDTO } from "./dto/auth.dto";
import type { Request, Response } from "express";
import { CookieService } from "./helpers/cookie.helper";
export declare class AuthController {
    private authService;
    private cookieService;
    constructor(authService: AuthService, cookieService: CookieService);
    signUp(dto: SignUpDto): Promise<{
        user: {
            uuid: string;
            email: string;
            username: string;
            firstName: string;
            middleName: string | null;
            lastName: string;
        };
    }>;
    login(dto: LoginDTO, req: Request, ipAddress: string, res: Response): Promise<{
        user: {
            uuid: string;
            email: string;
            username: string;
            firstName: string;
            middleName: string | null;
            lastName: string;
        };
        accessToken: string;
        refreshToken: string;
        sessionId: string;
    } | {
        user: {
            uuid: string;
            email: string;
            username: string;
            firstName: string;
            middleName: string | null;
            lastName: string;
        };
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    logoutAll(req: Request, res: Response): Promise<{
        message: string;
    }>;
    logoutOthers(req: Request): Promise<{
        message: string;
    }>;
    refreshTokens(req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        sessionId: string;
    } | {
        success: boolean;
    }>;
    getActiveSessions(req: Request): Promise<{
        sessionId: string;
        deviceName: string | null;
        deviceId: string | null;
        ipAddress: string | null;
        createdAt: Date;
        lastUsedAt: Date;
        expiresAt: Date;
    }[]>;
    revokeSession(req: Request, sessionId: string): Promise<{
        message: string;
    }>;
    revokeUserSessions(userUUID: string): Promise<{
        message: string;
    }>;
}
