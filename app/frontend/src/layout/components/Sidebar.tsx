import sidebarItems from "@/core/app/sidebarItems";
import { useCoreStore } from "@/store/app/core.store";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const items = sidebarItems();
export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const { isSidebarOpen } = useCoreStore();

  useEffect(() => {
    items.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.to === location.pathname) {
            setOpenDropdown(item.label);
          }
        });
      }
    });
  }, [location.pathname]);

  const isActive = (to?: string) => {
    if (!to) return false;
    return location.pathname === to;
  };

  const hasItemActive = (children?: { to?: string }[]) => {
    if (!children) return false;
    return children.some((child) => isActive(child.to));
  };
  return (
    <div className={`"}`}>
      <div
        className={`fixed top-0 z-1 mt-16 left-0 h-dvh w-64 bg-white border-r select-none transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-4">
          {items.map((item, index) => {
            if (!item.to && !item.children)
              return (
                <div key={index} className="font-bold text-text-secondary uppercase text-xs mb-1 mt-2">
                  {item.label}
                </div>
              );
            else if (item.to && !item.children)
              return (
                <Link
                  to={item.to}
                  key={index}
                  className={`
                    flex items-center gap-2 py-2 px-2 mb-1 rounded-sm cursor-pointer transition-all
                    ${isActive(item.to) ? "bg-primary/10 text-primary" : "hover:bg-primary/10 text-text-secondary"}
                  `}
                >
                  <div>{item.icon ? <DynamicIcon name={item.icon} size={20} /> : ""}</div>
                  <div>{item.label}</div>
                </Link>
              );
            else if (!item.to && item.children) {
              return (
                <div className="relative mb-1" key={index}>
                  <div
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`
                      flex items-center gap-2 py-2 px-2 rounded-sm cursor-pointer transition-all
                      ${
                        hasItemActive(item.children) && openDropdown !== item.label
                          ? "bg-primary/10 text-primary"
                          : openDropdown == item.label
                            ? "bg-primary/10 text-text-secondary"
                            : "hover:bg-primary/10 text-text-secondary"
                      }
                    `}
                  >
                    <div>
                      <div>{item.icon ? <DynamicIcon name={item.icon} size={20} /> : ""}</div>
                    </div>
                    <div>{item.label}</div>
                    <div
                      className={`absolute right-2 transition-transform duration-300 ${openDropdown === item.label ? "-rotate-180" : ""}`}
                    >
                      <DynamicIcon name="chevron-down" size={14} />
                    </div>
                  </div>

                  <div
                    className={`
                      pl-4 border-l-2 border-primary/10 ml-4 pt-1 grid transition-all duration-300 ease-in-out
                      ${openDropdown === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                    `}
                  >
                    <div className="overflow-hidden">
                      {item.children.map((child, index) => {
                        return (
                          <Link
                            to={child.to}
                            key={index}
                            className="block text-text-secondary py-1.5 px-2 mb-0.5 rounded-sm cursor-pointer transition-all hover:bg-primary/10"
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div
        className={`fixed top-16 z-0 bg-black/50 w-full h-dvh md:hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "block" : "hidden"}`}
      ></div>
    </div>
  );
}
