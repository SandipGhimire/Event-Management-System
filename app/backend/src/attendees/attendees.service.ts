import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAttendeePayload, FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";
import { Attendee } from "../../database/generated/client";
import { saveFile, saveBuffer, renameFile, deleteFile } from "../common/utils/file-upload.utils";
import { generateIdCard } from "../core/utils/cardGenerator";
import * as fs from "fs";
import * as path from "path";

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
    return attendee;
  }

  async getAllIdCards() {
    const attendees = await this.db.attendee.findMany({
      orderBy: { name: "asc" },
    });

    let isGenerating = false;
    const missingCards = attendees.filter((a) => !a.idCard);

    if (missingCards.length > 0) {
      isGenerating = true;
      // Start background generation
      void this.generateMissingCards(missingCards);
    }

    return {
      attendees: attendees.filter((a) => !!a.idCard),
      isGenerating,
    };
  }

  private async generateMissingCards(attendees: Attendee[]) {
    for (const attendee of attendees) {
      try {
        const idCardPath = await this.generateAndSaveIdCard(attendee);
        await this.db.attendee.update({
          where: { id: attendee.id },
          data: { idCard: idCardPath },
        });
      } catch (error) {
        console.error(`⚠️ Failed to generate background ID card for ${attendee.name}:`, error);
      }
    }
  }

  /**
   * Reads the profile picture from disk to provide to the card generator.
   * Returns null if no profile pic path exists or the file doesn't exist.
   */
  private getProfilePicBuffer(profilePicPath: string | null): Buffer | null {
    if (!profilePicPath) return null;
    const fullPath = path.join(process.cwd(), "public", profilePicPath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath);
  }

  /**
   * Generates and saves an ID card for the attendee.
   * Returns the relative path to the saved card image.
   */
  private async generateAndSaveIdCard(attendee: {
    name: string;
    position: string | null;
    clubName: string;
    qrCode: string;
    profilePic: string | null;
  }): Promise<string> {
    const profilePicBuffer = this.getProfilePicBuffer(attendee.profilePic);

    const cardBuffer = await generateIdCard({
      name: attendee.name,
      position: attendee.position || "",
      club: attendee.clubName,
      qrCodeText: attendee.qrCode,
      profilePicBuffer,
    });

    const fileName = `${attendee.name.replace(/\s+/g, "-").toLowerCase()}-idcard`;
    return saveBuffer(cardBuffer, "attendees", fileName, ".png");
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

    const attendee = await this.db.attendee.create({
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

    try {
      const idCardPath = await this.generateAndSaveIdCard(attendee);
      return await this.db.attendee.update({
        where: { id: attendee.id },
        data: { idCard: idCardPath },
      });
    } catch (error) {
      console.error("⚠️ Failed to generate ID card:", error);
      return attendee;
    }
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
      return null;
    }

    let profilePicPath = existingAttendee.profilePic;
    if (profilePic) {
      const fileName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-profile`;
      profilePicPath = saveFile(profilePic, "attendees", fileName, existingAttendee.profilePic);
    } else if (existingAttendee.name !== body.name && existingAttendee.profilePic) {
      const newPicName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-profile`;
      const renamedPath = renameFile(existingAttendee.profilePic, newPicName);
      if (renamedPath) profilePicPath = renamedPath;
    }

    let paymentSlipPath = existingAttendee.paymentSlip as string;
    if (paymentSlip) {
      const fileName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-payment`;
      paymentSlipPath = saveFile(paymentSlip, "attendees", fileName, existingAttendee.paymentSlip);
    } else if (existingAttendee.name !== body.name && existingAttendee.paymentSlip) {
      const newSlipName = `${body.name.replace(/\s+/g, "-").toLowerCase()}-payment`;
      const renamedPath = renameFile(existingAttendee.paymentSlip, newSlipName);
      if (renamedPath) paymentSlipPath = renamedPath;
    }

    const updatedAttendee = await this.db.attendee.update({
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

    try {
      if (existingAttendee.name !== body.name && existingAttendee.idCard) {
        deleteFile(existingAttendee.idCard);
      }
      const idCardPath = await this.generateAndSaveIdCard(updatedAttendee);
      return await this.db.attendee.update({
        where: { id: updatedAttendee.id },
        data: { idCard: idCardPath },
      });
    } catch (error) {
      console.error("⚠️ Failed to regenerate ID card:", error);
      return updatedAttendee;
    }
  }

  async getAttendeeByQrCode(qrCode: string) {
    const attendee = await this.db.attendee.findUnique({
      where: { qrCode },
      include: { logs: true },
    });
    if (!attendee) return null;
    return attendee;
  }

  async toggleTask(attendeeId: number, taskId: number, updatedBy: string) {
    const attendee = await this.db.attendee.findUnique({ where: { id: attendeeId } });
    if (!attendee) return null;

    const log = await this.db.attendeeTaskLog.findUnique({
      where: {
        attendeeId_taskId: {
          attendeeId,
          taskId,
        },
      },
    });

    if (log) {
      // Revert task
      await this.db.attendeeTaskLog.delete({
        where: { id: log.id },
      });
    } else {
      // Complete task
      await this.db.attendeeTaskLog.create({
        data: {
          attendeeId,
          taskId,
          scannedBy: updatedBy,
        },
      });
    }

    return this.db.attendee.findUnique({
      where: { id: attendeeId },
      include: { logs: true },
    });
  }
}
