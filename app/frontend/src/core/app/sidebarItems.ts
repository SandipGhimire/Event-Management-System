import type { SidebarItem } from "@/core/types/app/sidebar.type";

const sidebarItems = (): SidebarItem[] => {
  return [
    {
      label: "Dashboard",
    },
    {
      label: "Dashboard",
      icon: "layout-dashboard",
      to: "/",
    },
    {
      label: "Event",
    },
    {
      label: "Attendees",
      icon: "users",
      to: "/event/attendees",
    },
    {
      label: "Scanner",
      icon: "scan",
      to: "/event/scanner",
    },
    {
      label: "Tasks",
      icon: "clipboard-list",
      to: "/event/tasks",
    },
    {
      label: "Sponsors",
    },
    {
      label: "Sponsors List",
      icon: "handshake",
      to: "/sponsors",
    },
    {
      label: "Settings",
    },
    {
      label: "Roles",
      icon: "square-pen",
      to: "/settings/roles",
    },
    {
      label: "Users",
      icon: "user-lock",
      to: "/settings/users",
    },
    {
      label: "Demo",
    },
    {
      label: "Infrastructure",
      icon: "database",
      to: "/demo/static",
    },
  ];
};

export default sidebarItems;
