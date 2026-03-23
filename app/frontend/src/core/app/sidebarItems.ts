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
      icon: "home",
      to: "/",
    },
    //multiple child item
    {
      label: "Stock Verification",
      icon: "blocks",
      children: [
        {
          label: "Opening Stock",
          to: "/stock-verification/opening-stock/",
        },
        {
          label: "Closing Stock",
          to: "/stock-verification/closing-stock/",
        },
      ],
    },
    {
      label: "Stock",
      icon: "blocks",
      children: [
        {
          label: "Opening Stock",
          to: "/stock-verification/opening-stock/",
        },
        {
          label: "Closing Stock",
          to: "/stock-verification/closing-stock/",
        },
        {
          label: "Opening Stock",
          to: "/stock-verification/opening-stock/",
        },
        {
          label: "Closing Stock",
          to: "/stock-verification/closing-stock/",
        },
        {
          label: "Opening Stock",
          to: "/stock-verification/opening-stock/",
        },
        {
          label: "Closing Stock",
          to: "/stock-verification/closing-stock/",
        },
        {
          label: "Opening Stock",
          to: "/stock-verification/opening-stock/",
        },
        {
          label: "Closing Stock",
          to: "/stock-verification/closing-stock/",
        },
      ],
    },
  ];
};

export default sidebarItems;
