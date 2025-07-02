"use client";

import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DEFAULT_MODEL } from "@/lib/constants";
import { useModelStore } from "@/store/useModelStore";
import { useUserStore } from "@/store/useUserStore";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setModels, setActiveModel } = useModelStore();
  const { setUser } = useUserStore();

  const supabase = createClient();

  const getModels = async () => {
    const { data, error } = await supabase.from("models").select();

    if (error) {
      console.log("Error fetching models:", error);
      return;
    }

    setModels(data);
    setActiveModel(data.find((m) => m.name === DEFAULT_MODEL) ?? null);
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found");
      return;
    }

    setUser(user);
  };

  useEffect(() => {
    getModels();
    getUser();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-border bg-background flex h-12 items-center border-b px-3 sm:px-4 md:hidden">
            <SidebarTrigger className="h-8 w-8" />
            <div className="text-foreground ml-3 text-sm font-medium">
              Nexia AI
            </div>
          </div>

          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
