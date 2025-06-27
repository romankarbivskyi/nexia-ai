"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export const createMessage = async ({
  content,
  files,
  chatId,
}: {
  content: string;
  files: FileList | null;
  chatId?: string | null;
}) => {
  const supabase = await createClient();
  let file_urls: string[] | null = null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  if (files) {
    file_urls = await Promise.all(
      Array.from(files).map(async (file) => {
        const { data: uploadData, error } = await supabase.storage
          .from("uploads")
          .upload(`${user.id}/${uuidv4()}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error || !uploadData) {
          console.error("Error uploading file:", error);
          return "";
        }

        const fullPath = uploadData.fullPath;

        const { data: publicUrlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(fullPath);

        return publicUrlData?.publicUrl || "";
      }),
    );
  }

  if (!chatId) {
    const { data, error } = await supabase
      .from("chats")
      .insert({
        title: content.slice(0, 50),
        user_id: user.id,
      })
      .select();

    if (error || !data) {
      console.error("Error creating chat:", error);
      return;
    }

    chatId = data[0].id;
  }

  const { error } = await supabase.from("messages").insert({
    role: "user",
    content,
    files: file_urls,
    user_id: user.id,
    chat_id: chatId,
  });

  if (error) {
    console.error("Error creating message:", error);
    return;
  }

  console.log("Message created successfully");
};
