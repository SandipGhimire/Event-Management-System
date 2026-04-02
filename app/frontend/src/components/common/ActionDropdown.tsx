import React, { useState, useEffect, useRef } from "react";
import type { TableAction } from "@/core/types/component/dataTable.type";
import { DynamicIcon } from "lucide-react/dynamic";

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
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      const tableBody = document.querySelector(`[data-instance-id="${instanceId}"] .dt-body`);
      if (tableBody) tableBody.addEventListener("scroll", handleScroll);

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
    <div className="relative inline-block text-middle" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 bg-primary text-white rounded-sm hover:bg-primary-light cursor-pointer transition-colors duration-200 border border-transparent px-2"
      >
        <DynamicIcon name="more-horizontal" className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-0 w-48 rounded-sm shadow-lg bg-white border border-border z-5 animate-in fade-in zoom-in-95 duration-100"
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
                    <span className="mr-3 w-4 h-4 flex items-center justify-center opacity-70">
                      <DynamicIcon name={action.icon} />
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
