"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Ellipsis, Pen, Trash2 } from "lucide-react";

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
    <SidebarMenuItem className="menu-item">
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
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="menu-item__popover h-6 w-6 p-0 opacity-0 transition-opacity"
              >
                <Ellipsis className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              className="bg-background w-min rounded-lg border p-1 shadow-lg"
              sideOffset={8}
            >
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 justify-start text-sm"
                  onClick={() => startEditing(chat.id, chat.title)}
                >
                  <Pen className="mr-2 h-4 w-4" />
                  Rename
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 h-8 justify-start text-sm"
                  onClick={() => onDelete(chat.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
