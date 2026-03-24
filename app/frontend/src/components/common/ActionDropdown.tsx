import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import type { TableAction } from "@/core/types/component/dataTable.type";

interface ActionDropdownProps<T> {
  actions: TableAction<T>[];
  row: T;
  instanceId: string;
}

export const ActionDropdown = <T,>({ actions, row, instanceId }: ActionDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      // Close dropdown if any scrollable parent is scrolled
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // Specifically listen to the table body scroll
      const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
      if (tableBody) tableBody.addEventListener("scroll", handleScroll);

      // Also global scroll just in case
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
      if (tableBody) tableBody.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, instanceId]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 rounded-sm hover:bg-surface-alt transition-colors duration-200 border border-transparent active:border-border"
      >
        <MoreVertical className="w-4 h-4 text-text-secondary" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-48 rounded-sm shadow-lg bg-white border border-border z-5 animate-in fade-in zoom-in-95 duration-100"
          style={{ transformOrigin: "top right" }}
        >
          <div className="py-1" role="menu">
            {actions.map((action, idx) => {
              if (action.hidden && action.hidden(row)) return null;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface-alt transition-colors text-left ${action.className || ""}`}
                  role="menuitem"
                >
                  {action.icon && (
                    <span className="mr-3 w-4 h-4 flex items-center justify-center opacity-70">{action.icon}</span>
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
