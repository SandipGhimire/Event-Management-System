import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ModalProps } from "@/core/types/component/modal";

const sizeClasses: Record<string, string> = {
  sm: "modal-sm",
  md: "modal-md",
  lg: "modal-lg",
  xl: "modal-xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlay = false,
  showCloseButton = true,
  footer,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const prevIsOpen = useRef(isOpen);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Opening
    if (isOpen && !prevIsOpen.current) {
      setMounted(true);
      requestAnimationFrame(() => {
        setAnimClass("modal-entering");
      });
    }
    // Closing
    if (!isOpen && prevIsOpen.current) {
      setAnimClass("modal-exiting");
      exitTimer.current = setTimeout(() => {
        setMounted(false);
        setAnimClass("");
      }, 250);
    }
    prevIsOpen.current = isOpen;

    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [isOpen]);

  // Handle initial mount where isOpen is already true
  useEffect(() => {
    if (isOpen && !mounted) {
      setMounted(true);
      requestAnimationFrame(() => {
        setAnimClass("modal-entering");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (mounted) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [mounted, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <div className={`modal-overlay ${animClass}`} onClick={closeOnOverlay ? onClose : undefined}>
      <div className={`modal-panel ${sizeClasses[size]} ${animClass}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-header-title">{title}</h2>
          {showCloseButton && (
            <button className="modal-header-close" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
