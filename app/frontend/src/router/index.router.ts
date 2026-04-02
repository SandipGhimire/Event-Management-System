import type { RouterConfig } from "@/core/types/app/router.type";
import { buildRoutes } from "@/core/utils/router.utils";
import { createBrowserRouter } from "react-router";

const routes: RouterConfig[] = [
  {
    path: "login",
    component: () => import("@/views/Auth/Login"),
    meta: {
      only_guest: true,
    },
  },
  {
    path: "/",
    component: () => import("@/layout/AuthLayout"),
    meta: {
      require_auth: true,
    },
    children: [
      {
        path: "/",
        component: () => import("@/views/Dashboard"),
      },
      {
        path: "event",
        children: [
          {
            path: "attendees",
            component: () => import("@/views/Event/Attendees"),
          },
          {
            path: "scanner",
            component: () => import("@/views/Event/Scanner"),
          },
          {
            path: "tasks",
            component: () => import("@/views/Event/Task"),
          },
        ],
      },
      {
        path: "/sponsors",
        component: () => import("@/views/Sponsors"),
      },
      {
        path: "settings",
        children: [
          {
            path: "roles",
            component: () => import("@/views/Settings/Role"),
          },
          {
            path: "users",
            component: () => import("@/views/Settings/User"),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    component: () => import("@/views/404"),
    meta: {
      require_auth: true,
    },
  },
];

export const router = createBrowserRouter(buildRoutes(routes));
