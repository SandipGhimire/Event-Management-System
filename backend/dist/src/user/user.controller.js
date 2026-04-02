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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const prisma_utils_1 = require("../prisma/prisma.utils");
const permission_decorator_1 = require("../role/decorators/permission.decorator");
const user_dto_1 = require("./user.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(req) {
        return await this.userService.getSelfUser(req.user.userUUID);
    }
    async updateSelf(req, data) {
        const result = await this.userService.updateSelfUser(req.user.userUUID, data);
        return {
            success: true,
            message: "Profile updated successfully",
            status: 200,
            data: result,
        };
    }
    async createUser(data) {
        const result = await this.userService.createUser(data);
        return {
            success: true,
            message: "User created successfully",
            status: 201,
            data: result,
        };
    }
    async updateUser(id, data) {
        const result = await this.userService.updateUser(id, data);
        if (!result) {
            return {
                success: false,
                message: "User not found for update",
                status: 200,
                data: null,
            };
        }
        return {
            success: true,
            message: "User updated successfully",
            status: 200,
            data: result,
        };
    }
    async deleteUser(id) {
        await this.userService.deleteUser(id);
        return {
            success: true,
            message: "User deleted successfully",
            status: 200,
        };
    }
    async listUsers(query) {
        const result = await this.userService.getAllUsers((0, prisma_utils_1.parseQuery)(query));
        return {
            success: true,
            message: "Users fetched successfully",
            status: 200,
            data: result,
        };
    }
    async getUserById(id) {
        const result = await this.userService.getUserById(id);
        if (!result) {
            return {
                success: false,
                message: "User not found",
                status: 200,
                data: null,
            };
        }
        return {
            success: true,
            message: "User fetched successfully",
            status: 200,
            data: result,
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)("self"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)("self"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateSelfDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSelf", null);
__decorate([
    (0, common_1.Post)("create"),
    (0, permission_decorator_1.Permission)(["user.create"]),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, permission_decorator_1.Permission)(["user.update"]),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, permission_decorator_1.Permission)(["user.delete"]),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)("list"),
    (0, permission_decorator_1.Permission)(["user.list"]),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, permission_decorator_1.Permission)(["user.view"]),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map