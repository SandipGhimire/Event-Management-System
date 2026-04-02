"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_utils_1 = require("../prisma/prisma.utils");
const bcrypt = __importStar(require("bcrypt"));
function generateFullName(firstName, middleName, lastName) {
    return `${firstName} ${middleName || ""} ${lastName}`.replace("  ", " ");
}
let UserService = class UserService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getSelfUser(uuid) {
        const userDetail = await this.db.user.findUnique({
            where: {
                uuid,
            },
            include: {
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
        if (!userDetail)
            return {};
        const user = {
            id: userDetail.id,
            uuid: userDetail.uuid,
            username: userDetail.username,
            email: userDetail.email,
            phoneNumber: userDetail.phoneNumber,
            firstName: userDetail.firstName,
            middleName: userDetail?.middleName,
            lastName: userDetail.lastName,
            fullName: generateFullName(userDetail.firstName, userDetail?.middleName, userDetail.lastName),
            permissions: userDetail.roles.flatMap((role) => role.role.permissions.map((permission) => permission.permission.key)),
        };
        return user;
    }
    async updateSelfUser(uuid, data) {
        const { password, oldPassword, ...rest } = data;
        const user = await this.db.user.findUnique({
            where: { uuid },
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        const updateData = { ...rest };
        if (password) {
            if (!oldPassword) {
                throw new common_1.BadRequestException("Old password is required to set a new password");
            }
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException("Invalid old password");
            }
            updateData.password = await bcrypt.hash(password, 10);
        }
        return await this.db.user.update({
            where: { uuid },
            data: updateData,
        });
    }
    async createUser(data) {
        const { password, roleIds, ...rest } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.db.user.create({
            data: {
                ...rest,
                password: hashedPassword,
                roles: roleIds
                    ? {
                        create: roleIds.map((roleId) => ({
                            roleId: Number(roleId),
                        })),
                    }
                    : undefined,
            },
        });
    }
    async updateUser(id, data) {
        const { password, roleIds, ...rest } = data;
        const updateData = { ...rest };
        const user = await this.db.user.findUnique({ where: { id }, select: { uuid: true } });
        if (!user) {
            return null;
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (roleIds) {
            await this.db.userRole.deleteMany({ where: { userUUID: user.uuid } });
            updateData.roles = {
                create: roleIds.map((roleId) => ({
                    roleId: Number(roleId),
                })),
            };
        }
        return await this.db.user.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteUser(id) {
        return await this.db.user.delete({
            where: { id },
        });
    }
    async getUserById(id) {
        const userDetail = await this.db.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                uuid: true,
                email: true,
                username: true,
                firstName: true,
                middleName: true,
                lastName: true,
                phoneNumber: true,
                isActive: true,
                roles: {
                    select: {
                        roleId: true,
                    },
                },
            },
        });
        if (!userDetail)
            return null;
        const user = {
            ...userDetail,
            fullName: generateFullName(userDetail.firstName, userDetail.middleName, userDetail.lastName),
            roleIds: userDetail.roles.map((r) => r.roleId),
        };
        return user;
    }
    async getAllUsers(params) {
        const filters = params.filters || {};
        const prismaFilters = {};
        if (filters.username) {
            prismaFilters.username = { contains: String(filters.username), mode: "insensitive" };
        }
        if (filters.email) {
            prismaFilters.email = { contains: String(filters.email), mode: "insensitive" };
        }
        if (filters.firstName) {
            prismaFilters.firstName = { contains: String(filters.firstName), mode: "insensitive" };
        }
        if (filters.phoneNumber) {
            prismaFilters.phoneNumber = { contains: String(filters.phoneNumber), mode: "insensitive" };
        }
        return await (0, prisma_utils_1.paginate)(this.db.user, params, prismaFilters, {
            select: {
                id: true,
                uuid: true,
                email: true,
                username: true,
                firstName: true,
                middleName: true,
                lastName: true,
                phoneNumber: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    include: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map