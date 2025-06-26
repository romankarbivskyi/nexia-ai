"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface ConditionalSidebarProps {
  children: React.ReactNode;
}

export default function ConditionalSidebar({
  children,
}: ConditionalSidebarProps) {
  const pathname = usePathname();

  const shouldShowSidebar = pathname === "/" || pathname.startsWith("/c/");

  if (shouldShowSidebar) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <div>
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    );
  }

  return <>{children}</>;
}
