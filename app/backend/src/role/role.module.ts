import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { APP_GUARD } from "@nestjs/core";
import { PermissionGuard } from "./guards/permission.guard";

@Module({
  providers: [
    RoleService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class RoleModule {}
