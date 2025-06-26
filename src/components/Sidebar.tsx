"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
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
