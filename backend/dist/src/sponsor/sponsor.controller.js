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
exports.SponsorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const sponsor_service_1 = require("./sponsor.service");
const prisma_utils_1 = require("../prisma/prisma.utils");
const sponsor_dto_1 = require("./sponsor.dto");
const permission_decorator_1 = require("../role/decorators/permission.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let SponsorController = class SponsorController {
    sponserService;
    constructor(sponserService) {
        this.sponserService = sponserService;
    }
    async publicList() {
        const result = await this.sponserService.getPublicSponsors();
        return {
            success: true,
            message: "Public sponsors fetched successfully",
            status: 200,
            data: result,
        };
    }
    async publicDetail(id) {
        const numericId = parseInt(id, 10);
        const result = await this.sponserService.getSponsorById(numericId);
        if (!result) {
            return {
                success: false,
                message: "Sponsor not found",
                status: 200,
                data: null,
            };
        }
        return {
            success: true,
            message: "Sponsor fetched successfully",
            status: 200,
            data: result,
        };
    }
    async listSponsors(query) {
        const result = await this.sponserService.getAllSponsors((0, prisma_utils_1.parseQuery)(query));
        return {
            success: true,
            message: "Sponsors fetched successfully",
            status: 200,
            data: result,
        };
    }
    async getSponsorById(id) {
        const numericId = parseInt(id, 10);
        const result = await this.sponserService.getSponsorById(numericId);
        if (!result) {
            return {
                success: false,
                message: "Sponsor not found",
                status: 200,
                data: null,
            };
        }
        return {
            success: true,
            message: "Sponsor fetched successfully",
            status: 200,
            data: result,
        };
    }
    async createSponsor(body, file) {
        const result = await this.sponserService.createSponsor(body, file);
        return {
            success: true,
            message: "Sponsor created successfully",
            status: 200,
            data: result,
        };
    }
    async updateSponsor(id, body, file) {
        const numericId = parseInt(id, 10);
        const result = await this.sponserService.updateSponsor(numericId, body, file);
        if (!result) {
            return {
                success: false,
                message: "Sponsor not found for update",
                status: 200,
                data: null,
            };
        }
        return {
            success: true,
            message: "Sponsor updated successfully",
            status: 200,
            data: result,
        };
    }
};
exports.SponsorController = SponsorController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("public/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "publicList", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("public/detail/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "publicDetail", null);
__decorate([
    (0, common_1.Get)("list"),
    (0, permission_decorator_1.Permission)(["sponsor.list"]),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "listSponsors", null);
__decorate([
    (0, common_1.Get)("detail/:id"),
    (0, permission_decorator_1.Permission)(["sponsor.view"]),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "getSponsorById", null);
__decorate([
    (0, common_1.Post)("create"),
    (0, permission_decorator_1.Permission)(["sponsor.create"]),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("logo")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sponsor_dto_1.SponsorCreateDto, Object]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "createSponsor", null);
__decorate([
    (0, common_1.Post)("update/:id"),
    (0, permission_decorator_1.Permission)(["sponsor.update"]),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("logo")),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sponsor_dto_1.SponsorUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], SponsorController.prototype, "updateSponsor", null);
exports.SponsorController = SponsorController = __decorate([
    (0, common_1.Controller)("sponsor"),
    __metadata("design:paramtypes", [sponsor_service_1.SponsorService])
], SponsorController);
//# sourceMappingURL=sponsor.controller.js.map