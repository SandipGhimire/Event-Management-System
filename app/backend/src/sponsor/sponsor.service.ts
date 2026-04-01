import { Injectable } from "@nestjs/common";
import type { FetchParams, PaginatedData } from "shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { paginate } from "../prisma/prisma.utils";
import { saveFile } from "../common/utils/file-upload.utils";
import { SponsorCreateDto, SponsorUpdateDto } from "./sponsor.dto";

@Injectable()
export class SponsorService {
  constructor(private readonly db: PrismaService) {}

  private getLogoPath(file: Express.Multer.File | undefined, name: string, existingLogo: string | null): string | null {
    if (file) {
      const fileName = name.replace(/\s+/g, "-").toLowerCase();
      return saveFile(file, "sponsors", fileName);
    }
    return existingLogo;
  }

  async getAllSponsors(params: FetchParams): Promise<PaginatedData<any>> {
    const filters = (params.filters as Record<string, any>) || {};
    const prismaFilters: Record<string, any> = {};

    if (filters.name) {
      prismaFilters.name = { contains: String(filters.name), mode: "insensitive" };
    }
    if (filters.email) {
      prismaFilters.email = { contains: String(filters.email), mode: "insensitive" };
    }
    if (filters.phoneNumber) {
      prismaFilters.phoneNumber = { contains: String(filters.phoneNumber), mode: "insensitive" };
    }

    return await paginate(this.db.sponsor, { ...params, filters: prismaFilters }, {}, { include: { links: true } });
  }

  async getSponsorById(id: number) {
    return await this.db.sponsor.findUnique({
      where: { id },
      include: { links: true },
    });
  }

  async createSponsor(data: SponsorCreateDto, file?: Express.Multer.File) {
    const logoPath = this.getLogoPath(file, data.name, data.logo || null);

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

  async updateSponsor(id: number, data: SponsorUpdateDto, file?: Express.Multer.File) {
    const existingSponsor = await this.db.sponsor.findUnique({
      where: { id },
    });

    if (!existingSponsor) {
      throw new Error("Sponsor not found");
    }

    const logoPath = this.getLogoPath(file, data.name, existingSponsor.logo || data.logo);

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
}
