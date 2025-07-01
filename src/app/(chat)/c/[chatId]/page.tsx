import Chat from "@/components/Chat";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sing-in");
  }

  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .select()
    .eq("chat_id", chatId)
    .eq("user_id", user.id);

  if (chatError || !chatData) {
    console.log("Error fetching chat:", chatError);
    redirect("/");
  }

  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.log("Error fetching messages:", messagesError);
    redirect("/");
  }

  return <Chat initialMessages={messagesData || []} />;
}
