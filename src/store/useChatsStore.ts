/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Chat, GroupedChats } from "@/types/chat";
import { SupabaseClient } from "@supabase/supabase-js";

interface ChatsState {
  chats: GroupedChats;
  activeChat: Chat | null;
  getChats: (
    supabase: SupabaseClient<any, "public", any>,
    userId: string,
  ) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
  refreshChats: (
    supabase: SupabaseClient<any, "public", any>,
    userId: string,
  ) => Promise<void>;
}

export const useChatsStore = create<ChatsState>()((set, get) => ({
  chats: {},
  activeChat: null,

  getChats: async (supabase: SupabaseClient, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }

      if (data) {
        const groupedChats = data.reduce((acc, chat) => {
          const date = new Date(chat.created_at).toISOString().split("T")[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(chat);
          return acc;
        }, {} as GroupedChats);

        const sortedChats = Object.keys(groupedChats)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .reduce((acc, key) => {
            acc[key] = groupedChats[key];
            return acc;
          }, {} as GroupedChats);

        set({ chats: sortedChats });
      } else {
        set({ chats: {} });
      }
    } catch (error) {
      console.error("Error in getChats:", error);
      set({ chats: {} });
    }
  },

  refreshChats: async (supabase: SupabaseClient, userId: string) => {
    const { getChats } = get();
    await getChats(supabase, userId);
  },

  setActiveChat: (chatId) =>
    set((state) => {
      let foundChat: Chat | null = null;
      if (state.chats && chatId) {
        for (const chats of Object.values(state.chats)) {
          const chat = (chats as Chat[]).find((c: Chat) => c.id === chatId);
          if (chat) {
            foundChat = chat;
            break;
          }
        }
      }
      return { activeChat: foundChat };
    }),
}));
