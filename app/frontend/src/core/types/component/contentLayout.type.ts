export interface ButtonConfig {
  label: string;
  onClick?: () => void;
  className?: string;
  isVisible?: boolean;
}

export interface ContentLayoutProps {
  header: {
    label: string;
    count?: number | string;
  };
  buttons?: ButtonConfig[];
  children: React.ReactNode;
}
