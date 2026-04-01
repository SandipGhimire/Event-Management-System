import type { SidebarItem } from "@/core/types/app/sidebar.type";
import {
  LayoutDashboard,
  Users,
  Scan,
  ClipboardList,
  Handshake,
  SquarePen,
  UserLock,
  Database,
} from "lucide-react";

const sidebarItems = (): SidebarItem[] => {
  return [
    {
      label: "Dashboard",
    },
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/",
    },
    {
      label: "Event",
    },
    {
      label: "Attendees",
      icon: Users,
      to: "/event/attendees",
    },
    {
      label: "Scanner",
      icon: Scan,
      to: "/event/scanner",
    },
    {
      label: "Tasks",
      icon: ClipboardList,
      to: "/event/tasks",
    },
    {
      label: "Sponsors",
    },
    {
      label: "Sponsors List",
      icon: Handshake,
      to: "/sponsors",
    },
    {
      label: "Settings",
    },
    {
      label: "Roles",
      icon: SquarePen,
      to: "/settings/roles",
    },
    {
      label: "Users",
      icon: UserLock,
      to: "/settings/users",
    },
    {
      label: "Demo",
    },
    {
      label: "Infrastructure",
      icon: Database,
      to: "/demo/static",
    },
  ];
};

export default sidebarItems;
