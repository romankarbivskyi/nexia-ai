"use client";

import ChatInput from "@/components/ChatInput";
import { createMessage } from "./actions";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <h1 className="text-xl md:text-2xl">What can I help with?</h1>
      <ChatInput
        onSubmit={async (content, files) =>
          await createMessage({
            content,
            files,
          })
        }
      />
    </div>
  );
}
