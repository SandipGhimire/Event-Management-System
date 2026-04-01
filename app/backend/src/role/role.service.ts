import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FetchParams, PaginatedData } from "shared-types";
import { paginate } from "../prisma/prisma.utils";
import { CreateRoleDto, UpdateRoleDto } from "./role.dto";

@Injectable()
export class RoleService {
  constructor(private readonly db: PrismaService) {}

  async createRole(data: CreateRoleDto, userId: number) {
    const { permissionKeys, ...rest } = data;
    const user = await this.db.user.findUnique({ where: { id: userId }, select: { username: true } });

    return await this.db.role.create({
      data: {
        ...rest,
        createdBy: user?.username || "system",
        permissions: permissionKeys
          ? {
              create: await Promise.all(
                permissionKeys.map(async (key) => {
                  const perm = await this.db.permission.findUnique({ where: { key } });
                  return { permissionId: perm!.id };
                })
              ),
            }
          : undefined,
      },
    });
  }

  async updateRole(id: number, data: UpdateRoleDto, userId: number) {
    const { permissionKeys, ...rest } = data;
    const user = await this.db.user.findUnique({ where: { id: userId }, select: { username: true } });
    const updateData: UpdateRoleDto & { permissions?: { create: { permissionId: number }[] }; updatedBy: string } = {
      ...rest,
      updatedBy: user?.username || "system",
    };

    if (permissionKeys) {
      await this.db.rolePermission.deleteMany({ where: { roleId: id } });
      updateData.permissions = {
        create: await Promise.all(
          permissionKeys.map(async (key) => {
            const perm = await this.db.permission.findUnique({ where: { key } });
            return { permissionId: perm!.id };
          })
        ),
      };
    }

    return await this.db.role.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteRole(id: number) {
    return await this.db.role.delete({
      where: { id },
    });
  }

  async getRoleById(id: number) {
    return await this.db.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async getAllRoles(params: FetchParams): Promise<PaginatedData<any>> {
    const filters = (params.filters as Record<string, any>) || {};
    const prismaFilters: Record<string, any> = {};

    if (filters.name) {
      prismaFilters.name = { contains: String(filters.name), mode: "insensitive" };
    }

    return await paginate(this.db.role, params, prismaFilters, {
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
    });
  }

  async getAllPermissions() {
    return await this.db.permission.findMany({
      orderBy: { key: "asc" },
    });
  }
}
