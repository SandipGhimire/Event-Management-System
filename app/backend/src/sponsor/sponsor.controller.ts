import { Controller, Get, Query } from "@nestjs/common";
import { SponsorService } from "./sponsor.service";
import { parseQuery } from "../prisma/prisma.utils";

@Controller("sponsor")
export class SponsorController {
  constructor(private readonly sponserService: SponsorService) {}

  @Get("list")
  async listSponsors(@Query() query: Record<string, any>) {
    const result = await this.sponserService.getAllSponsors(parseQuery(query));
    return {
      success: true,
      message: "Sponsors fetched successfully",
      status: 200,
      data: result,
    };
  }
}
