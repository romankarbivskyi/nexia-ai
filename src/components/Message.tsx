"use client";

import Markdown from "./Markdown";

interface MessageProps {
  content: string;
  role: string;
}

export default function Message({ content, role }: MessageProps) {
  if (role === "user") {
    return (
      <div className="flex w-full">
        <div className="xs:max-w-[90%] bg-primary text-primary-foreground xs:px-3 xs:py-2 ml-auto max-w-[95%] min-w-0 overflow-hidden rounded-xl px-2 py-1.5 text-sm break-words sm:max-w-[85%] sm:px-4 sm:py-3 sm:text-base md:max-w-[80%] lg:max-w-[75%]">
          <div className="min-w-0 overflow-hidden">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="xs:max-w-[90%] bg-card text-foreground border-border xs:px-3 xs:py-2 mr-auto max-w-[95%] min-w-0 overflow-hidden rounded-xl border px-2 py-1.5 text-sm break-words sm:max-w-[85%] sm:px-4 sm:py-3 sm:text-base md:max-w-[80%] lg:max-w-[75%]">
        <div className="min-w-0 overflow-hidden">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
}
