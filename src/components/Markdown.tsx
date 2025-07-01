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
          <p className="text-foreground mb-2 leading-relaxed last:mb-0">
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
              )}
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className="text-foreground font-mono text-xs sm:text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre
            className={cn(
              "overflow-x-auto rounded-lg p-3 text-xs sm:text-sm",
              "my-3 break-words whitespace-pre-wrap",
              "bg-muted text-muted-foreground",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "border-border border",
            )}
          >
            {children}
          </pre>
        ),
        ul: ({ children }) => (
          <ul className="text-foreground mb-2 ml-4 list-disc space-y-1 last:mb-0">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="text-foreground mb-2 ml-4 list-decimal space-y-1 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        h1: ({ children }) => (
          <h1 className="text-foreground border-border mb-3 border-b pb-1 text-lg font-bold sm:text-xl">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-foreground mb-2 text-base font-bold sm:text-lg">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-foreground mb-2 text-sm font-bold sm:text-base">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-foreground mb-2 text-sm font-semibold">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-foreground mb-2 text-xs font-semibold sm:text-sm">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-muted-foreground mb-2 text-xs font-semibold">
            {children}
          </h6>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={cn(
              "border-border text-muted-foreground my-3 border-l-4 pl-4 italic",
              "bg-muted/50 rounded-r-md py-2",
            )}
          >
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="border-border my-3 overflow-x-auto rounded-md border">
            <table className="min-w-full text-xs sm:text-sm">{children}</table>
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
          <th className="border-border text-foreground border-r px-3 py-2 text-left font-semibold last:border-r-0">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-border text-foreground border-r px-3 py-2 last:border-r-0">
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
            className="text-primary decoration-primary/50 hover:decoration-primary underline transition-colors"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="text-foreground font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-foreground italic">{children}</em>
        ),
        del: ({ children }) => (
          <del className="text-muted-foreground line-through">{children}</del>
        ),
        hr: () => <hr className="border-border my-4 border-0 border-t" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
