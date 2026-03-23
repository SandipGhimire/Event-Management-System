import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserDetail } from "shared-types";

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async getSelfUser(uuid: string): Promise<UserDetail> {
    const userDetail = await this.db.user.findUnique({
      where: {
        uuid,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: {
                        key: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userDetail) return {} as UserDetail;

    const user = {
      id: userDetail.id,
      uuid: userDetail.uuid,
      username: userDetail.username,
      email: userDetail.email,
      phoneNumber: userDetail.phoneNumber,
      firstName: userDetail.firstName,
      middleName: userDetail?.middleName,
      lastName: userDetail.lastName,
      fullName: `${userDetail.firstName} ${userDetail.middleName || ""} ${userDetail.lastName}`.replace("  ", " "),
      permissions: userDetail.roles.flatMap((role) =>
        role.role.permissions.map((permission) => permission.permission.key)
      ),
    } as UserDetail;

    return user;
  }
}
