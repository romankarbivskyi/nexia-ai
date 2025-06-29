"use client";

import AppSidebar from "@/components/AppSidebar";
import ModelSelect from "@/components/ModelSelect";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative flex flex-grow">
        <SidebarTrigger className="absolute md:relative" />
        <div className="absolute left-10 z-10">
          <ModelSelect />
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}
