import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = "permissions";

export interface PermissionMetadata {
  permissions: string[];
  requireAll: boolean;
}

export const Permission = (permissions: (string | string[])[], requireAll: boolean = true) => {
  const flatPermissions = permissions.flat();
  console.log("called");
  return SetMetadata(PERMISSIONS_KEY, { permissions: flatPermissions, requireAll });
};
