"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  LogOut,
  Plus,
  Settings,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { formatDateLabel } from "@/utils/dateFormat";
import Image from "next/image";
import { useChatsStore } from "@/store/useChatsStore";

export default function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { getChats, chats, refreshChats } = useChatsStore();

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center gap-2">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={32}
          height={32}
          className="flex-shrink-0"
        />
        <h1 className="text-2xl font-bold text-zinc-950 group-data-[collapsible=icon]:hidden">
          NexiaAI
        </h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex gap-2">
              <Button className="flex-1" variant="default" asChild>
                <Link href="/">
                  <Plus className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    New Chat
                  </span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="group-data-[collapsible=icon]:hidden"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {chats && Object.keys(chats).length > 0 ? (
          Object.entries(chats).map(([date, chatList]) => (
            <SidebarGroup key={date}>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {formatDateLabel(date)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chatList.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild>
                        <Link href={`/c/${chat.id}`}>
                          <span className="group-data-[collapsible=icon]:hidden">
                            {chat.title || "Untitled Chat"}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-gray-500 group-data-[collapsible=icon]:hidden">
            No chat history
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto w-full justify-start p-2">
              <Avatar className="mr-2 h-8 w-8 rounded-full group-data-[collapsible=icon]:mr-0">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <AvatarFallback className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
                  {getInitials(
                    user?.user_metadata?.full_name || user?.email || "",
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                </span>
                <span className="max-w-[120px] truncate text-xs text-gray-500">
                  {user?.email}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
            sideOffset={8}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={() => router.push("/profile")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}
