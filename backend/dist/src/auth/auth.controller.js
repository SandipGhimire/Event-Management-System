"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const jwt_refresh_auth_guard_1 = require("./guards/jwt-refresh-auth.guard");
const permission_decorator_1 = require("../role/decorators/permission.decorator");
const common_2 = require("@nestjs/common");
const public_decorator_1 = require("./decorators/public.decorator");
const cookie_helper_1 = require("./helpers/cookie.helper");
let AuthController = class AuthController {
    authService;
    cookieService;
    constructor(authService, cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }
    async signUp(dto) {
        return this.authService.signUp(dto);
    }
    async login(dto, req, ipAddress, res) {
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
    async logout(req, res) {
        const user = req.user;
        if (!this.cookieService.isDev()) {
            this.cookieService.clearAuthCookies(res);
        }
        const authResult = await this.authService.logout(user.userUUID, user.sessionId);
        return authResult;
    }
    async logoutAll(req, res) {
        const user = req.user;
        const authResult = await this.authService.logoutAll(user.userUUID);
        if (!this.cookieService.isDev()) {
            this.cookieService.clearAuthCookies(res);
        }
        return authResult;
    }
    async logoutOthers(req) {
        const user = req.user;
        return this.authService.logoutOtherSessions(user.userUUID, user.sessionId);
    }
    async refreshTokens(req, res) {
        const user = req.user;
        const authResult = await this.authService.refreshTokens(user.sub, user.sessionId, user.refreshToken);
        if (!this.cookieService.isDev()) {
            this.cookieService.setAuthCookies(res, authResult.accessToken, authResult.refreshToken);
            return { success: true };
        }
        return authResult;
    }
    async getActiveSessions(req) {
        const user = req.user;
        return this.authService.getActiveSessions(user.userUUID);
    }
    async revokeSession(req, sessionId) {
        const user = req.user;
        return this.authService.revokeSession(user.userUUID, sessionId);
    }
    async revokeUserSessions(userUUID) {
        return this.authService.logoutAll(userUUID);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDTO, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("logout-all"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Post)("logout-others"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutOthers", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_refresh_auth_guard_1.JwtRefreshAuthGuard),
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_2.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.Get)("sessions"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getActiveSessions", null);
__decorate([
    (0, common_1.Delete)("sessions/:sessionId"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revokeSession", null);
__decorate([
    (0, common_1.Delete)("sessions/user/:userUUID"),
    (0, permission_decorator_1.Permission)(["user.session.revoke"]),
    __param(0, (0, common_1.Param)("userUUID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revokeUserSessions", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        cookie_helper_1.CookieService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map