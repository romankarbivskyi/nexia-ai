/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ActionResult } from "@/types/action";
import { createClient } from "@/utils/supabase/server";

export const createMessage = async (
  role: string,
  content: string,
  chatId: string,
): Promise<ActionResult<{ chatId: string; message: any }>> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        role,
        content,
        user_id: user.id,
        chat_id: chatId,
      })
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: "Failed to create message" };
    }

    return {
      success: true,
      data: { chatId, message: data[0] },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const createChat = async (
  content: string,
): Promise<ActionResult<{ chatId: string }>> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert({
        title: content.slice(0, 50),
        user_id: user.id,
      })
      .select();

    if (chatError) {
      return { success: false, error: chatError.message };
    }

    if (!chatData || chatData.length === 0) {
      return { success: false, error: "Failed to create chat" };
    }

    const chatId = chatData[0]?.id;

    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .insert({
        role: "user",
        content,
        user_id: user.id,
        chat_id: chatId,
      })
      .select();

    if (messageError) {
      return { success: false, error: messageError.message };
    }

    if (!messageData || messageData.length === 0) {
      return { success: false, error: "Failed to create initial message" };
    }

    return {
      success: true,
      data: { chatId },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getMessages = async (
  chatId: string,
): Promise<ActionResult<any[]>> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getChats = async (): Promise<ActionResult<any[]>> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteChat = async (
  chatId: string,
): Promise<ActionResult<{ chatId: string }>> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error: chatError } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId)
      .eq("user_id", user.id);

    if (chatError) {
      return { success: false, error: chatError.message };
    }

    return {
      success: true,
      data: { chatId },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateChatTitle = async (
  chatId: string,
  title: string,
): Promise<ActionResult<{ chatId: string; title: string }>> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("chats")
      .update({ title })
      .eq("id", chatId)
      .eq("user_id", user.id)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: "Chat not found or unauthorized" };
    }

    return {
      success: true,
      data: { chatId, title },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteAllChats = async (): Promise<
  ActionResult<{ chatId: string }>
> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error: chatError } = await supabase
      .from("chats")
      .delete()
      .eq("user_id", user.id);

    if (chatError) {
      return { success: false, error: chatError.message };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
