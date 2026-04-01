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

  async getAttendeeById(id: number) {
    const attendee = await this.db.attendee.findUnique({
      where: { id },
    });
    if (!attendee) throw new Error("Attendee not found");
    return attendee;
  }

  async createAttendee(
    body: CreateAttendeePayload,
    profilePic?: Express.Multer.File,
    paymentSlip?: Express.Multer.File
  ) {
    const generateRandomQRCode = async (length: number = 100): Promise<string> => {
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
    if (profilePic) {
      const fileName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-profile`;
      profilePicPath = saveFile(profilePic, "attendees", fileName);
    }

    let paymentSlipPath: string | null = null;
    if (paymentSlip) {
      const fileName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-payment`;
      paymentSlipPath = saveFile(paymentSlip, "attendees", fileName);
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
        paymentSlip: paymentSlipPath,
        position: body.position,
        qrCode,
      },
    });
  }

  async updateAttendee(
    body: CreateAttendeePayload & { id?: number },
    profilePic?: Express.Multer.File,
    paymentSlip?: Express.Multer.File
  ) {
    if (!body.id) throw new Error("Attendee ID is required for update");

    const existingAttendee = await this.db.attendee.findUnique({
      where: { id: Number(body.id) },
    });

    if (!existingAttendee) {
      throw new Error("Attendee not found");
    }

    let profilePicPath = existingAttendee.profilePic;
    if (profilePic) {
      const fileName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-profile`;
      profilePicPath = saveFile(profilePic, "attendees", fileName);
    }

    let paymentSlipPath = existingAttendee.paymentSlip;
    if (paymentSlip) {
      const fileName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-payment`;
      paymentSlipPath = saveFile(paymentSlip, "attendees", fileName);
    }

    return await this.db.attendee.update({
      where: { id: Number(body.id) },
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: String(body.phoneNumber),
        clubName: body.clubName,
        membershipID: body.membershipID ? String(body.membershipID) : null,
        isVeg: body.isVeg,
        position: body.position,
        profilePic: profilePicPath,
        paymentSlip: paymentSlipPath,
      },
    });
  }
}
