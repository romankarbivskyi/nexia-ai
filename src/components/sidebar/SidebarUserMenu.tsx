"use client";

import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { SidebarFooter } from "../ui/sidebar";
import { User } from "@supabase/supabase-js";
import { useModalStore } from "@/store/useModalStore";

interface SidebarUserMenuProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

export default function SidebarUserMenu({
  user,
  onSignOut,
}: SidebarUserMenuProps) {
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

  const { openModal } = useModalStore();

  return (
    <SidebarFooter>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start p-2 group-data-[collapsible=icon]:px-0"
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
              <span className="text-sm font-medium">
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
          className="w-min rounded-lg border p-2 shadow-lg"
          sideOffset={8}
        >
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => openModal("settings", { defaultTab: "general" })}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => openModal("settings", { defaultTab: "profile" })}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-red-600 hover:bg-red-50"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </PopoverContent>
      </Popover>
    </SidebarFooter>
  );
}
