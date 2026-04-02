import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  to?: string;
  icon?: LucideIcon;
  isVisible?: boolean;
  permission?: string | string[];
  children?: {
    label: string;
    to: string;
    isVisible?: boolean;
    permission?: string | string[];
  }[];
};
