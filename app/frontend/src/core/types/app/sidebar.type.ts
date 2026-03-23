import type { IconName } from "lucide-react/dynamic";

export type SidebarItem = {
  label: string;
  to?: string;
  icon?: IconName;
  isVisible?: boolean;
  children?: {
    label: string;
    to: string;
    isVisible?: boolean;
  }[];
};
