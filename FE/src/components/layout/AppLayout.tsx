import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user.store";

export function AppLayout() {
  const { getMyInformation } = useUserStore();
  useEffect(() => {
    getMyInformation();
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen min-w-0 overflow-hidden">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
