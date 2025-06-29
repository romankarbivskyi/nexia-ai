"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { useChatsStore } from "@/store/useChatsStore";

import AppSidebarHeader from "./SidebarHeader";
import SidebarActions from "./SidebarActions";
import SidebarChatItem from "./SidebarChatItem";
import SidebarUserMenu from "./SidebarUserMenu";

export default function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { getChats, chats, refreshChats } = useChatsStore();

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const currentChatId = pathname.split("/c/")[1];

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (user?.id && pathname.startsWith("/c/")) {
      refreshChats(supabase, user.id);
    }
  }, [pathname, user?.id, refreshChats, supabase]);

  const initializeData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      await getChats(supabase, user.id);
    }
  };

  const handleManualRefresh = async () => {
    if (!user?.id) return;

    setIsRefreshing(true);
    try {
      await refreshChats(supabase, user.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    try {
      const { error } = await supabase
        .from("chats")
        .update({ title: newTitle.trim() })
        .eq("id", chatId);

      if (error) {
        console.error("Error renaming chat:", error);
        return;
      }

      if (user?.id) {
        await refreshChats(supabase, user.id);
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      await supabase.from("messages").delete().eq("chat_id", chatId);

      const { error } = await supabase.from("chats").delete().eq("id", chatId);

      if (error) {
        console.error("Error deleting chat:", error);
        return;
      }

      if (user?.id) {
        await refreshChats(supabase, user.id);
      }

      if (currentChatId === chatId) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />

      <SidebarContent>
        <SidebarActions
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />

        {chats && chats.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Chats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarChatItem
                    key={chat.id}
                    chat={chat}
                    currentChatId={currentChatId}
                    onRename={handleRenameChat}
                    onDelete={handleDeleteChat}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500 group-data-[collapsible=icon]:hidden">
            No chat history
          </div>
        )}
      </SidebarContent>

      <SidebarUserMenu
        user={user}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />
    </Sidebar>
  );
}
