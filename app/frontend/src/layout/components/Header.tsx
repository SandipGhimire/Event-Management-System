import { useCoreStore } from "@/store/app/core.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { PanelLeftClose, PanelRightClose, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function Header() {
  const { isSidebarOpen, toggleSidebar } = useCoreStore();
  const { user, logout } = useAuthStore();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const logoutUser = async () => {
    setIsUserDropdownOpen(false);
    await logout(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center">
        <div
          className={`${isSidebarOpen ? "w-64 min-w-64 max-w-64" : "w-20 min-w-20 max-w-20"} border-r transition-all duration-300 ease-in-out h-full flex items-cente`}
        >
          <div className="flex items-center gap-2 w-full justify-center">
            <span
              className={`block h-1 rounded-full bg-primary transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-14" : "w-0"}`}
            ></span>
            <span className="block rounded-sm px-2 py-1 bg-secondary text-white font-bold">AMS</span>
            <span
              className={`block h-1 rounded-full bg-primary transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-14" : "w-0"}`}
            ></span>
          </div>
        </div>
        <div className={`px-4 flex items-center justify-between w-full`}>
          <button className="btn btn-icon btn-outline-secondary" onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <PanelLeftClose size={24} />
            ) : (
              <PanelRightClose size={24} />
            )}
          </button>
          <div className="relative">
            <div
              className="flex items-center gap-1 cursor-pointer select-none"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user.fullName.split(" ")[0][0]}
              </div>
              <div className="transition-all hover:bg-primary/20 py-2 px-2 rounded-sm hover:text-primary">
                {user.fullName}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={dropdownRef}
        className={`fixed right-4 bg-white border rounded-sm shadow-md mt-2 w-64 z-51 top-12
          transition-all duration-300 ease-in-out transform
          ${
            isUserDropdownOpen
              ? "opacity-100 scale-100 visible pointer-events-auto"
              : "opacity-0 scale-95 invisible pointer-events-none"
          }
        `}
      >
        <div>
          <div className="flex items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-2xl shrink-0">
              {user.fullName.split(" ")[0][0]}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-primary truncate">{user.fullName}</div>
              <div className="text-xs text-secondary truncate">{user.email}</div>
            </div>
          </div>
          <hr />
          <div className="px-2 py-1">
            <button
              onClick={logoutUser}
              className="px-2 py-2 w-full text-left text-red-500 hover:bg-red-500/10 rounded-sm cursor-pointer transition flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
