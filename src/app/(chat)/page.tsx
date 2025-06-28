"use client";

import ChatInput from "@/components/ChatInput";
import { createMessage } from "./actions";
import { useChatsStore } from "@/store/useChatsStore";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default function Page() {
  const { refreshChats, setActiveChat } = useChatsStore();

  const handleChatCreation = async (
    content: string,
    files: FileList | null,
  ) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { chatId } = await createMessage({
      content,
      files,
    });

    if (!user || !chatId) return;

    await refreshChats(supabase, user.id);
    setActiveChat(chatId);

    await redirect(`/c/${chatId}`);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <h1 className="text-xl md:text-2xl">What can I help with?</h1>
      <ChatInput onSubmit={handleChatCreation} />
    </div>
  );
}
