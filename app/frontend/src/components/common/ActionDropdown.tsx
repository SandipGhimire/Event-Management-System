import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import type { TableAction } from "@/core/types/component/dataTable.type";
import { MoreHorizontal } from "lucide-react";

interface ActionDropdownProps<T> {
  actions: TableAction<T>[];
  row: T;
  instanceId: string;
}

export const ActionDropdown = <T,>({ actions, row, instanceId }: ActionDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Position the menu directly via DOM manipulation (no setState, no cascading render)
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current || !menuRef.current) return;

    const menu = menuRef.current;
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Check if we're inside a scrollable table body
    const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
    let containerBottom = viewportHeight;
    if (tableBody) {
      const tableRect = tableBody.getBoundingClientRect();
      containerBottom = tableRect.bottom;
    }

    const spaceBelow = Math.min(viewportHeight, containerBottom) - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    const shouldOpenUpward = spaceBelow < menuHeight + 8 && spaceAbove > menuHeight + 8;

    // Apply position directly to the DOM element — avoids setState in effect
    if (shouldOpenUpward) {
      menu.style.top = "";
      menu.style.marginTop = "";
      menu.style.bottom = "100%";
      menu.style.marginBottom = "4px";
      menu.style.transformOrigin = "bottom right";
    } else {
      menu.style.bottom = "";
      menu.style.marginBottom = "";
      menu.style.top = "100%";
      menu.style.marginTop = "4px";
      menu.style.transformOrigin = "top right";
    }
  }, [isOpen, instanceId]);

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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
      if (tableBody) tableBody.removeEventListener("scroll", handleScroll);
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
