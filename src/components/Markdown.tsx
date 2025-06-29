import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ children }) => (
          <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          return isInline ? (
            <code
              className={cn(
                "rounded bg-gray-200 px-1 py-0.5 font-mono text-xs text-gray-800 sm:text-sm",
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
              "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent bg-gray-200 text-gray-800",
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
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        h1: ({ children }) => (
          <h1 className="mb-2 text-lg font-bold sm:text-xl">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 text-base font-bold sm:text-lg">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 text-sm font-bold sm:text-base">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={cn(
              "my-2 border-l-4 border-gray-300 pl-3 text-gray-600 italic",
            )}
          >
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th
            className={cn(
              "border border-gray-300 bg-gray-200 px-2 py-1 text-left font-semibold",
            )}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className={cn("border border-gray-300 px-2 py-1")}>{children}</td>
        ),
        img: ({ ...props }) => (
          <img {...props} className="h-auto max-w-xs rounded-lg" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
