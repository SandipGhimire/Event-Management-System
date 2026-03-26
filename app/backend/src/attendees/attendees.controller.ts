import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AttendeesService } from "./attendees.service";
import { parseQuery } from "../prisma/prisma.utils";
import { AttendeeCreateDto } from "./attendees.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("attendees")
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get("list")
  async listSponsors(@Query() query: Record<string, any>) {
    const result = await this.attendeesService.getAllAttendees(parseQuery(query));
    return {
      success: true,
      message: "Attendees fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Post("create")
  @UseInterceptors(FileInterceptor("profilePicture"))
  async createAttendee(@Body() body: AttendeeCreateDto, @UploadedFile() file?: Express.Multer.File) {
    const result = await this.attendeesService.createAttendee(body, file);
    return {
      success: true,
      message: "Attendee created successfully",
      status: 200,
      data: result,
    };
  }
}
