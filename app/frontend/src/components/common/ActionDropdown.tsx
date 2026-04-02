import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import type { TableAction } from "@/core/types/component/dataTable.type";
import { MoreHorizontal } from "lucide-react";

interface ActionDropdownProps<T> {
  actions: TableAction<T>[];
  row: T;
  instanceId: string;
}

export const ActionDropdown = <T,>({ actions, row, instanceId }: ActionDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Smart position calculation: check if dropdown fits below, otherwise flip up
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current || !menuRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Also check if we're inside a scrollable table body
    const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
    let containerBottom = viewportHeight;
    if (tableBody) {
      const tableRect = tableBody.getBoundingClientRect();
      containerBottom = tableRect.bottom;
    }

    const spaceBelow = Math.min(viewportHeight, containerBottom) - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Open upward if not enough space below but enough above
    setOpenUpward(spaceBelow < menuHeight + 8 && spaceAbove > menuHeight + 8);
  }, [instanceId]);

  // Calculate position immediately when menu is opened (before paint)
  useLayoutEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
      // if (tableBody) tableBody.addEventListener("scroll", handleScroll);

      // window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
      if (tableBody) tableBody.removeEventListener("scroll", handleScroll);
      // window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, instanceId]);

  return (
    <div className="relative inline-block text-middle" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-1 bg-primary text-white rounded-sm hover:bg-primary-light cursor-pointer transition-colors duration-200 border border-transparent px-2"
      >
        <MoreHorizontal className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 w-48 rounded-sm shadow-lg bg-white border border-border z-5 animate-in fade-in zoom-in-95 duration-100"
          style={{
            ...(openUpward
              ? { bottom: "100%", marginBottom: 4, transformOrigin: "bottom right" }
              : { top: "100%", marginTop: 4, transformOrigin: "top right" }),
          }}
        >
          <div className="py-1" role="menu">
            {actions.map((action, idx) => {
              if (action.hidden && action.hidden(row)) return null;
              return (
                <button
                  key={idx}
                  disabled={action.disabled?.(row)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (action.disabled?.(row)) return;
                    action.onClick(row);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm text-text-primary transition-colors text-left ${
                    action.disabled?.(row) ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-alt"
                  } ${action.className || ""}`}
                  role="menuitem"
                >
                  {action.icon && (
                    <span className="mr-3 w-4 h-4 flex items-center justify-center opacity-70">
                      <action.icon />
                    </span>
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
