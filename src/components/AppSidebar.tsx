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
import { LogOut, Plus, Settings, User as UserIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { GroupedChats } from "@/types/chat";
import Link from "next/link";
import { formatDateLabel } from "@/utils/dateFormat";
import Image from "next/image";

export default function AppSidebar() {
  const [user, setUser] = useState<User | null>();
  const [chats, setChats] = useState<GroupedChats>();

  const router = useRouter();
  const supabase = createClient();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const getChats = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("created_at, *")
      .order("created_at", { ascending: true });

    if (error) {
    } else {
      const groupedChats = data.reduce((acc, chat) => {
        const date = new Date(chat.created_at).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(chat);
        return acc;
      }, {});

      setChats(groupedChats);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await redirect("/sign-in");
  };

  useEffect(() => {
    getUser();
    getChats();
  }, []);

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
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <Button className="w-full rounded-3xl" variant="default" asChild>
              <Link href="/">
                <Plus className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  New Chat
                </span>
              </Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        {chats && Object.keys(chats).length > 0 ? (
          Object.entries(chats).map(([key, value]) => (
            <SidebarGroup key={key}>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {formatDateLabel(key)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {value.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <Link href={`/c/${item.id}`}>
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title || "Untitled Chat"}
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
            <Button
              variant="ghost"
              className="h-auto w-full justify-start p-0 py-2"
            >
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
            className="w-min rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
            sideOffset={8}
          >
            <Button
              variant="ghost"
              className="w-full justify-start rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => router.push("/settings")}
            >
              <Settings className="mr-3 h-4 w-4" />
              Account Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => router.push("/profile")}
            >
              <UserIcon className="mr-3 h-4 w-4" />
              View Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Log out
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
}
