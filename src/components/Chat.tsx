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
  const processedInitialMessage = useRef(false);

  const { activeModel } = useModelStore();

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
        const content = await generateContent(
          currentMessages,
          activeModel?.name,
        );
        const result = await createMessage("assistant", content, chatId);

        if (result.success && result.data?.message) {
          setMessages((previosMessages) => [
            ...previosMessages,
            result.data?.message,
          ]);
        } else {
          toast.error(result.error || "Failed to create message.");
        }
      } catch (err) {
        console.error("Error generation content:", err);
        toast.error("Failed to generate response.");
      }
    },
    [chatId, activeModel?.name],
  );

  const handleChatInput = async (content: string) => {
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      role: "user",
      created_at: new Date().toISOString(),
      chat_id: chatId,
      user_id: null,
    };

    setMessages((prevMessages) => [...prevMessages, tempUserMessage]);
    setIsLoading(true);

    try {
      const result = await createMessage("user", content, chatId);

      if (result.success && result.data?.message) {
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter(
            (msg) => msg.id !== tempUserMessage.id,
          );
          return [...filteredMessages, result.data?.message];
        });

        const updatedMessages = [...messages, result.data.message];
        await getContent(updatedMessages);
      } else {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempUserMessage.id),
        );
        toast.error(result.error || "Failed to create message.");
      }
    } catch (err: unknown) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempUserMessage.id),
      );

      if (err instanceof Error) {
        toast.error(
          err.message || "An error occurred while creating a message",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      messages &&
      messages.length === 1 &&
      messages[0].role === "user" &&
      !isLoading &&
      !processedInitialMessage.current
    ) {
      processedInitialMessage.current = true;

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
  }, [messages, isLoading]);

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <Messages messages={messages} isLoading={isLoading} isFailed={false} />
        <div ref={bottomRef}></div>
      </div>

      <div className="border-t p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSubmit={handleChatInput} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
