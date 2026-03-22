export type SidebarItem = {
  label: string;
  to?: string;
  icon?: string;
  isVisible?: boolean;
  children?: {
    label: string;
    to: string;
    isVisible?: boolean;
  }[];
};
