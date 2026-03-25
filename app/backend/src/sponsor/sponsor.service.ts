import { Injectable } from "@nestjs/common";
import type { FetchParams, PaginatedData } from "shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { paginate } from "../prisma/prisma.utils";

@Injectable()
export class SponsorService {
  constructor(private readonly db: PrismaService) {}
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

    return await paginate(this.db.sponsor, { ...params, filters: prismaFilters });
  }
}
