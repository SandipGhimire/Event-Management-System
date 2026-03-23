import { useCoreStore } from "@/store/app/core.store";
import { DynamicIcon } from "lucide-react/dynamic";

export default function Header() {
  const { isSidebarOpen, toggleSidebar } = useCoreStore();
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center">
        <div
          className={`${isSidebarOpen ? "w-64" : "w-20"} border-r transition-all duration-300 ease-in-out h-full flex items-cente`}
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
        <div className={`px-4 flex items-center justify-between w-[calc(100%-${isSidebarOpen ? "16rem" : "5rem"})]`}>
          <button className="btn btn-icon btn-outline-secondary" onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <DynamicIcon name="panel-left-close" size={24} />
            ) : (
              <DynamicIcon name="panel-right-close" size={24} />
            )}
          </button>
          <div className="flex items-center gap-2 border rounded-sm px-2 py-1">
            <DynamicIcon name="user" size={18} strokeWidth={2.5} />
            <div>Username</div>
          </div>
        </div>
      </div>
    </>
  );
}
