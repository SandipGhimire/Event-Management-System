import { redirect } from "react-router";
import type { RouteMeta } from "../types/app/router.type";
import { useAuthStore } from "@/store/auth/auth.store";

export async function beforeRoute(path: string, meta?: RouteMeta) {
  if (!meta) return null;
  console.log(path);

  if (meta.require_auth || meta.only_guest) {
    const { getUser } = useAuthStore.getState();
    await getUser();

    const { isAuthenticated } = useAuthStore.getState();

    if (meta.require_auth && !isAuthenticated) {
      return redirect("/login");
    }

    if (meta.only_guest && isAuthenticated) {
      return redirect("/");
    }
  }

  return null;
}
