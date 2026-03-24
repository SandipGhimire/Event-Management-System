export interface ButtonConfig {
  label: string;
  onClick?: () => void;
  className?: string;
}

export interface ContentLayoutProps {
  header: string;
  buttons?: ButtonConfig[];
  children: React.ReactNode;
}
