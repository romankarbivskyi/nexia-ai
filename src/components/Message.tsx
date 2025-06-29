"use client";

import { cn } from "@/lib/utils";
import Markdown from "./Markdown";

interface MessageProps {
  content: string;
  role: string;
}

export default function Message({ content, role }: MessageProps) {
  return (
    <div className="flex w-full">
      <div
        className={cn(
          "word-wrap overflow-wrap-anywhere max-w-full rounded-xl px-3 py-2 text-sm break-words sm:px-4 sm:py-3 sm:text-base",
          role === "user"
            ? "ml-auto self-end bg-blue-500 text-white"
            : "mr-auto self-start bg-gray-100 text-gray-900",
        )}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
