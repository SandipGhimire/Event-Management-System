import { useAuthStore } from "../store/Auth/auth.store";
import { useUIStore } from "../store/useUIStore";
import { useNavigate, useLocation } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: "🏠" },
    { title: "Attendees", path: "/attendees", icon: "👥" },
    { title: "Users", path: "/users", icon: "👤" },
    { title: "Scanned", path: "/scanned", icon: "📋" },
    { title: "Scanner", path: "/scanner", icon: "📸" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" onClick={closeSidebar} />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 w-64 bg-secondary border-r border-gray-800 flex flex-col z-[70] transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-secondary">
              S
            </div>
            <span className="text-xl font-bold text-white tracking-wider">WORKSPACE</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                closeSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-primary text-secondary font-bold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout();
              navigate("/login");
              closeSidebar();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent hover:bg-accent/10 transition-all"
          >
            <span>🚪</span>
            <span>Logout Session</span>
          </button>
        </div>
      </div>
    </>
  );
}
