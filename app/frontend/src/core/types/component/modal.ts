export interface ButtonConfig {
  label: string;
  onClick?: () => void;
  className?: string;
}

export interface ModalProps {
  header: {
    label: string;
    count?: number | string;
  };
  buttons?: ButtonConfig[];
  children: React.ReactNode;
}
