import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionMetadata, PERMISSIONS_KEY } from "../decorators/permission.decorator";
import { IS_PUBLIC_KEY } from "../../auth/decorators/public.decorator";
import { UserRequestDto } from "../../auth/dto/auth.dto";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const metadata = this.reflector.getAllAndOverride<PermissionMetadata>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!metadata || !metadata.permissions || metadata.permissions.length === 0) {
      return true;
    }

    const { permissions: requiredPermissions, requireAll } = metadata;

    const request = context.switchToHttp().getRequest<{ user: UserRequestDto }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!user.permissions || !Array.isArray(user.permissions)) {
      throw new ForbiddenException();
    }

    const userPermissions: string[] = user.permissions;

    const hasPermission = requireAll
      ? requiredPermissions.every((p) => userPermissions.includes(p))
      : requiredPermissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      throw new ForbiddenException();
    }

    return true;
  }
}
