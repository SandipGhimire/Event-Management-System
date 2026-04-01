import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserDetail, FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import * as bcrypt from "bcrypt";

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

  async createUser(data: CreateUserDto) {
    const { password, roleIds, ...rest } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.db.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        roles: roleIds
          ? {
              create: roleIds.map((roleId) => ({
                roleId: Number(roleId),
              })),
            }
          : undefined,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const { password, roleIds, ...rest } = data;
    const updateData: any = { ...rest };

    const user = await this.db.user.findUnique({ where: { id }, select: { uuid: true } });
    if (!user) {
      throw new Error("User not found");
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (roleIds) {
      await this.db.userRole.deleteMany({ where: { userUUID: user.uuid } });
      updateData.roles = {
        create: roleIds.map((roleId) => ({
          roleId: Number(roleId),
        })),
      };
    }

    return await this.db.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: number) {
    return await this.db.user.delete({
      where: { id },
    });
  }

  async getUserById(id: number): Promise<any> {
    const userDetail = await this.db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        uuid: true,
        email: true,
        username: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phoneNumber: true,
        isActive: true,
        roles: {
          select: {
            roleId: true,
          },
        },
      },
    });

    if (!userDetail) return null;

    return userDetail;
  }

  async getAllUsers(params: FetchParams): Promise<PaginatedData<any>> {
    const filters = (params.filters as Record<string, any>) || {};
    const prismaFilters: Record<string, any> = {};

    if (filters.username) {
      prismaFilters.username = { contains: String(filters.username), mode: "insensitive" };
    }
    if (filters.email) {
      prismaFilters.email = { contains: String(filters.email), mode: "insensitive" };
    }
    if (filters.firstName) {
      prismaFilters.firstName = { contains: String(filters.firstName), mode: "insensitive" };
    }
    if (filters.phoneNumber) {
      prismaFilters.phoneNumber = { contains: String(filters.phoneNumber), mode: "insensitive" };
    }

    return await paginate(this.db.user, params, prismaFilters, {
      select: {
        id: true,
        uuid: true,
        email: true,
        username: true,
        firstName: true,
        middleName: true,
        lastName: true,
        phoneNumber: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          include: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
