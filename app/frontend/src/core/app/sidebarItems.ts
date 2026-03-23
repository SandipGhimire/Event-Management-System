import type { SidebarItem } from "@/core/types/app/sidebar.type";

const sidebarItems = (): SidebarItem[] => {
  return [
    //header
    {
      label: "Dashboard",
    },
    // single item
    {
      label: "Dashboard",
      icon: "layout-dashboard",
      to: "/",
    },
  ];
};

export default sidebarItems;
