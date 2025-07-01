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
          "word-wrap overflow-wrap-anywhere max-w-full rounded-xl border px-4 py-3 text-sm break-words sm:text-base",
          role === "user"
            ? "ml-auto self-end bg-blue-500 text-white"
            : "bg-card mr-auto self-start text-gray-900",
        )}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
