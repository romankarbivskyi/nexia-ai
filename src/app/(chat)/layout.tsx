"use client";

import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DEFAULT_MODEL } from "@/lib/constants";
import { useModelStore } from "@/store/useModelStore";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setModels, setActiveModel } = useModelStore();

  const getModels = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.from("models").select();

    if (error) {
      console.log("Error fetching models:", error);
      return;
    }

    setModels(data);
    setActiveModel(data.find((m) => m.name === DEFAULT_MODEL) ?? null);
  };

  useEffect(() => {
    getModels();
  }, []);

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
