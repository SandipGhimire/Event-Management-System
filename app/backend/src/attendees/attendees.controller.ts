import { Controller, Get, Query } from "@nestjs/common";
import { AttendeesService } from "./attendees.service";

@Controller("attendees")
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get("list")
  async listSponsors(@Query() query: Record<string, any>) {
    let parsedFilters: unknown;
    if (typeof query.filters === "string") {
      parsedFilters = JSON.parse(query.filters);
    } else {
      parsedFilters = query.filters;
    }
    const params = {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10,
      search: query.search as string | undefined,
      sortBy: query.sortBy as string | undefined,
      sortOrder: query.sortOrder as "asc" | "desc" | undefined,
      filters:
        typeof parsedFilters === "object" && parsedFilters !== null ? (parsedFilters as Record<string, unknown>) : {},
    };
    const result = await this.attendeesService.getAllAttendees(params);
    return {
      success: true,
      message: "Sponsors fetched successfully",
      status: 200,
      data: result,
    };
  }
}
