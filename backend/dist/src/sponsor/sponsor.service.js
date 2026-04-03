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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_utils_1 = require("../prisma/prisma.utils");
const file_upload_utils_1 = require("../common/utils/file-upload.utils");
let SponsorService = class SponsorService {
    db;
    constructor(db) {
        this.db = db;
    }
    getLogoPath(file, name, existingLogo, isNameChanged) {
        const fileName = name.replace(/\s+/g, "-").toLowerCase();
        if (file) {
            return (0, file_upload_utils_1.saveFile)(file, "sponsors", fileName, existingLogo);
        }
        if (isNameChanged && existingLogo) {
            const renamedPath = (0, file_upload_utils_1.renameFile)(existingLogo, fileName);
            return renamedPath || existingLogo;
        }
        return existingLogo;
    }
    async getAllSponsors(params) {
        const filters = params.filters || {};
        const prismaFilters = {};
        if (filters.name) {
            prismaFilters.name = { contains: String(filters.name), mode: "insensitive" };
        }
        if (filters.email) {
            prismaFilters.email = { contains: String(filters.email), mode: "insensitive" };
        }
        if (filters.phoneNumber) {
            prismaFilters.phoneNumber = { contains: String(filters.phoneNumber), mode: "insensitive" };
        }
        return await (0, prisma_utils_1.paginate)(this.db.sponsor, { ...params, filters: prismaFilters }, {}, { include: { links: true } });
    }
    async getSponsorById(id) {
        return await this.db.sponsor.findUnique({
            where: { id },
            include: { links: true },
        });
    }
    async createSponsor(data, file) {
        const logoPath = this.getLogoPath(file, data.name, data.logo || null, false);
        return await this.db.sponsor.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNumber: String(data.phoneNumber),
                description: data.description,
                contribution: data.contribution,
                logo: logoPath ?? data.logo,
                order: data.order ? Number(data.order) : undefined,
                isActive: data.isActive,
                links: {
                    create: data.links || [],
                },
            },
            include: { links: true },
        });
    }
    async updateSponsor(id, data, file) {
        const existingSponsor = await this.db.sponsor.findUnique({
            where: { id },
        });
        if (!existingSponsor) {
            return null;
        }
        const isNameChanged = existingSponsor.name !== data.name;
        const logoPath = this.getLogoPath(file, data.name, existingSponsor.logo || data.logo, isNameChanged);
        return await this.db.$transaction(async (tx) => {
            await tx.sponsorLink.deleteMany({
                where: { sponsorId: id },
            });
            return await tx.sponsor.update({
                where: { id },
                data: {
                    name: data.name,
                    email: data.email,
                    phoneNumber: String(data.phoneNumber),
                    description: data.description,
                    contribution: data.contribution,
                    logo: logoPath ?? data.logo,
                    order: data.order ? Number(data.order) : undefined,
                    isActive: data.isActive,
                    links: {
                        create: data.links || [],
                    },
                },
                include: { links: true },
            });
        });
    }
    async getPublicSponsors() {
        return await this.db.sponsor.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: { links: true },
        });
    }
};
exports.SponsorService = SponsorService;
exports.SponsorService = SponsorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SponsorService);
//# sourceMappingURL=sponsor.service.js.map