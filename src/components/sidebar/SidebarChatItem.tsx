"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Ellipsis, Pen, Delete } from "lucide-react";

interface SidebarChatItemProps {
  chat: {
    id: string;
    title: string;
  };
  currentChatId: string | undefined;
  onRename: (chatId: string, newTitle: string) => Promise<void>;
  onDelete: (chatId: string) => Promise<void>;
}

export default function SidebarChatItem({
  chat,
  currentChatId,
  onRename,
  onDelete,
}: SidebarChatItemProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle || "Untitled Chat");
  };

  const saveEdit = async () => {
    if (editingChatId) {
      await onRename(editingChatId, editingTitle);
      setEditingChatId(null);
      setEditingTitle("");
    }
  };

  const cancelEdit = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  return (
    <SidebarMenuItem key={chat.id}>
      {editingChatId === chat.id ? (
        <div className="flex flex-1 items-center gap-1 px-2 py-1">
          <Input
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveEdit();
              } else if (e.key === "Escape") {
                cancelEdit();
              }
            }}
            className="h-6 border-0 bg-transparent p-0 text-sm focus-visible:ring-1"
            autoFocus
            onBlur={saveEdit}
          />
        </div>
      ) : (
        <SidebarMenuButton
          isActive={chat.id === currentChatId}
          className="flex justify-between group-data-[collapsible=icon]:hidden"
        >
          <Link href={`/c/${chat.id}`} className="flex-1 truncate">
            {chat.title || "Untitled Chat"}
          </Link>
          <Popover>
            <PopoverTrigger className="opacity-0 hover:opacity-100">
              <Ellipsis />
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              className="w-min rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
              sideOffset={8}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => startEditing(chat.id, chat.title)}
              >
                <Pen className="mr-2 h-4 w-4" />
                Rename
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-red-600 hover:bg-red-50"
                onClick={() => onDelete(chat.id)}
              >
                <Delete className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
