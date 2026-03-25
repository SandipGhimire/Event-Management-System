import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";

@Injectable()
export class AttendeesService {
  constructor(private readonly db: PrismaService) {}

  async getAllAttendees(params: FetchParams): Promise<PaginatedData<any>> {
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
    if (filters.clubName) {
      prismaFilters.clubName = { contains: String(filters.clubName), mode: "insensitive" };
    }
    if (filters.membershipID) {
      prismaFilters.membershipID = { contains: String(filters.membershipID), mode: "insensitive" };
    }

    return await paginate(this.db.attendee, { ...params, filters: prismaFilters });
  }
}
