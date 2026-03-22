import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
// import { DynamicIcon } from "lucide-react/dynamic";
import sidebarItems from "@/core/app/sidebarItems";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const items = sidebarItems();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Auto-open dropdown if child is active on load
  useEffect(() => {
    items.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) => location.pathname === child.to);
        if (isChildActive) {
          setOpenDropdown(item.label);
        }
      }
    });
  }, [location.pathname]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActive = (to?: string) => {
    if (!to) return false;
    return location.pathname === to;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 transition-transform duration-300 lg:translate-x-0 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header (Logo/Title) */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <span className="text-xl font-bold text-primary tracking-tight">Attendees</span>
            <span className="ml-1 text-xs font-medium text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">AMS</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {items.map((item, index) => {
              const isHeader = !item.to && !item.children;
              const hasChildren = !!item.children;

              if (isHeader) {
                return (
                  <div
                    key={index}
                    className="pt-4 pb-1 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider"
                  >
                    {item.label}
                  </div>
                );
              }

              if (hasChildren) {
                const isOpen = openDropdown === item.label;
                return (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                        isOpen
                          ? "bg-primary/5 text-primary"
                          : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* {item.icon && <DynamicIcon name={item.icon as any} size={18} strokeWidth={2} />} */}
                        <span>{item.label}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`grid-row-transition ${isOpen ? "open" : ""}`}>
                      <div className="space-y-1 pl-9">
                        {item.children?.map((child, idx) => (
                          <Link
                            key={idx}
                            to={child.to}
                            onClick={() => {
                              if (window.innerWidth < 1024) onClose();
                            }}
                            className={`block px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                              isActive(child.to)
                                ? "text-primary bg-primary/5"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface-alt"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.to || "#"}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                    isActive(item.to)
                      ? "bg-primary text-white shadow-sm shadow-primary/20"
                      : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                  }`}
                >
                  {/* {item.icon && <DynamicIcon name={item.icon as any} size={18} strokeWidth={2} />} */}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary (Optional, but makes it "fully packed") */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">John Doe</p>
                <p className="text-xs text-text-secondary truncate italic">Senior Volunteer</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
