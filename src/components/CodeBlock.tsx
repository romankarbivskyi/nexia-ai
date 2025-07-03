/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useTheme } from "next-themes";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!match) {
    return (
      <code
        className="bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono text-xs break-all sm:text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="group relative my-3">
      <div className="bg-muted border-border flex items-center justify-between rounded-t-lg border border-b-0 px-3 py-2">
        <span className="text-muted-foreground text-xs font-medium">
          {language || "code"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-100 transition-opacity group-hover:opacity-80"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        style={theme === "dark" ? materialDark : materialLight}
        language={language}
        PreTag="div"
        className="border-border !mt-0 !mb-0 rounded-t-none border"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          fontSize: "0.75rem",
          lineHeight: "1.25rem",
          backgroundColor: "hsl(var(--muted))",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.75rem",
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            backgroundColor: "transparent",
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
