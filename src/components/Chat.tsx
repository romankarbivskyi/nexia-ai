"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { Message } from "@/types/message";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { createMessage } from "@/actions/chat";
import { generateContent } from "@/lib/pollinations";
import { useModelStore } from "@/store/useModelStore";

interface ChatProps {
  initialMessages?: Message[];
}

export default function Chat({ initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { model } = useModelStore();

  const params = useParams();
  const chatId = params.chatId as string;

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const getContent = useCallback(
    async (currentMessages: Message[]) => {
      try {
        const content = await generateContent(currentMessages, model?.name);
        const result = await createMessage("assistant", content, chatId);

        if (result && result.message) {
          setMessages((previosMessages) => [
            ...previosMessages,
            result.message,
          ]);
        } else {
          toast.error("Failed to create message.");
        }
      } catch (err) {
        console.error("Error generation content:", err);
        toast.error("Failed to generate response.");
      }
    },
    [chatId, model?.name],
  );

  const handleChatInput = async (content: string) => {
    setIsLoading(true);
    try {
      const result = await createMessage("user", content, chatId);

      if (result && result.message) {
        const updatedMessages = [...messages, result.message];
        setMessages(updatedMessages);
        await getContent(updatedMessages);
      } else {
        toast.error("Failed to create message.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(
          err.message || "An error occurred while creating a message",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (messages && messages.length === 1 && messages[0].role === "user") {
      const handleInitialMessage = async () => {
        setIsLoading(true);
        try {
          await getContent(messages);
        } finally {
          setIsLoading(false);
        }
      };
      handleInitialMessage();
    }
  }, [messages, isLoading, getContent]);

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Messages messages={messages} isLoading={isLoading} />
        <div ref={bottomRef}></div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSubmit={handleChatInput} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
