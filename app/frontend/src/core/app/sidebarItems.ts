import type { SidebarItem } from "@/core/types/app/sidebar.type";
import { LayoutDashboard, Users, Scan, ClipboardList, Handshake, SquarePen, UserLock } from "lucide-react";

const sidebarItems = (): SidebarItem[] => {
  return [
    {
      label: "Dashboard",
    },
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/",
      permission: "dashboard.view",
    },
    {
      label: "Event",
    },
    {
      label: "Attendees",
      icon: Users,
      to: "/event/attendees",
      permission: "attendee.list",
    },
    {
      label: "Scanner",
      icon: Scan,
      to: "/event/scanner",
      permission: "attendee.scan",
    },
    {
      label: "Tasks",
      icon: ClipboardList,
      to: "/event/tasks",
      permission: "task.list",
    },
    {
      label: "Sponsors",
    },
    {
      label: "Sponsors List",
      icon: Handshake,
      to: "/sponsors",
      permission: "sponsor.list",
    },
    {
      label: "Settings",
    },
    {
      label: "Roles",
      icon: SquarePen,
      to: "/settings/roles",
      permission: "role.list",
    },
    {
      label: "Users",
      icon: UserLock,
      to: "/settings/users",
      permission: "user.list",
    },
  ];
};

export default sidebarItems;
