import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAttendeePayload, FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";
import { Attendee } from "../../database/generated/client";
import { saveFile } from "../common/utils/file-upload.utils";

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

  async createAttendee(body: CreateAttendeePayload, file?: Express.Multer.File) {
    const generateRandomQRCode = async (length: number = 30): Promise<string> => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existingAttendee: Attendee | null = await this.db.attendee.findUnique({
        where: { qrCode: result },
      });

      if (existingAttendee) {
        return generateRandomQRCode(length);
      }

      return result;
    };

    let profilePicPath: string | null = null;
    if (file) {
      const fileName = body.name.replace(/\s+/g, "-").toLowerCase();
      profilePicPath = saveFile(file, "attendees", fileName);
    }

    const qrCode = await generateRandomQRCode();

    return await this.db.attendee.create({
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: String(body.phoneNumber),
        clubName: body.clubName,
        membershipID: body.membershipID ? String(body.membershipID) : null,
        isVeg: body.isVeg,
        profilePic: profilePicPath,
        qrCode,
      },
    });
  }
}
