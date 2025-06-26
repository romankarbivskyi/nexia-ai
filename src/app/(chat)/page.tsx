"use client";

import ChatInput from "@/components/ChatInput";

export default function Page() {
  const handleChatCreation = async (content: string) => {
    console.log(content);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <h1 className="text-xl md:text-2xl">What can I help with?</h1>
      <ChatInput onSubmit={handleChatCreation} />
    </div>
  );
}
