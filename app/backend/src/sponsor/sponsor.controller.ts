import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SponsorService } from "./sponsor.service";
import { parseQuery } from "../prisma/prisma.utils";
import { SponsorCreateDto, SponsorUpdateDto } from "./sponsor.dto";

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

  @Get("detail/:id")
  async getSponsorById(@Param("id") id: string) {
    const numericId = parseInt(id, 10);
    const result = await this.sponserService.getSponsorById(numericId);
    return {
      success: true,
      message: "Sponsor fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Post("create")
  @UseInterceptors(FileInterceptor("logo"))
  async createSponsor(@Body() body: SponsorCreateDto, @UploadedFile() file?: Express.Multer.File) {
    const result = await this.sponserService.createSponsor(body, file);
    return {
      success: true,
      message: "Sponsor created successfully",
      status: 200,
      data: result,
    };
  }

  @Post("update/:id")
  @UseInterceptors(FileInterceptor("logo"))
  async updateSponsor(
    @Param("id") id: string,
    @Body() body: SponsorUpdateDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const numericId = parseInt(id, 10);
    const result = await this.sponserService.updateSponsor(numericId, body, file);
    return {
      success: true,
      message: "Sponsor updated successfully",
      status: 200,
      data: result,
    };
  }
}
