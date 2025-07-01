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
  const [isFailed, setIsFailed] = useState(false);

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
          setMessages((previousMessages) => [
            ...previousMessages,
            result.data.message,
          ]);
          setIsFailed(false);
        } else {
          setIsFailed(true);
          toast.error(result.error || "Failed to generate response.");
        }
      } catch (error) {
        console.error("Error generating content:", error);
        setIsFailed(true);
        toast.error("Failed to generate response.");
      }
    },
    [chatId, activeModel?.name],
  );

  const handleChatInput = async (content: string) => {
    if (isFailed) setIsFailed(false);

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
          return [...filteredMessages, result.data.message];
        });

        const currentMessages = messages.filter(
          (msg) => msg.id !== tempUserMessage.id,
        );
        const updatedMessages = [...currentMessages, result.data.message];

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

  const onRegenerate = useCallback(async () => {
    if (isFailed) setIsFailed(false);
    setIsLoading(true);

    try {
      await getContent(messages);
    } finally {
      setIsLoading(false);
    }
  }, [getContent, messages, isFailed]);

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
  }, [messages, isLoading, getContent]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Messages
          messages={messages}
          isLoading={isLoading}
          isFailed={isFailed}
          handleRegenerate={onRegenerate}
        />
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="border-border bg-background flex-shrink-0 border-t p-2 sm:p-4">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput onSubmit={handleChatInput} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
