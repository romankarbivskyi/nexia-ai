import Chat from "@/components/Chat";
import { createClient } from "@/utils/supabase/server";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select()
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.log("Error fetching messages:", error);
    return;
  }

  return <Chat initialMessages={data || []} />;
}
