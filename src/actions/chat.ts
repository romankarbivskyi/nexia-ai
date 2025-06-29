"use server";

import { createClient } from "@/utils/supabase/server";

export const createMessage = async (
  role: string,
  content: string,
  chatId: string,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
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

  if (error || !data.length) {
    throw new Error(error?.message);
  }

  return { chatId, message: data[0] };
};

export const createChat = async (content: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .insert({
      title: content.slice(0, 50),
      user_id: user.id,
    })
    .select();

  if (chatError || !chatData) {
    throw new Error(chatError?.message);
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

  if (messageError || !messageData.length) {
    throw new Error(messageError?.message);
  }

  return { chatId };
};
