"use client";

import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative flex flex-grow">
        <SidebarTrigger className="absolute md:relative" />
        {children}
      </div>
    </SidebarProvider>
  );
}
