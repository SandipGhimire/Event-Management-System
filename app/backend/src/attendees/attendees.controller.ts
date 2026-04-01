import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AttendeesService } from "./attendees.service";
import { parseQuery } from "../prisma/prisma.utils";
import { AttendeeCreateDto } from "./attendees.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller("attendees")
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get("list")
  async listAttendees(@Query() query: Record<string, any>) {
    const result = await this.attendeesService.getAllAttendees(parseQuery(query));
    return {
      success: true,
      message: "Attendees fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Get(":id")
  async getAttendeeById(@Param("id") id: string) {
    const numericId = parseInt(id, 10);
    const result = await this.attendeesService.getAttendeeById(numericId);
    return {
      success: true,
      message: "Attendee fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Post("create")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "profilePicture", maxCount: 1 },
      { name: "paymentSlip", maxCount: 1 },
    ])
  )
  async createAttendee(
    @Body() body: AttendeeCreateDto,
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[]; paymentSlip?: Express.Multer.File[] }
  ) {
    const profilePicture = files.profilePicture?.[0];
    const paymentSlip = files.paymentSlip?.[0];
    const result = await this.attendeesService.createAttendee(body, profilePicture, paymentSlip);
    return {
      success: true,
      message: "Attendee created successfully",
      status: 200,
      data: result,
    };
  }

  @Post("update/:id")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "profilePicture", maxCount: 1 },
      { name: "paymentSlip", maxCount: 1 },
    ])
  )
  async updateAttendee(
    @Body() body: AttendeeCreateDto,
    @UploadedFiles() files: { profilePicture?: Express.Multer.File[]; paymentSlip?: Express.Multer.File[] }
  ) {
    const profilePicture = files.profilePicture?.[0];
    const paymentSlip = files.paymentSlip?.[0];
    const result = await this.attendeesService.updateAttendee(body, profilePicture, paymentSlip);
    return {
      success: true,
      message: "Attendee updated successfully",
      status: 200,
      data: result,
    };
  }
}
