import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <div className="max-w-full min-w-0 overflow-hidden">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed break-words last:mb-0">
              {children}
            </p>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className={cn(
                  "rounded px-1 py-0.5 font-mono text-xs sm:text-sm",
                  "bg-muted text-muted-foreground",
                  "overflow-wrap-anywhere break-all",
                )}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="font-mono text-xs break-all whitespace-pre-wrap sm:text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              className={cn(
                "overflow-x-auto rounded-lg p-2 text-xs sm:p-3 sm:text-sm",
                "my-2 max-w-full sm:my-3",
                "bg-muted text-muted-foreground",
                "border-border border",
                "break-words whitespace-pre-wrap",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20",
              )}
            >
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="mb-2 ml-4 list-disc space-y-1 break-words last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2 ml-4 list-decimal space-y-1 break-words last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed break-words">{children}</li>
          ),
          h1: ({ children }) => (
            <h1 className="border-border mb-3 border-b pb-1 text-base font-bold break-words sm:text-lg">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 text-sm font-bold break-words sm:text-base">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 text-sm font-bold break-words">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 text-xs font-semibold break-words sm:text-sm">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mb-2 text-xs font-semibold break-words">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-muted-foreground mb-2 text-xs font-semibold break-words">
              {children}
            </h6>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                "border-border text-muted-foreground my-2 border-l-4 pl-3 italic sm:my-3 sm:pl-4",
                "bg-muted/50 rounded-r-md py-2",
                "max-w-full overflow-hidden break-words",
              )}
            >
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="border-border my-2 max-w-full overflow-x-auto rounded-md border sm:my-3">
              <table className="min-w-full text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-border divide-y">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border-border border-r px-2 py-2 text-left font-semibold break-words last:border-r-0 sm:px-3">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-border border-r px-2 py-2 break-words last:border-r-0 sm:px-3">
              {children}
            </td>
          ),
          img: ({ ...props }) => (
            <img
              {...props}
              className="border-border my-2 h-auto max-w-full rounded-lg border shadow-sm"
            />
          ),
          a: ({ children, ...props }) => (
            <a
              {...props}
              className="text-primary decoration-primary/50 hover:decoration-primary break-all underline transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold break-words">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="break-words italic">{children}</em>
          ),
          del: ({ children }) => (
            <del className="text-muted-foreground break-words line-through">
              {children}
            </del>
          ),
          hr: () => (
            <hr className="border-border my-3 border-0 border-t sm:my-4" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
