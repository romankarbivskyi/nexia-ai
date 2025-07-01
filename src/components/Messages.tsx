import { Message as IMessage } from "@/types/message";
import Message from "./Message";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

interface MessagesProps {
  messages: IMessage[];
  isLoading?: boolean;
  isFailed?: boolean;
}

export default function Messages({
  messages,
  isLoading,
  isFailed,
}: MessagesProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="flex flex-col gap-4">
        {messages && messages.length > 0 ? (
          messages.map(({ id, content, role }) => (
            <Message key={id} content={content} role={role} />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}
        {isLoading && (
          <div className="flex-1 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              </div>
              <span className="text-sm text-gray-500">AI is typing...</span>
            </div>
          </div>
        )}
        {isFailed && (
          <Alert
            variant="destructive"
            className="max-w-max space-y-2 !text-base"
          >
            <AlertCircleIcon />
            <AlertTitle>Failed to generate response.</AlertTitle>
            <Button
              variant="outline"
              size="sm"
              className="!border-destructive hover:!border-accent-foreground w-min"
            >
              Regenerate
            </Button>
          </Alert>
        )}
      </div>
    </div>
  );
}
