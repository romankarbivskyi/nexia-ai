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
          "overflow-hidden rounded-xl border px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base",
          "max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]",
          "overflow-wrap-anywhere min-w-0 break-words",
          role === "user"
            ? "bg-primary text-primary-foreground ml-auto self-end"
            : "bg-card text-foreground border-border mr-auto self-start",
        )}
      >
        <div className="max-w-full min-w-0">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
}
