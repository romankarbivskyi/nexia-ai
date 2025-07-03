import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import CodeBlock from "./CodeBlock";

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
            <p className="overflow-wrap-anywhere mb-2 leading-relaxed break-words last:mb-0">
              {children}
            </p>
          ),
          code: CodeBlock,
          pre: ({ children }) => (
            <div className="overflow-hidden">{children}</div>
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
            <li className="overflow-wrap-anywhere leading-relaxed break-words">
              {children}
            </li>
          ),
          h1: ({ children }) => (
            <h1 className="border-border overflow-wrap-anywhere mb-3 border-b pb-1 text-base font-bold break-words sm:text-lg">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="overflow-wrap-anywhere mb-2 text-sm font-bold break-words sm:text-base">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="overflow-wrap-anywhere mb-2 text-sm font-bold break-words">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="overflow-wrap-anywhere mb-2 text-xs font-semibold break-words sm:text-sm">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="overflow-wrap-anywhere mb-2 text-xs font-semibold break-words">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-muted-foreground overflow-wrap-anywhere mb-2 text-xs font-semibold break-words">
              {children}
            </h6>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-border text-muted-foreground bg-muted/50 my-2 max-w-full overflow-hidden rounded-r-md border-l-4 py-2 pl-3 break-words italic sm:my-3 sm:pl-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="border-border my-2 max-w-full overflow-x-auto rounded-md border sm:my-3">
              <table className="bg-card min-w-full text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-border bg-card divide-y">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border-border text-foreground overflow-wrap-anywhere border-r px-2 py-2 text-left font-semibold break-words last:border-r-0 sm:px-3">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-border text-foreground overflow-wrap-anywhere border-r px-2 py-2 break-words last:border-r-0 sm:px-3">
              {children}
            </td>
          ),
          img: ({ ...props }) => (
            <img
              {...props}
              className="border-border my-2 h-auto max-w-full rounded-lg border shadow-sm sm:max-w-4/5"
            />
          ),
          a: ({ children, ...props }) => (
            <a
              {...props}
              className="text-primary decoration-primary/50 hover:decoration-primary overflow-wrap-anywhere break-all underline transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="overflow-wrap-anywhere font-semibold break-words">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="overflow-wrap-anywhere break-words italic">
              {children}
            </em>
          ),
          del: ({ children }) => (
            <del className="text-muted-foreground overflow-wrap-anywhere break-words line-through">
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
