/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Chat } from "@/types/chat";
import { SupabaseClient } from "@supabase/supabase-js";

interface ChatsState {
  chats: Chat[];
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
  chats: [],
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

      set({ chats: data });
    } catch (error) {
      console.error("Error in getChats:", error);
      set({ chats: [] });
    }
  },

  refreshChats: async (supabase: SupabaseClient, userId: string) => {
    const { getChats } = get();
    await getChats(supabase, userId);
  },

  setActiveChat: (chatId) =>
    set((state) => {
      let foundChat: Chat | undefined;
      if (state.chats && chatId) {
        foundChat = state.chats.find((c) => c.id === chatId);
      }
      return { activeChat: foundChat };
    }),
}));
