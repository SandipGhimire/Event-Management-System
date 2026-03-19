import { useAuthStore } from "../store/Auth/auth.store";
import { useUIStore } from "../store/useUIStore";

export default function Header() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-secondary/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 text-gray-400">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <span className="hidden sm:inline text-sm font-medium">
          Pages / {window.location.pathname.substring(1) || "Home"}
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3 bg-bg-dark px-4 py-1.5 rounded-full border border-gray-800">
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">
            {user?.name?.[0] || "U"}
          </div>
          <span className="text-sm font-medium text-gray-300">{user?.name}</span>
        </div>

        <button className="text-gray-400 hover:text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
