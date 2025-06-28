"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

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
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
            ),
            code: ({ node, className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className={cn(
                    "rounded px-1 py-0.5 font-mono text-xs sm:text-sm",
                    role === "user"
                      ? "bg-blue-600 text-blue-100"
                      : "bg-gray-200 text-gray-800",
                  )}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className="font-mono text-xs sm:text-sm" {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre
                className={cn(
                  "overflow-x-auto rounded-lg p-2 text-xs sm:text-sm",
                  "my-2 break-words whitespace-pre-wrap",
                  "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent",
                  role === "user"
                    ? "bg-blue-600/30 text-blue-50"
                    : "bg-gray-200 text-gray-800",
                )}
              >
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            h1: ({ children }) => (
              <h1 className="mb-2 text-lg font-bold sm:text-xl">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-2 text-base font-bold sm:text-lg">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 text-sm font-bold sm:text-base">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className={cn(
                  "my-2 border-l-4 pl-3 italic",
                  role === "user"
                    ? "border-blue-300 text-blue-100"
                    : "border-gray-300 text-gray-600",
                )}
              >
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-2 overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th
                className={cn(
                  "border px-2 py-1 text-left font-semibold",
                  role === "user"
                    ? "border-blue-300 bg-blue-600/30"
                    : "border-gray-300 bg-gray-200",
                )}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                className={cn(
                  "border px-2 py-1",
                  role === "user" ? "border-blue-300" : "border-gray-300",
                )}
              >
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
