import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AttendeesService } from "./attendees.service";
import { parseQuery } from "../prisma/prisma.utils";
import { AttendeeCreateDto } from "./attendees.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Permission } from "../role/decorators/permission.decorator";
import type { AuthenticatedRequest } from "../auth/interfaces/auth-request.interface";

@Controller("attendees")
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get("list")
  @Permission(["attendee.list"])
  async listAttendees(@Query() query: Record<string, any>) {
    const result = await this.attendeesService.getAllAttendees(parseQuery(query));
    return {
      success: true,
      message: "Attendees fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Get("qr/:qrCode")
  @Permission(["attendee.scan"])
  async getAttendeeByQrCode(@Param("qrCode") qrCode: string) {
    const result = await this.attendeesService.getAttendeeByQrCode(qrCode);
    if (!result) {
      return {
        success: false,
        message: "Attendee not found for this QR code",
        status: 200,
        data: null,
      };
    }
    return {
      success: true,
      message: "Attendee fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Post("qr/:qrCode/task/:taskId/toggle")
  @Permission(["attendee.qr_task_toggle"])
  async toggleTaskByQrCode(
    @Param("qrCode") qrCode: string,
    @Param("taskId") taskId: string,
    @Req() req: AuthenticatedRequest
  ) {
    const attendee = await this.attendeesService.getAttendeeByQrCode(qrCode);
    if (!attendee) {
      return {
        success: false,
        message: "Attendee not found for this QR code",
        status: 200,
        data: null,
      };
    }
    const result = await this.attendeesService.toggleTask(attendee.id, parseInt(taskId, 10), req.user.username);
    return {
      success: true,
      message: "Task toggled successfully",
      status: 200,
      data: result,
    };
  }

  @Post(":id/task/:taskId/toggle")
  @Permission(["attendee.task_toggle"])
  async toggleTaskById(@Param("id") id: string, @Param("taskId") taskId: string, @Req() req: AuthenticatedRequest) {
    const result = await this.attendeesService.toggleTask(parseInt(id, 10), parseInt(taskId, 10), req.user.username);
    if (!result) {
      return {
        success: false,
        message: "Failed to toggle task. Attendee or Task might not exist.",
        status: 200,
        data: null,
      };
    }
    return {
      success: true,
      message: "Task toggled successfully",
      status: 200,
      data: result,
    };
  }

  @Get(":id")
  @Permission(["attendee.view"])
  async getAttendeeById(@Param("id") id: string) {
    const numericId = parseInt(id, 10);
    const result = await this.attendeesService.getAttendeeById(numericId);
    if (!result) {
      return {
        success: false,
        message: "Attendee not found",
        status: 200,
        data: null,
      };
    }
    return {
      success: true,
      message: "Attendee fetched successfully",
      status: 200,
      data: result,
    };
  }

  @Post("create")
  @Permission(["attendee.create"])
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
  @Permission(["attendee.update"])
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
    if (!result) {
      return {
        success: false,
        message: "Attendee not found for update",
        status: 200,
        data: null,
      };
    }
    return {
      success: true,
      message: "Attendee updated successfully",
      status: 200,
      data: result,
    };
  }
}
