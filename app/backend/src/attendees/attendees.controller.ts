import { Controller, Get, Query } from "@nestjs/common";
import { AttendeesService } from "./attendees.service";
import { parseQuery } from "../prisma/prisma.utils";

@Controller("attendees")
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get("list")
  async listSponsors(@Query() query: Record<string, any>) {
    const result = await this.attendeesService.getAllAttendees(parseQuery(query));
    return {
      success: true,
      message: "Sponsors fetched successfully",
      status: 200,
      data: result,
    };
  }
}
