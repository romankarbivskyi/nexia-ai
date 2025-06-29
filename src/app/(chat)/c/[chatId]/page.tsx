"use client";

import ChatInput from "@/components/ChatInput";
import Message from "@/components/Message";
import Messages from "@/components/Messages";
import { useModelStore } from "@/store/useModelStore";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Message as MessageType } from "@/types/message";
import { createMessage } from "../../actions";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants";

export default function Page() {
  const { chatId } = useParams<{ chatId: string }>();

  const [messages, setMessages] = useState<MessageType[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { model } = useModelStore();

  const supabase = createClient();

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const getMessages = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select()
      .eq("user_id", user.id)
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Error fetching messages:", error);
      return;
    }

    setMessages(data);
    setTimeout(scrollToBottom, 100);
  }, [chatId, supabase, scrollToBottom]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, scrollToBottom]);

  const saveAssistantMessage = useCallback(
    async (content: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("messages")
        .insert({
          user_id: user.id,
          chat_id: chatId,
          role: "assistant",
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving assistant message:", error);
        return null;
      }

      return data;
    },
    [chatId, supabase],
  );

  const callPollinationsAPI = useCallback(
    async (content: string) => {
      if (!model?.name) {
        toast.error("No model selected");
        console.error("No model selected");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model.name,
            messages: [
              {
                role: "system",
                content: DEFAULT_SYSTEM_PROMPT,
              },
              ...(messages && messages.length > 1
                ? messages.map(({ role, content }) => ({
                    role,
                    content,
                  }))
                : []),
              {
                role: "user",
                content,
              },
            ],
            private: true,
            seed: Math.floor(Math.random() * 900) + 100,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pollinations response:", data);

        const assistantMessage = await saveAssistantMessage(
          data.choices[0].message.content,
        );

        if (assistantMessage) {
          setMessages((prevState) => [...(prevState || []), assistantMessage]);
        }
      } catch (error) {
        console.error("Error with Pollinations API:", error);
        const errorMessage = await saveAssistantMessage(
          "Sorry, I encountered an error processing your request. Please try again.",
        );
        if (errorMessage) {
          setMessages((prevState) => [...(prevState || []), errorMessage]);
        }
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    },
    [model?.name, messages, saveAssistantMessage, scrollToBottom],
  );

  useEffect(() => {
    if (isLoading) return;

    if (messages && messages[messages.length - 1]?.role === "user") {
      callPollinationsAPI(messages[messages.length - 1].content);
    }
  }, [messages, callPollinationsAPI, isLoading]);

  const handleChatInput = async (content: string, files: FileList | null) => {
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      await createMessage({
        content,
        files,
        chatId,
      });

      await getMessages();

      await callPollinationsAPI(content);
    } catch (error) {
      toast.error("Error handling chat input");
      console.error("Error handling chat input:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-1 overflow-hidden">
        <Messages>
          {messages && messages.length > 0 ? (
            messages.map(({ id, content, role }) => (
              <Message key={id} content={content} role={role} />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <p>Start a conversation by typing a message below.</p>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </Messages>
      </div>

      <div className="border-t bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSubmit={handleChatInput} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
