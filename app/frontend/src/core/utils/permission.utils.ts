import { useAuthStore } from "@/store/auth/auth.store";

/**
 * Checks if the current user has the required permission(s).
 *
 * @param permission A single permission key string or an array of permission key strings.
 * @param allRequired If true and permission is an array, all permissions in the array must be present.
 *                    If false and permission is an array, at least one permission must be present.
 *                    Defaults to false.
 * @returns boolean indicating if the user has the required permission(s).
 */
export const checkPermission = (permission: string | string[], allRequired: boolean = false): boolean => {
  const user = useAuthStore.getState().user;
  const userPermissions = user?.permissions || [];

  // Super Admin bypass: if user has '*' permission, they have all permissions
  if (userPermissions.includes("*")) {
    return true;
  }

  if (Array.isArray(permission)) {
    if (allRequired) {
      return permission.every((p) => userPermissions.includes(p));
    } else {
      return permission.some((p) => userPermissions.includes(p));
    }
  }

  return userPermissions.includes(permission);
};

/**
 * A custom hook for checking permissions inside React components.
 * This ensures the component re-renders when the user's permissions change.
 */
export const useHasPermission = (permission: string | string[], allRequired: boolean = false): boolean => {
  const userPermissions = useAuthStore((state) => state.user?.permissions || []);

  if (userPermissions.includes("*")) {
    return true;
  }

  if (Array.isArray(permission)) {
    if (allRequired) {
      return permission.every((p) => userPermissions.includes(p));
    } else {
      return permission.some((p) => userPermissions.includes(p));
    }
  }

  return userPermissions.includes(permission);
};
