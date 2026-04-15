import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen min-w-0 overflow-hidden">
        {/* <div className="absolute top-5 left-4 z-50">
          <SidebarTrigger className="h-8 w-8 bg-white/80 backdrop-blur-sm shadow-md border rounded-md hover:bg-gray-100" />
        </div> */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
