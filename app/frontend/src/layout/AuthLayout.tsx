import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useCoreStore } from "@/store/app/core.store";

export default function AuthLayout() {
  const { isSidebarOpen } = useCoreStore();
  return (
    <div className={`min-h-dvh bg-background flex flex-col`}>
      <Header></Header>
      <Sidebar></Sidebar>
      <div className={`pt-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:pl-68" : "pl-4"}`}>
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
}
