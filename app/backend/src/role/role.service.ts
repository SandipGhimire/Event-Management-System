import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";

@Injectable()
export class RoleService {
  constructor(private readonly db: PrismaService) {}

  async getAllRoles(params: FetchParams): Promise<PaginatedData<any>> {
    const filters = (params.filters as Record<string, any>) || {};
    const prismaFilters: Record<string, any> = {};

    if (filters.name) {
      prismaFilters.name = { contains: String(filters.name), mode: "insensitive" };
    }

    return await paginate(this.db.role, { ...params, filters: prismaFilters });
  }
}
