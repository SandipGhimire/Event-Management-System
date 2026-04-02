import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAttendeePayload, FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";
import { Attendee } from "../../database/generated/client";
import { saveFile, saveBuffer } from "../common/utils/file-upload.utils";
import { generateIdCard } from "../core/utils/cardGenerator";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class AttendeesService {
  private isGeneratingCards = false;

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

    const missingCards = attendees.filter((a) => !a.idCard);

    if (missingCards.length > 0 && !this.isGeneratingCards) {
      this.isGeneratingCards = true;
      console.log(`🎴 [getAllIdCards] Starting background generation for ${missingCards.length} missing cards`);
      // Start background generation
      void this.generateMissingCards(missingCards);
    }

    return {
      attendees: attendees.filter((a) => !!a.idCard),
      isGenerating: this.isGeneratingCards || missingCards.length > 0,
    };
  }

  private async generateMissingCards(attendees: Attendee[]) {
    try {
      for (const attendee of attendees) {
        try {
          console.log(`🎴 [generateMissingCards] Generating card for attendee #${attendee.id} (${attendee.name})`);
          const idCardPath = await this.generateAndSaveIdCard(attendee);
          await this.db.attendee.update({
            where: { id: attendee.id },
            data: { idCard: idCardPath },
          });
          console.log(`✅ [generateMissingCards] Card saved for attendee #${attendee.id}: ${idCardPath}`);
        } catch (error) {
          console.error(`❌ [generateMissingCards] Failed for attendee #${attendee.id} (${attendee.name}):`, error);
        }
      }
    } finally {
      this.isGeneratingCards = false;
      console.log(`🎴 [generateMissingCards] Background generation complete`);
    }
  }

  /**
   * Reads the profile picture from disk to provide to the card generator.
   * Returns null if no profile pic path exists or the file doesn't exist.
   */
  private getProfilePicBuffer(profilePicPath: string | null): Buffer | null {
    if (!profilePicPath) return null;
    const fullPath = path.join(process.cwd(), "public", profilePicPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ [getProfilePicBuffer] Profile pic not found on disk: ${fullPath}`);
      return null;
    }
    console.log(`📸 [getProfilePicBuffer] Loaded profile pic: ${profilePicPath}`);
    return fs.readFileSync(fullPath);
  }

  /**
   * Generates and saves an ID card for the attendee.
   * Uses ID-based path: attendees/idcard/{id}-idcard.png
   */
  private async generateAndSaveIdCard(attendee: {
    id: number;
    name: string;
    position: string | null;
    clubName: string;
    qrCode: string;
    profilePic: string | null;
  }): Promise<string> {
    console.log(`🎴 [generateAndSaveIdCard] Generating ID card for attendee #${attendee.id} (${attendee.name})`);

    const profilePicBuffer = this.getProfilePicBuffer(attendee.profilePic);

    const cardBuffer = await generateIdCard({
      name: attendee.name,
      position: attendee.position || "",
      club: attendee.clubName,
      qrCodeText: attendee.qrCode,
      profilePicBuffer,
    });

    const fileName = `${attendee.id}-idcard`;
    const savedPath = saveBuffer(cardBuffer, "attendees/idcard", fileName, ".png");
    console.log(`✅ [generateAndSaveIdCard] ID card saved: ${savedPath}`);
    return savedPath;
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

    const qrCode = await generateRandomQRCode();

    // Step 1: Create the DB record first to get the auto-increment ID
    console.log(`👤 [createAttendee] Creating attendee: ${body.name}`);
    const attendee = await this.db.attendee.create({
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: String(body.phoneNumber),
        clubName: body.clubName,
        membershipID: body.membershipID ? String(body.membershipID) : null,
        isVeg: body.isVeg,
        position: body.position,
        qrCode,
      },
    });

    console.log(`✅ [createAttendee] DB record created with ID #${attendee.id}`);

    // Step 2: Save files using the attendee ID
    let profilePicPath: string | null = null;
    if (profilePic) {
      const fileName = `${attendee.id}-profile`;
      profilePicPath = saveFile(profilePic, "attendees/profile", fileName);
      console.log(`📸 [createAttendee] Profile pic saved: ${profilePicPath}`);
    }

    let paymentSlipPath: string | null = null;
    if (paymentSlip) {
      const fileName = `${attendee.id}-payslip`;
      paymentSlipPath = saveFile(paymentSlip, "attendees/payslip", fileName);
      console.log(`💳 [createAttendee] Payment slip saved: ${paymentSlipPath}`);
    }

    // Step 3: Generate ID card and update all file paths in one go
    try {
      // Update profile/payment paths first so the card generator can read the profile pic
      if (profilePicPath || paymentSlipPath) {
        await this.db.attendee.update({
          where: { id: attendee.id },
          data: {
            profilePic: profilePicPath,
            paymentSlip: paymentSlipPath,
          },
        });
      }

      const idCardPath = await this.generateAndSaveIdCard({
        ...attendee,
        profilePic: profilePicPath,
      });

      const result = await this.db.attendee.update({
        where: { id: attendee.id },
        data: {
          profilePic: profilePicPath,
          paymentSlip: paymentSlipPath,
          idCard: idCardPath,
        },
      });

      console.log(`✅ [createAttendee] All files saved for attendee #${attendee.id}`);
      console.log(`   Profile: ${profilePicPath || "none"}`);
      console.log(`   Payment: ${paymentSlipPath || "none"}`);
      console.log(`   ID Card: ${idCardPath}`);

      return result;
    } catch (error) {
      console.error(`❌ [createAttendee] Failed to generate ID card for #${attendee.id}:`, error);
      // Still update file paths even if card generation fails
      return await this.db.attendee.update({
        where: { id: attendee.id },
        data: {
          profilePic: profilePicPath,
          paymentSlip: paymentSlipPath,
        },
      });
    }
  }

  async updateAttendee(
    body: CreateAttendeePayload & { id?: number },
    profilePic?: Express.Multer.File,
    paymentSlip?: Express.Multer.File
  ) {
    if (!body.id) throw new Error("Attendee ID is required for update");
    const attendeeId = Number(body.id);

    const existingAttendee = await this.db.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!existingAttendee) {
      console.log(`⚠️ [updateAttendee] Attendee #${attendeeId} not found`);
      return null;
    }

    console.log(`✏️ [updateAttendee] Updating attendee #${attendeeId} (${existingAttendee.name} → ${body.name})`);

    // Save new profile pic using ID-based path (no rename needed!)
    let profilePicPath = existingAttendee.profilePic;
    if (profilePic) {
      const fileName = `${attendeeId}-profile`;
      profilePicPath = saveFile(profilePic, "attendees/profile", fileName, existingAttendee.profilePic);
      console.log(`📸 [updateAttendee] New profile pic saved: ${profilePicPath}`);
    } else {
      console.log(`📸 [updateAttendee] Profile pic unchanged: ${profilePicPath || "none"}`);
    }

    // Save new payment slip using ID-based path (no rename needed!)
    let paymentSlipPath = existingAttendee.paymentSlip as string;
    if (paymentSlip) {
      const fileName = `${attendeeId}-payslip`;
      paymentSlipPath = saveFile(paymentSlip, "attendees/payslip", fileName, existingAttendee.paymentSlip);
      console.log(`💳 [updateAttendee] New payment slip saved: ${paymentSlipPath}`);
    } else {
      console.log(`💳 [updateAttendee] Payment slip unchanged: ${paymentSlipPath || "none"}`);
    }

    // Update DB with new data
    const updatedAttendee = await this.db.attendee.update({
      where: { id: attendeeId },
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

    console.log(`✅ [updateAttendee] DB record updated for attendee #${attendeeId}`);

    // Always regenerate ID card (overwrites old one automatically via ID-based naming)
    try {
      const idCardPath = await this.generateAndSaveIdCard({
        ...updatedAttendee,
        profilePic: profilePicPath,
      });

      const result = await this.db.attendee.update({
        where: { id: updatedAttendee.id },
        data: { idCard: idCardPath },
      });

      console.log(`✅ [updateAttendee] All done for attendee #${attendeeId}`);
      console.log(`   Profile: ${profilePicPath || "none"}`);
      console.log(`   Payment: ${paymentSlipPath || "none"}`);
      console.log(`   ID Card: ${idCardPath}`);

      return result;
    } catch (error) {
      console.error(`❌ [updateAttendee] Failed to regenerate ID card for #${attendeeId}:`, error);
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
